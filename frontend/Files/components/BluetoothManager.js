import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import {
    scanForDevices,
    connectToDevice,
    disconnectDevice
} from '../services/bluetoothService';
import { saveDevice } from '../services/storageService';
import LoadingIndicator from './LoadingIndicator';
import { colors } from '../styles/globalStyles';

const BluetoothManager = ({
    onDeviceConnected,
    onError,
    initialConnectedDevice = null
}) => {
    const [isScanning, setIsScanning] = useState(false);
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(initialConnectedDevice);
    const [error, setError] = useState(null);

    // Start scan for devices
    const startScan = useCallback(async () => {
        try {
            setIsScanning(true);
            setError(null);
            setDevices([]);

            const foundDevices = await scanForDevices(10000, (device) => {
                setDevices(prevDevices => {
                    if (!prevDevices.some(d => d.id === device.id)) {
                        return [...prevDevices, device];
                    }
                    return prevDevices;
                });
            });

            // This will ensure we catch any devices that might not have been
            // added via the callback
            setDevices(foundDevices);
        } catch (err) {
            setError(`Error scanning: ${err.message}`);
            if (onError) onError(err);
        } finally {
            setIsScanning(false);
        }
    }, [onError]);

    // Connect to selected device
    const handleConnect = useCallback(async (device) => {
        try {
            setError(null);

            // If there's already a connected device, disconnect first
            if (selectedDevice && selectedDevice.id !== device.id) {
                await disconnectDevice(selectedDevice.id);
            }

            // Connect to new device
            const connectedDevice = await connectToDevice(device.id);

            // Save device for future use
            await saveDevice({
                id: device.id,
                name: device.name,
                lastConnected: new Date().toISOString(),
            });

            // Update state
            setSelectedDevice(connectedDevice);

            // Notify parent
            if (onDeviceConnected) {
                onDeviceConnected(connectedDevice);
            }
        } catch (err) {
            setError(`Connection error: ${err.message}`);
            if (onError) onError(err);
        }
    }, [selectedDevice, onDeviceConnected, onError]);

    // Disconnect from device
    const handleDisconnect = useCallback(async () => {
        try {
            if (selectedDevice) {
                await disconnectDevice(selectedDevice.id);
                setSelectedDevice(null);

                // Notify parent
                if (onDeviceConnected) {
                    onDeviceConnected(null);
                }
            }
        } catch (err) {
            setError(`Disconnect error: ${err.message}`);
            if (onError) onError(err);
        }
    }, [selectedDevice, onDeviceConnected, onError]);

    // Start scanning when component mounts if no device is already connected
    useEffect(() => {
        if (!initialConnectedDevice) {
            startScan();
        } else {
            setSelectedDevice(initialConnectedDevice);
        }
    }, [initialConnectedDevice, startScan]);

    // Render each device item
    const renderDeviceItem = ({ item }) => {
        const isConnected = selectedDevice && selectedDevice.id === item.id;

        return (
            <TouchableOpacity
                style={[
                    styles.deviceItem,
                    isConnected && styles.deviceItemConnected
                ]}
                onPress={() => isConnected ? handleDisconnect() : handleConnect(item)}
            >
                <View>
                    <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
                    <Text style={styles.deviceId}>ID: {item.id}</Text>
                    {item.rssi && (
                        <Text style={styles.deviceRssi}>Signal: {item.rssi} dBm</Text>
                    )}
                </View>

                <Text style={isConnected ? styles.connectedText : styles.connectText}>
                    {isConnected ? 'Connected' : 'Connect'}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <View style={styles.header}>
                <Text style={styles.title}>Bluetooth Devices</Text>
                <TouchableOpacity
                    style={styles.scanButton}
                    onPress={startScan}
                    disabled={isScanning}
                >
                    <Text style={styles.scanButtonText}>
                        {isScanning ? 'Scanning...' : 'Scan'}
                    </Text>
                </TouchableOpacity>
            </View>

            {isScanning ? (
                <LoadingIndicator message="Scanning for devices..." />
            ) : (
                <FlatList
                    data={devices}
                    renderItem={renderDeviceItem}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>
                            No devices found. Tap "Scan" to look for Bluetooth devices.
                        </Text>
                    }
                />
            )}

            {selectedDevice && (
                <View style={styles.connectedDeviceInfo}>
                    <Text style={styles.connectedDeviceText}>
                        Connected to: {selectedDevice.name || 'Unknown Device'}
                    </Text>
                    <TouchableOpacity
                        style={styles.disconnectButton}
                        onPress={handleDisconnect}
                    >
                        <Text style={styles.disconnectButtonText}>Disconnect</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    scanButton: {
        backgroundColor: colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    scanButtonText: {
        color: colors.white,
        fontWeight: 'bold',
    },
    deviceItem: {
        backgroundColor: colors.white,
        padding: 15,
        borderRadius: 8,
        marginVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.lightGray,
    },
    deviceItemConnected: {
        borderColor: colors.primary,
        borderWidth: 2,
    },
    deviceName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    deviceId: {
        fontSize: 12,
        color: colors.gray,
    },
    deviceRssi: {
        fontSize: 12,
        color: colors.gray,
        marginTop: 2,
    },
    connectText: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    connectedText: {
        color: colors.secondary,
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        color: colors.gray,
        marginTop: 20,
    },
    errorContainer: {
        backgroundColor: colors.danger,
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    errorText: {
        color: colors.white,
        textAlign: 'center',
    },
    connectedDeviceInfo: {
        backgroundColor: colors.lightGray,
        padding: 15,
        borderRadius: 8,