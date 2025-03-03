import { useState, useEffect, useCallback } from 'react';
import * as ExpoDevice from 'expo-device';
import { Platform } from 'react-native';

/**
 * Custom hook for scanning Bluetooth devices
 * @param {object} options - Scanning options
 */
const useBluetoothScan = ({
    autoScan = false,
    scanDuration = 10000, // 10 seconds
    filterByName = null,
    filterByServices = null,
} = {}) => {
    const [isScanning, setIsScanning] = useState(false);
    const [devices, setDevices] = useState([]);
    const [error, setError] = useState(null);
    const [isBluetoothAvailable, setIsBluetoothAvailable] = useState(null);

    // Check if Bluetooth is available
    useEffect(() => {
        const checkBluetooth = async () => {
            try {
                // Different checks depending on platform
                if (Platform.OS === 'android') {
                    const isSupported = await ExpoDevice.isAvailableAsync();
                    setIsBluetoothAvailable(isSupported);
                } else if (Platform.OS === 'ios') {
                    // On iOS, we'll assume it's available but will handle permissions separately
                    setIsBluetoothAvailable(true);
                } else {
                    setIsBluetoothAvailable(false);
                }
            } catch (err) {
                console.error('Error checking Bluetooth availability:', err);
                setError(err);
                setIsBluetoothAvailable(false);
            }
        };

        checkBluetooth();
    }, []);

    // Mock scan function - in a real app, replace with actual BLE scanning
    const startScan = useCallback(async () => {
        if (!isBluetoothAvailable) {
            setError(new Error('Bluetooth is not available on this device'));
            return;
        }

        try {
            setIsScanning(true);
            setError(null);

            // For this mock version, we'll simulate finding devices
            // In a real app, you would use the Expo Bluetooth API to scan
            setTimeout(() => {
                const mockDevices = [
                    { id: '00:11:22:33:44:55', name: 'HeartRateMonitor1', rssi: -65 },
                    { id: '66:77:88:99:AA:BB', name: 'BloodPressureMonitor', rssi: -70 },
                    { id: 'CC:DD:EE:FF:00:11', name: 'HealthDevice123', rssi: -80 },
                ];

                // Apply filters if specified
                let filteredDevices = mockDevices;
                if (filterByName) {
                    filteredDevices = filteredDevices.filter(device =>
                        device.name && device.name.toLowerCase().includes(filterByName.toLowerCase())
                    );
                }

                setDevices(filteredDevices);
                setIsScanning(false);
            }, scanDuration);

        } catch (err) {
            console.error('Error scanning for Bluetooth devices:', err);
            setError(err);
            setIsScanning(false);
        }
    }, [isBluetoothAvailable, scanDuration, filterByName, filterByServices]);

    // Stop scanning function
    const stopScan = useCallback(() => {
        // In a real app, you would stop the actual BLE scan here
        setIsScanning(false);
    }, []);

    // Auto-scan if enabled
    useEffect(() => {
        if (autoScan && isBluetoothAvailable) {
            startScan();
        }

        return () => {
            if (isScanning) {
                stopScan();
            }
        };
    }, [autoScan, isBluetoothAvailable]);

    // Clear devices list
    const clearDevices = useCallback(() => {
        setDevices([]);
    }, []);

    return {
        isScanning,
        devices,
        error,
        isBluetoothAvailable,
        startScan,
        stopScan,
        clearDevices,
    };
};

export default useBluetoothScan;