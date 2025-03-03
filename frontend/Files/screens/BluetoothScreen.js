import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert,
    Platform,
    ScrollView
} from 'react-native';
import { HeaderComponent } from '../components/HeaderComponent';
import { LoadingIndicator } from '../components/LoadingIndicator';
import BluetoothDeviceList from '../components/BluetoothDeviceList';
import BluetoothConnectionStatus from '../components/BluetoothConnectionStatus';
import { bluetoothService } from '../services/bluetoothService';
import { storageService } from '../services/storageService';
import { globalStyles } from '../styles/globalStyles';

const BluetoothScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [devices, setDevices] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState({
        connected: false,
        deviceName: null,
        lastDataReceived: null,
        dataReceivedTimestamp: null
    });
    const [bluetoothEnabled, setBluetoothEnabled] = useState(false);

    useEffect(() => {
        // Check Bluetooth status and previously connected device
        const initializeScreen = async () => {
            setIsLoading(true);
            try {
                // Check if Bluetooth is enabled
                const isEnabled = await bluetoothService.isBluetoothEnabled();
                setBluetoothEnabled(isEnabled);

                if (isEnabled) {
                    // Check if device was previously connected
                    const deviceInfo = await storageService.getLastConnectedDevice();
                    if (deviceInfo) {
                        const isConnected = await bluetoothService.isConnected();

                        if (isConnected) {
                            setConnectionStatus({
                                connected: true,
                                deviceName: deviceInfo.name,
                                lastDataReceived: deviceInfo.lastData,
                                dataReceivedTimestamp: deviceInfo.lastDataTimestamp
                            });
                        }
                    }
                }
            } catch (error) {
                console.error('Error initializing Bluetooth screen:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeScreen();

        // Set up event listener for Bluetooth data
        const bluetoothDataSubscription = bluetoothService.onDataReceived((data) => {
            setConnectionStatus(prevStatus => ({
                ...prevStatus,
                lastDataReceived: data.summary || 'Data received',
                dataReceivedTimestamp: Date.now()
            }));
        });

        // Cleanup
        return () => {
            bluetoothDataSubscription.remove();
            if (isScanning) {
                bluetoothService.stopScan();
            }
        };
    }, []);

    const handleScanPress = async () => {
        if (isScanning) {
            // Stop scanning if already scanning
            await bluetoothService.stopScan();
            setIsScanning(false);
            return;
        }

        // Check if Bluetooth is enabled
        const isEnabled = await bluetoothService.isBluetoothEnabled();

        if (!isEnabled) {
            if (Platform.OS === 'ios') {
                Alert.alert(
                    'Bluetooth Required',
                    'Please enable Bluetooth in your device settings to scan for devices.',
                    [{ text: 'OK' }]
                );
            } else {
                try {
                    const enabled = await bluetoothService.requestBluetoothEnable();
                    setBluetoothEnabled(enabled);
                    if (!enabled) return;
                } catch (error) {
                    console.error('Error enabling Bluetooth:', error);
                    return;
                }
            }
        }

        // Start scanning
        setIsScanning(true);
        setDevices([]);

        try {
            bluetoothService.startScan((device) => {
                // Add device to the list if it's not already there
                setDevices(prevDevices => {
                    if (prevDevices.findIndex(d => d.id === device.id) === -1) {
                        return [...prevDevices, device];
                    }
                    return prevDevices;
                });
            });

            // Stop scanning after 10 seconds
            setTimeout(() => {
                if (isScanning) {
                    bluetoothService.stopScan();
                    setIsScanning(false);
                }
            }, 10000);
        } catch (error) {
            console.error('Error scanning for devices:', error);
            setIsScanning(false);
            Alert.alert('Scan Error', 'Failed to scan for Bluetooth devices.');
        }
    };

    const handleDeviceSelect = async (device) => {
        setIsLoading(true);
        try {
            // Stop scanning if still scanning
            if (isScanning) {
                await bluetoothService.stopScan();
                setIsScanning(false);
            }

            // Connect to the selected device
            const isConnected = await bluetoothService.connectToDevice(device.id);

            if (isConnected) {
                // Save device info for future reconnections
                await storageService.saveLastConnectedDevice({
                    id: device.id,
                    name: device.name || 'Unknown Device'
                });

                setConnectionStatus({
                    connected: true,
                    deviceName: device.name || 'Unknown Device',
                    lastDataReceived: null,
                    dataReceivedTimestamp: null
                });

                Alert.alert(
                    'Device Connected',
                    `Successfully connected to ${device.name || 'device'}. You'll now receive data every 15 seconds.`
                );
            } else {
                Alert.alert(
                    'Connection Failed',
                    'Failed to connect to the selected device. Please try again.'
                );
            }
        } catch (error) {
            console.error('Error connecting to device:', error);
            Alert.alert('Connection Error', 'An error occurred while connecting to the device.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisconnect = async () => {
        try {
            await bluetoothService.disconnect();
            setConnectionStatus({
                connected: false,
                deviceName: null,
                lastDataReceived: null,
                dataReceivedTimestamp: null
            });
        } catch (error) {
            console.error('Error disconnecting:', error);
            Alert.alert('Disconnect Error', 'Failed to disconnect from the device.');
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <HeaderComponent
                    title="Bluetooth Connection"
                    showBackButton
                    onBackPress={() => navigation.goBack()}
                />
                <LoadingIndicator message="Processing..." />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <HeaderComponent
                title="Bluetooth Connection"
                showBackButton
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                {connectionStatus.connected ? (
                    <BluetoothConnectionStatus
                        connected={connectionStatus.connected}
                        deviceName={connectionStatus.deviceName}
                        onDisconnect={handleDisconnect}
                        lastDataReceived={connectionStatus.lastDataReceived}
                        dataReceivedTimestamp={connectionStatus.dataReceivedTimestamp}
                    />
                ) : (
                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>Connect a Device</Text>
                        <Text style={styles.infoText}>
                            Connect your Bluetooth heart monitoring device to begin tracking your heart health metrics.
                        </Text>
                        <Text style={styles.infoSubtext}>
                            Make sure your device is turned on and in pairing mode.
                        </Text>
                    </View>
                )}

                <TouchableOpacity
                    style={[
                        globalStyles.button,
                        isScanning ? globalStyles.secondaryButton : globalStyles.primaryButton,
                        styles.scanButton
                    ]}
                    onPress={handleScanPress}
                    disabled={isLoading}
                >
                    <Text style={globalStyles.buttonText}>
                        {isScanning ? 'Stop Scanning' : 'Scan for Devices'}
                    </Text>
                </TouchableOpacity>

                {!bluetoothEnabled && !isScanning && (
                    <View style={styles.warningCard}>
                        <Text style={styles.warningTitle}>Bluetooth Disabled</Text>
                        <Text style={styles.warningText}>
                            Please enable Bluetooth on your device to connect to heart monitoring devices.
                        </Text>
                    </View>
                )}

                {(isScanning || devices.length > 0) && (
                    <BluetoothDeviceList
                        devices={devices}
                        onDeviceSelect={handleDeviceSelect}
                        scanning={isScanning}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    contentContainer: {
        paddingBottom: 20,
    },
    infoCard: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e1e1e1',
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    infoText: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
    },
    infoSubtext: {
        fontSize: 12,
        color: '#777',
        marginTop: 5,
    },
    warningCard: {
        backgroundColor: '#ffdddd',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ffcccc',
    },
    warningTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ff3333',
    },
    warningText: {
        fontSize: 14,
        color: '#cc0000',
    },
    scanButton: {
        marginVertical: 20,
    },
});

export default BluetoothScreen;
