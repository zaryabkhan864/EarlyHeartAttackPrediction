import React, { useState, useEffect, useCallback } from 'react';
import { DeviceContext } from './DeviceContext';
import { useBluetoothManager } from './useBluetoothManager';
import { getStoredDevices, storeDevice, removeDevice } from './storageService';

export const DeviceProvider = ({ children }) => {
    const [pairedDevices, setPairedDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { connectToDevice, disconnectFromDevice, isConnected } = useBluetoothManager();

    useEffect(() => {
        const loadDevices = async () => {
            try {
                const devices = await getStoredDevices();
                setPairedDevices(devices || []);
                // If there's only one device, auto-select it
                if (devices && devices.length === 1) {
                    setSelectedDevice(devices[0]);
                }
            } catch (error) {
                console.error('Failed to load paired devices:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDevices();
    }, []);

    const addDevice = useCallback(async (device) => {
        try {
            // Check if device already exists to avoid duplicates
            const exists = pairedDevices.some(d => d.id === device.id);
            if (!exists) {
                const updatedDevices = [...pairedDevices, device];
                setPairedDevices(updatedDevices);
                await storeDevice(device);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to add device:', error);
            return false;
        }
    }, [pairedDevices]);

    const removeDeviceById = useCallback(async (deviceId) => {
        try {
            // If the device to remove is the selected one, disconnect first
            if (selectedDevice && selectedDevice.id === deviceId) {
                await disconnectFromDevice();
                setSelectedDevice(null);
            }

            const updatedDevices = pairedDevices.filter(d => d.id !== deviceId);
            setPairedDevices(updatedDevices);
            await removeDevice(deviceId);
            return true;
        } catch (error) {
            console.error('Failed to remove device:', error);
            return false;
        }
    }, [pairedDevices, selectedDevice, disconnectFromDevice]);

    const selectDevice = useCallback(async (device) => {
        try {
            // If a device is already selected and connected, disconnect first
            if (selectedDevice && isConnected) {
                await disconnectFromDevice();
            }

            setSelectedDevice(device);

            // Try to connect to the newly selected device
            if (device) {
                const success = await connectToDevice(device);
                return success;
            }

            return true;
        } catch (error) {
            console.error('Failed to select device:', error);
            return false;
        }
    }, [selectedDevice, isConnected, disconnectFromDevice, connectToDevice]);

    return (
        <DeviceContext.Provider
            value={{
                pairedDevices,
                selectedDevice,
                isLoading,
                addDevice,
                removeDevice: removeDeviceById,
                selectDevice,
                isConnected
            }}>
            {children}
        </DeviceContext.Provider>
    );
};

export default DeviceProvider;