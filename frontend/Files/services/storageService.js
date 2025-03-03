import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Save user information to storage
 * @param {Object} userInfo - User information to save
 * @returns {Promise<void>}
 */
export const saveUserInfo = async (userInfo) => {
    try {
        const jsonValue = JSON.stringify(userInfo);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_INFO, jsonValue);
    } catch (error) {
        console.error('Error saving user info:', error);
        throw error;
    }
};

/**
 * Retrieve user information from storage
 * @returns {Promise<Object|null>} User information or null if not found
 */
export const getUserInfo = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_INFO);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
        console.error('Error getting user info:', error);
        throw error;
    }
};

/**
 * Save a Bluetooth device to the list of saved devices
 * @param {Object} device - Device information to save
 * @returns {Promise<void>}
 */
export const saveDevice = async (device) => {
    try {
        // Get existing saved devices
        const existingDevices = await getSavedDevices();

        // Add new device if it doesn't already exist
        if (!existingDevices.some(d => d.id === device.id)) {
            existingDevices.push(device);

            // Save updated list
            await AsyncStorage.setItem(
                STORAGE_KEYS.SAVED_DEVICES,
                JSON.stringify(existingDevices)
            );
        }
    } catch (error) {
        console.error('Error saving device:', error);
        throw error;
    }
};

/**
 * Get the list of saved Bluetooth devices
 * @returns {Promise<Array>} List of saved devices
 */
export const getSavedDevices = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_DEVICES);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
        console.error('Error getting saved devices:', error);
        return [];
    }
};

/**
 * Remove a device from saved devices
 * @param {string} deviceId - ID of device to remove
 * @returns {Promise<void>}
 */
export const removeDevice = async (deviceId) => {
    try {
        // Get existing saved devices
        const existingDevices = await getSavedDevices();

        // Filter out the device to remove
        const updatedDevices = existingDevices.filter(d => d.id !== deviceId);

        // Save updated list
        await AsyncStorage.setItem(
            STORAGE_KEYS.SAVED_DEVICES,
            JSON.stringify(updatedDevices)
        );
    } catch (error) {
        console.error('Error removing device:', error);
        throw error;
    }
};

/**
 * Save sensor reading to history
 * @param {Object} reading - Sensor reading
 * @returns {Promise<void>}
 */
export const saveReading = async (reading) => {
    try {
        // Get existing readings
        const readings = await getReadings();

        // Add new reading with timestamp
        readings.push({
            ...reading,
            timestamp: reading.timestamp || new Date().toISOString(),
        });

        // Limit history size (keep last 100 readings)
        const trimmedReadings = readings.slice(-100);

        // Save updated readings
        await AsyncStorage.setItem(
            STORAGE_KEYS.READINGS_HISTORY,
            JSON.stringify(trimmedReadings)
        );
    } catch (error) {
        console.error('Error saving reading:', error);
        throw error;
    }
};

/**
 * Get sensor reading history
 * @returns {Promise<Array>} Sensor readings
 */
export const getReadings = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.READINGS_HISTORY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
        console.error('Error getting readings:', error);
        return [];
    }
};

/**
 * Save risk assessment result
 * @param {Object} result - Risk assessment result
 * @returns {Promise<void>}
 */
export const saveResult = async (result) => {
    try {
        const jsonValue = JSON.stringify({
            ...result,
            timestamp: new Date().toISOString(),
        });
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_RESULT, jsonValue);
    } catch (error) {
        console.error('Error saving result:', error);
        throw error;
    }
};

/**
 * Get last risk assessment result
 * @returns {Promise<Object|null>} Last risk assessment or null if not found
 */
export const getLastResult = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.LAST_RESULT);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
        console.error('Error getting last result:', error);
        return null;
    }
};

/**
 * Clear all app data
 * @returns {Promise<void>}
 */
export const clearAllData = async () => {
    try {
        const keys = Object.values(STORAGE_KEYS);
        await AsyncStorage.multiRemove(keys);
    } catch (error) {
        console.error('Error clearing data:', error);
        throw error;
    }
};