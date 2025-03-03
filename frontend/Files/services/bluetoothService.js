import { BleManager } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';
import { generateMockReading, parseDeviceData } from '../utils/helpers';
import { SIMULATE_DATA } from '../utils/constants';

let bleManager = null;

/**
 * Initialize BLE manager
 * @returns {BleManager} BLE manager instance
 */
export const initializeBluetooth = () => {
    if (!bleManager) {
        bleManager = new BleManager();
    }
    return bleManager;
};

/**
 * Request necessary Bluetooth permissions
 * @returns {Promise<boolean>} Permission granted status
 */
export const requestBluetoothPermissions = async () => {
    if (Platform.OS === 'android') {
        const apiLevel = parseInt(Platform.Version.toString(), 10);

        if (apiLevel >= 31) { // Android 12+
            const results = await Promise.all([
                PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
                ),
                PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
                ),
                PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                ),
            ]);

            return results.every(result => result === PermissionsAndroid.RESULTS.GRANTED);
        } else {
            const result = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            return result === PermissionsAndroid.RESULTS.GRANTED;
        }
    }

    // iOS automatically prompts for permissions
    return true;
};

/**
 * Scan for available Bluetooth devices
 * @param {number} timeoutMs - Scan timeout in milliseconds
 * @param {function} onDeviceFound - Callback for each device found
 * @returns {Promise<Array>} Found devices
 */
export const scanForDevices = async (timeoutMs = 10000, onDeviceFound = null) => {
    if (SIMULATE_DATA) {
        // Return simulated device for testing
        return new Promise(resolve => {
            setTimeout(() => {
                const mockDevice = {
                    id: 'mock-device-123',
                    name: 'Heart Monitor',
                    rssi: -65,
                };

                if (onDeviceFound) {
                    onDeviceFound(mockDevice);
                }

                resolve([mockDevice]);
            }, 1500); // Simulate delay
        });
    }

    try {
        const manager = initializeBluetooth();
        const hasPermission = await requestBluetoothPermissions();

        if (!hasPermission) {
            throw new Error('Bluetooth permissions not granted');
        }

        const devices = [];

        return new Promise((resolve, reject) => {
            // Start scanning
            const subscription = manager.startDeviceScan(
                null, // null means scan for all services
                { allowDuplicates: false },
                (error, device) => {
                    if (error) {
                        subscription.remove();
                        reject(error);
                        return;
                    }

                    if (device && device.name) {
                        // Filter out devices without names
                        const deviceInfo = {
                            id: device.id,
                            name: device.name,
                            rssi: device.rssi,
                        };

                        if (!devices.some(d => d.id === device.id)) {
                            devices.push(deviceInfo);

                            if (onDeviceFound) {
                                onDeviceFound(deviceInfo);
                            }
                        }
                    }
                }
            );

            // Stop scanning after timeout
            setTimeout(() => {
                subscription.remove();
                manager.stopDeviceScan();
                resolve(devices);
            }, timeoutMs);
        });
    } catch (error) {
        console.error('Error scanning for devices:', error);
        throw error;
    }
};

/**
 * Connect to a specific Bluetooth device
 * @param {string} deviceId - Device identifier
 * @returns {Promise<Object>} Connected device
 */
export const connectToDevice = async (deviceId) => {
    if (SIMULATE_DATA) {
        // Simulate connecting to device
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    id: deviceId,
                    name: 'Heart Monitor',
                    connected: true,
                });
            }, 2000); // Simulate connection delay
        });
    }

    try {
        const manager = initializeBluetooth();

        // Connect to device
        const device = await manager.connectToDevice(deviceId);

        // Discover services and characteristics
        await device.discoverAllServicesAndCharacteristics();

        return {
            id: device.id,
            name: device.name,
            connected: true,
        };
    } catch (error) {
        console.error('Error connecting to device:', error);
        throw error;
    }
};

/**
 * Read data from connected device
 * @param {string} deviceId - Device identifier
 * @param {string} serviceUUID - Service UUID
 * @param {string} characteristicUUID - Characteristic UUID
 * @returns {Promise<Object>} Parsed sensor data
 */
export const readDeviceData = async (deviceId, serviceUUID, characteristicUUID) => {
    if (SIMULATE_DATA) {
        // Return simulated data for testing
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(generateMockReading());
            }, 500);
        });
    }

    try {
        const manager = initializeBluetooth();
        const device = await manager.deviceById(deviceId);

        // Read characteristic value
        const characteristic = await device.readCharacteristicForService(
            serviceUUID,
            characteristicUUID
        );

        // Parse the data based on your device's format
        return parseDeviceData(characteristic.value);
    } catch (error) {
        console.error('Error reading device data:', error);
        throw error;
    }
};

/**
 * Subscribe to notifications from device
 * @param {string} deviceId - Device identifier
 * @param {string} serviceUUID - Service UUID
 * @param {string} characteristicUUID - Characteristic UUID
 * @param {function} onDataReceived - Callback for data received
 * @returns {Object} Subscription object with remove method
 */
export const subscribeToDevice = (deviceId, serviceUUID, characteristicUUID, onDataReceived) => {
    if (SIMULATE_DATA) {
        // Set up interval to simulate data received every 15 seconds
        const intervalId = setInterval(() => {
            const mockData = generateMockReading();
            onDataReceived(mockData);
        }, 15000);

        return {
            remove: () => clearInterval(intervalId)
        };
    }

    try {
        const manager = initializeBluetooth();

        // Subscribe to characteristic notifications
        return manager.monitorCharacteristicForDevice(
            deviceId,
            serviceUUID,
            characteristicUUID,
            (error, characteristic) => {
                if (error) {
                    console.error('Error monitoring characteristic:', error);
                    return;
                }

                // Parse received data
                const parsedData = parseDeviceData(characteristic.value);
                onDataReceived(parsedData);
            }
        );
    } catch (error) {
        console.error('Error subscribing to device:', error);
        throw error;
    }
};

/**
 * Disconnect from device
 * @param {string} deviceId - Device identifier
 * @returns {Promise<boolean>} Success status
 */
export const disconnectDevice = async (deviceId) => {
    if (SIMULATE_DATA) {
        return new Promise(resolve => {
            setTimeout(() => resolve(true), 500);
        });
    }

    try {
        const manager = initializeBluetooth();
        await manager.cancelDeviceConnection(deviceId);
        return true;
    } catch (error) {
        console.error('Error disconnecting device:', error);
        return false;
    }
};

/**
 * Clean up Bluetooth resources
 */
export const cleanupBluetooth = () => {
    if (bleManager) {
        bleManager.destroy();
        bleManager = null;
    }
};