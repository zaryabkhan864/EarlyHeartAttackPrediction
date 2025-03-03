import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import { HeaderComponent } from '../components/HeaderComponent';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { RiskIndicator } from '../components/RiskIndicator';
import { BluetoothConnectionStatus } from '../components/BluetoothConnectionStatus';
import { storageService } from '../services/storageService';
import { bluetoothService } from '../services/bluetoothService';
import { globalStyles } from '../styles/globalStyles';

const HomeScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState({
        connected: false,
        deviceName: null,
        lastDataReceived: null,
        dataReceivedTimestamp: null
    });
    const [riskData, setRiskData] = useState({
        score: 0,
        level: 'Unknown',
        lastUpdated: null
    });

    useEffect(() => {
        // Load user profile and connection status
        const loadInitialData = async () => {
            try {
                const profile = await storageService.getUserProfile();
                setUserProfile(profile);

                // Check if a device was previously connected
                const deviceInfo = await storageService.getLastConnectedDevice();
                if (deviceInfo) {
                    // Try to reconnect to last device
                    const connected = await bluetoothService.connectToDevice(deviceInfo.id);
                    if (connected) {
                        setConnectionStatus({
                            connected: true,
                            deviceName: deviceInfo.name,
                            lastDataReceived: deviceInfo.lastData,
                            dataReceivedTimestamp: deviceInfo.lastDataTimestamp
                        });
                    }
                }

                // Get last risk assessment
                const riskAssessment = await storageService.getLastRiskAssessment();
                if (riskAssessment) {
                    setRiskData({
                        score: riskAssessment.score,
                        level: riskAssessment.level,
                        lastUpdated: riskAssessment.timestamp
                    });
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Error loading initial data:', error);
                setIsLoading(false);
            }
        };

        loadInitialData();

        // Set up Bluetooth data listener
        const bluetoothDataSubscription = bluetoothService.onDataReceived((data) => {
            // Update the connection status with new data
            setConnectionStatus(prevStatus => ({
                ...prevStatus,
                lastDataReceived: data.summary || 'Data received',
                dataReceivedTimestamp: Date.now()
            }));

            // Update risk assessment if needed
            if (data.riskData) {
                setRiskData({
                    score: data.riskData.score,
                    level: data.riskData.level,
                    lastUpdated: Date.now()
                });
            }
        });

        // Clean up subscription when component unmounts
        return () => {
            bluetoothDataSubscription.remove();
        };
    }, []);

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
        }
    };

    // Format timestamp for display
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'Never';

        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    if (isLoading) {
        return <LoadingIndicator message="Loading your health data..." />;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <HeaderComponent title="EarlyHeartAttackPredictor" />

            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                {!userProfile ? (
                    <View style={styles.welcomeContainer}>
                        <Text style={styles.welcomeTitle}>Welcome to EarlyHeartAttackPredictor</Text>
                        <Text style={styles.welcomeText}>
                            To get started, please complete your health profile.
                        </Text>
                        <TouchableOpacity
                            style={[globalStyles.button, globalStyles.primaryButton]}
                            onPress={() => navigation.navigate('UserForm')}
                        >
                            <Text style={globalStyles.buttonText}>Set Up Profile</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <BluetoothConnectionStatus
                            connected={connectionStatus.connected}
                            deviceName={connectionStatus.deviceName}
                            onDisconnect={handleDisconnect}
                            lastDataReceived={connectionStatus.lastDataReceived}
                            dataReceivedTimestamp={connectionStatus.dataReceivedTimestamp}
                        />

                        <View style={styles.cardContainer}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>Your Heart Health</Text>
                                <Text style={styles.cardSubtitle}>
                                    Last updated: {formatTimestamp(riskData.lastUpdated)}
                                </Text>
                            </View>

                            <View style={styles.riskContainer}>
                                <RiskIndicator
                                    score={riskData.score}
                                    level={riskData.level}
                                    size={100}
                                />
                                <View style={styles.riskTextContainer}>
                                    <Text style={styles.riskStatusText}>
                                        {riskData.level === 'Unknown'
                                            ? 'Connect your device to get a risk assessment'
                                            : `Risk level: ${riskData.level}`
                                        }
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.detailsButton}
                                        onPress={() => navigation.navigate('Results')}
                                    >
                                        <Text style={styles.detailsButtonText}>View Details</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={styles.actionsContainer}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => navigation.navigate('UserForm')}
                            >
                                <View style={[styles.actionIcon, { backgroundColor: '#4caf50' }]}>
                                    <Text style={styles.actionIconText}>👤</Text>
                                </View>
                                <Text style={styles.actionText}>Update Profile</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => navigation.navigate('Bluetooth')}
                            >
                                <View style={[styles.actionIcon, { backgroundColor: '#2196f3' }]}>
                                    <Text style={styles.actionIconText}>📶</Text>
                                </View>
                                <Text style={styles.actionText}>Connect Device</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => navigation.navigate('Monitoring')}
                            >
                                <View style={[styles.actionIcon, { backgroundColor: '#ff9800' }]}>
                                    <Text style={styles.actionIconText}>📊</Text>
                                </View>
                                <Text style={styles.actionText}>Monitor Data</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => navigation.navigate('Results')}
                            >
                                <View style={[styles.actionIcon, { backgroundColor: '#f44336' }]}>
                                    <Text style={styles.actionIconText}>📋</Text>
                                </View>
                                <Text style={styles.actionText}>View Results</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>About This App</Text>
                    <Text style={styles.infoText}>
                        EarlyHeartAttackPredictor uses data from your connected Bluetooth devices combined with your health profile to help assess your risk of cardiovascular events.
                    </Text>
                    <Text style={styles.disclaimerText}>
                        DISCLAIMER: This app is not a medical device and is not intended to diagnose, treat, cure, or prevent any disease. Always consult with a healthcare professional for medical advice.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
    },
    welcomeContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        alignItems: 'center',
    },
    welcomeTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2e7d32',
        marginBottom: 12,
        textAlign: 'center',
    },
    welcomeText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
        textAlign: 'center',
        lineHeight: 22,
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        overflow: 'hidden',
    },
    cardHeader: {
        padding: 16,
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2e7d32',
    },
    cardSubtitle: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    riskContainer: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    riskTextContainer: {
        flex: 1,
        marginLeft: 16,
    },
    riskStatusText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 12,
    },
    detailsButton: {
        backgroundColor: '#e0e0e0',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    detailsButtonText: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 14,
    },
    actionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    actionButton: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    actionIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionIconText: {
        fontSize: 24,
    },
    actionText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    infoContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2e7d32',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 16,
        lineHeight: 22,
    },
    disclaimerText: {
        fontSize: 12,
        color: '#888',
        fontStyle: 'italic',
    },
});

export default HomeScreen;