import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

const BluetoothConnectionStatus = ({
    connected,
    deviceName,
    onDisconnect,
    lastDataReceived,
    dataReceivedTimestamp
}) => {
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'Never';

        const date = new Date(timestamp);
        return date.toLocaleTimeString();
    };

    return (
        <View style={styles.container}>
            <View style={[
                styles.statusIndicator,
                connected ? styles.connectedIndicator : styles.disconnectedIndicator
            ]} />

            <View style={styles.statusInfo}>
                <Text style={styles.statusTitle}>
                    {connected
                        ? `Connected to ${deviceName || 'device'}`
                        : 'Not connected to any device'}
                </Text>

                {connected && (
                    <>
                        <Text style={styles.dataInfo}>
                            Last data: {lastDataReceived || 'Waiting for data...'}
                        </Text>
                        <Text style={styles.timestampInfo}>
                            Updated: {formatTimestamp(dataReceivedTimestamp)}
                        </Text>
                    </>
                )}
            </View>

            {connected && (
                <TouchableOpacity
                    style={styles.disconnectButton}
                    onPress={onDisconnect}
                >
                    <Text style={styles.disconnectText}>Disconnect</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
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
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 12,
    },
    connectedIndicator: {
        backgroundColor: '#4caf50',
    },
    disconnectedIndicator: {
        backgroundColor: '#f44336',
    },
    statusInfo: {
        flex: 1,
    },
    statusTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    dataInfo: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    timestampInfo: {
        fontSize: 12,
        color: '#888',
    },
    disconnectButton: {
        backgroundColor: '#f44336',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disconnectText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default BluetoothConnectionStatus;