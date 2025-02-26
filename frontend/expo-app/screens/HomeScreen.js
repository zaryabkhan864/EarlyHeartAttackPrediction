// frontend/screens/HomeScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import UserForm from '../components/UserForm'; // Import the UserForm component

export default function HomeScreen() {
    const [userData, setUserData] = useState(null);
    const [deviceData, setDeviceData] = useState(null);
    const [scanning, setScanning] = useState(false);
    const manager = new BleManager();

    useEffect(() => {
        return () => {
            manager.destroy();
        };
    }, []);

    const startScan = () => {
        setScanning(true);
        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error);
                return;
            }
            if (device.name) {
                console.log(device.name);
                setDeviceData(device);
                setScanning(false);
                manager.stopDeviceScan();
            }
        });
    };

    const stopScan = () => {
        manager.stopDeviceScan();
        setScanning(false);
    };

    const handleFormSubmit = (data) => {
        setUserData(data);
        console.log('User Data:', data); // Send this data to the backend or process it as needed
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome to EarlyHeartAttackPredictor!</Text>

            {/* Show form to collect user data */}
            <UserForm onSubmit={handleFormSubmit} />

            {/* Bluetooth scanning */}
            {scanning ? (
                <Button title="Stop Scanning" onPress={stopScan} />
            ) : (
                <Button title="Start Scanning" onPress={startScan} />
            )}

            {deviceData && (
                <Text style={styles.deviceText}>Device: {deviceData.name}</Text>
            )}

            {userData && (
                <Text style={styles.userDataText}>
                    User Data: {JSON.stringify(userData, null, 2)}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    deviceText: {
        marginTop: 20,
        fontSize: 16,
    },
    userDataText: {
        marginTop: 20,
        fontSize: 16,
        color: 'green',
    },
});
