import { useState, useEffect, useCallback } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { bluetoothService } from '../services/bluetoothService';
import { storageService } from '../services/storageService';
import { base64ToJson } from '../helpers';

const bleManager = new BleManager();

export const useBluetoothManager = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [devices, setDevices] = useState([]);
    const [connectedDevice, setConnectedDevice] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [sensorData, setSensorData] = useState([]);
    const [error, setError] = useState(null);
    const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);

    // Check if Bluetooth is enabled
    const checkBluetoothState = useCallback(async () => {
        try {
            const state = await bleManager.state();
            const enabled = state === 'PoweredOn';
            setIsBluetoothEnabled(enabled);
            return enabled;
        } catch (err) {
            console.error('Error checking Bluetooth state:', err);
            setError('Failed to check Bluetooth state');
            return false;
        }
    }, []);

    // Request Bluetooth permissions (Android only)
    const requestPermissions = useCallback(async () => {
        if (Platform.OS === 'android') {
            try {
                if (Platform.Version >= 31) { // Android 12+
                    const granted = await PermissionsAndroid.requestMultiple([
                        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    ]);

                    return (
                        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED &&
                        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED &&
                        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED
                    );
                } else {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                    );
                    return granted === PermissionsAndroid.RESULTS.GRANTED;
                }
            } catch (err) {
                console.error('Error requesting permissions:', err);
                setError('Failed to request Bluetooth permissions');
                return false;
            }
        }
        return true; // iOS doesn't need runtime permissions for BLE
    }, []);

    // Start scanning for devices
    const startScan = useCallback(async () => {
        try {
            // Clear previous devices
            setDevices([]);
            setError(null);

            // Check if Bluetooth is enabled
            const isEnabled = await checkBluetoothState();
            if (!isEnabled) {
                Alert.alert(
                    'Bluetooth is disabled',
                    'Please enable Bluetooth to scan for devices',
                    [{ text: 'OK' }]
                );
                return;
            }

            // Request permissions
            const permissionsGranted = await requestPermissions();
            if (!permissionsGranted) {
                Alert.alert(
                    'Permissions Required',
                    'Bluetooth and location permissions are required to scan for devices',
                    [{ text: 'OK' }]
                );
                return;
            }

            setIsScanning(true);

            // Start scanning
            bleManager.startDeviceScan(null, null, (error, device) => {
                if (error) {
                    console.error('Error scanning for devices:', error);
                    setError('Failed to scan for devices');
                    setIsScanning(false);
                    return;
                }

                if (device && device.name) {
                    // Only add devices with names
                    setDevices(prevDevices => {
                        // Check if device already exists
                        const exists = prevDevices.some(d => d.id === device.id);
                        if (exists) {
                            // Update existing device
                            return prevDevices.map(d => d.id === device.id ? device : d);
                        } else {
                            // Add new device
                            return [...prevDevices, device];
                        }
                    });
                }
            });

            // Stop scanning after 10 seconds
            setTimeout(() => {
                stopScan();
            }, 10000);
        } catch (err) {
            console.error('Error starting scan:', err);
            setError('Failed to start scanning');
            setIsScanning(false);
        }
    }, [checkBluetoothState, requestPermissions]);

    // Stop scanning
    const stopScan = useCallback(() => {
        if (isScanning) {
            bleManager.stopDeviceScan();
            setIsScanning(false);
        }
    }, [isScanning]);

    // Connect to a device
    const connectToDevice = useCallback(async (device) => {
        try {
            setError(null);

            // Stop scanning if currently scanning
            if (isScanning) {
                stopScan();
            }

            // Connect to device
            const connectedDeviceObj = await device.connect();

            // Discover services and characteristics
            const discoveredDevice = await connectedDeviceObj.discoverAllServicesAndCharacteristics();

            // Store the connected device
            setConnectedDevice(discoveredDevice);
            setIsConnected(true);

            // Save as last connected device
            await storageService.saveLastConnectedDevice({
                id: discoveredDevice.id,
                name: discoveredDevice.name,
            });

            // Set up notification listener for sensor data
            const services = await discoveredDevice.services();

            // Find heart rate service (assume 0x180D is heart rate service UUID)
            const heartRateService = services.find(service => service.uuid === '180d');

            if (heartRateService) {
                const characteristics = await heartRateService.characteristics();

                // Find heart rate measurement characteristic (0x2A37)
                const heartRateMeasurement = characteristics.find(char => char.uuid === '2a37');

                if (heartRateMeasurement) {
                    // Monitor heart rate characteristic
                    discoveredDevice.monitorCharacteristicForService(
                        heartRateService.uuid,
                        heartRateMeasurement.uuid,
                        (error, characteristic) => {
                            if (error) {
                                console.error('Error monitoring characteristic:', error);
                                return;
                            }

                            // Process the heart rate data
                            if (characteristic && characteristic.value) {
                                const decodedValue = base64ToJson(characteristic.value);

                                // Add timestamp to data
                                const dataWithTimestamp = {
                                    ...decodedValue,
                                    timestamp: new Date().toISOString(),
                                };

                                // Update sensor data
                                setSensorData(prevData => [...prevData, dataWithTimestamp]);

                                // Store the data
                                storageService.saveSensorData(dataWithTimestamp);

                                // Notify the bluetooth service
                                bluetoothService.notifyDataReceived(dataWithTimestamp);
                            }
                        }
                    );
                }
            }

            return discoveredDevice;
        } catch (err) {
            console.error('Error connecting to device:', err);
            setError('Failed to connect to device');
            setIsConnected(false);
            return null;
        }
    }, [isScanning, stopScan]);

    // Disconnect from device
    const disconnectDevice = useCallback(async () => {
        try {
            if (connectedDevice) {
                await connectedDevice.cancelConnection();
                setConnectedDevice(null);
                setIsConnected(false);
            }
        } catch (err) {
            console.error('Error disconnecting device:', err);
            setError('Failed to disconnect device');
        }
    }, [connectedDevice]);

    // Clean up on component unmount
    useEffect(() => {
        return () => {
            // Stop scanning if component unmounts
            bleManager.stopDeviceScan();

            // Disconnect if necessary
            if (connectedDevice) {
                connectedDevice.cancelConnection();
            }
        };
    }, [connectedDevice]);

    return {
        isScanning,
        devices,
        connectedDevice,
        isConnected,
        sensorData,
        error,
        isBluetoothEnabled,
        startScan,
        stopScan,
        connectToDevice,
        disconnectDevice,
        checkBluetoothState,
    };
};