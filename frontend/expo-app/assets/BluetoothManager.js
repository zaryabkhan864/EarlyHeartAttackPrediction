import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { BleManager } from 'react-native-ble-manager';
import axios from 'axios';

const BluetoothManager = () => {
    const [devices, setDevices] = useState([]);
    const [scanning, setScanning] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const manager = new BleManager();

    useEffect(() => {
        // Initialize Bluetooth Manager
        manager.onStateChange((state) => {
            if (state === 'PoweredOn') {
                // Start scanning when Bluetooth is powered on
                startScan();
            }
        }, true);

        return () => {
            manager.stopDeviceScan(); // Cleanup when the component unmounts
            manager.destroy();
        };
    }, []);

    const startScan = () => {
        if (scanning) return; // Prevent multiple scans at the same time

        setScanning(true);
        setDevices([]); // Clear previous devices
        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.error(error);
                setScanning(false);
                return;
            }

            if (device && device.name) {
                // Add device to state
                setDevices((prevDevices) => {
                    const deviceExists = prevDevices.some((d) => d.id === device.id);
                    if (!deviceExists) {
                        return [...prevDevices, device];
                    }
                    return prevDevices;
                });
            }
        });
    };

    const stopScan = () => {
        manager.stopDeviceScan();
        setScanning(false);
    };

    const connectToDevice = async (device) => {
        try {
            await manager.connectToDevice(device.id);
            setIsConnected(true);
            console.log('Connected to device:', device.name);

            // Here, you can start reading characteristics from the device if needed

        } catch (error) {
            console.error('Connection failed:', error);
        }
    };

    const sendDataToBackend = async (data) => {
        try {
            const response = await axios.post('YOUR_BACKEND_URL', data);
            console.log('Data sent:', response.data);
        } catch (error) {
            console.error('Error sending data to backend:', error);
        }
    };

    const handleSendData = () => {
        // Example data you might want to send
        const data = {
            deviceInfo: devices[0], // Send the first discovered device's info
            connectionStatus: isConnected ? 'Connected' : 'Disconnected',
            timestamp: new Date().toISOString(),
        };

        sendDataToBackend(data); // Send the data to the backend
    };

    return (
        <View>
            <Text>Bluetooth Manager</Text>

            {scanning ? (
                <Button title="Stop Scanning" onPress={stopScan} />
            ) : (
                <Button title="Start Scanning" onPress={startScan} />
            )}

            <Text>Devices Found:</Text>
            {devices.map((device) => (
                <View key={device.id}>
                    <Text>{device.name}</Text>
                    <Button title="Connect" onPress={() => connectToDevice(device)} />
                </View>
            ))}

            <Button title="Send Data to Backend" onPress={handleSendData} />
        </View>
    );
};

export default BluetoothManager;
