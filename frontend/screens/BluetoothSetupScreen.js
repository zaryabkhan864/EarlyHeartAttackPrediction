import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, PermissionsAndroid } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const BluetoothSetupScreen = () => {
    const [manager] = useState(new BleManager());
    const [devices, setDevices] = useState([]);
    const [connectedDevice, setConnectedDevice] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [data, setData] = useState(null);

    // Request Bluetooth permissions (Android)
    const requestBluetoothPermission = async () => {
        if (Platform.OS === 'android') {
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
        }
        return true; // iOS handled via Info.plist
    };

    // Scan for devices
    const startScan = async () => {
        const permissionGranted = await requestBluetoothPermission();
        if (!permissionGranted) {
            alert('Bluetooth permissions denied');
            return;
        }

        setIsScanning(true);
        setDevices([]);
        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.error(error);
                setIsScanning(false);
                return;
            }
            if (device.name) { // Filter devices with names (adjust as needed)
                setDevices((prev) => {
                    if (!prev.find((d) => d.id === device.id)) {
                        return [...prev, device];
                    }
                    return prev;
                });
            }
        });

        setTimeout(() => {
            manager.stopDeviceScan();
            setIsScanning(false);
        }, 5000); // Scan for 5 seconds
    };

    // Connect to a device
    const connectToDevice = async (device) => {
        try {
            await device.connect();
            await device.discoverAllServicesAndCharacteristics();
            setConnectedDevice(device);
            startDataMonitoring(device);
        } catch (error) {
            console.error('Connection error:', error);
            alert('Failed to connect to device');
        }
    };

    // Monitor data every 15 seconds
    const startDataMonitoring = (device) => {
        const subscription = device.monitorCharacteristicForService(
            'YOUR_SERVICE_UUID', // Replace with your device's service UUID
            'YOUR_CHARACTERISTIC_UUID', // Replace with your device's characteristic UUID
            (error, characteristic) => {
                if (error) {
                    console.error(error);
                    handleReconnection(device);
                    return;
                }
                const rawData = characteristic?.value;
                const decodedData = rawData ? Buffer.from(rawData, 'base64').toString('ascii') : null;
                setData(decodedData); // Update with parsed data
            }
        );

        return () => subscription.remove(); // Cleanup on unmount
    };

    // Reconnection logic
    const handleReconnection = async (device) => {
        try {
            if (await device.isConnected()) return;
            await device.connect();
            await device.discoverAllServicesAndCharacteristics();
            startDataMonitoring(device);
        } catch (error) {
            console.error('Reconnection failed:', error);
            setTimeout(() => handleReconnection(device), 5000); // Retry after 5s
        }
    };

    useEffect(() => {
        return () => {
            manager.destroy(); // Cleanup BLE manager on unmount
        };
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bluetooth Setup</Text>
            <Button
                title={isScanning ? 'Scanning...' : 'Scan for Devices'}
                onPress={startScan}
                disabled={isScanning}
            />
            <FlatList
                data={devices}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.deviceItem}>
                        <Text>{item.name || 'Unnamed Device'} ({item.id})</Text>
                        <Button
                            title="Connect"
                            onPress={() => connectToDevice(item)}
                            disabled={!!connectedDevice}
                        />
                    </View>
                )}
            />
            {connectedDevice && (
                <View style={styles.dataContainer}>
                    <Text>Connected to: {connectedDevice.name}</Text>
                    <Text>Latest Data: {data || 'Waiting for data...'}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, marginBottom: 20 },
    deviceItem: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
    dataContainer: { marginTop: 20 },
});

export default BluetoothSetupScreen;