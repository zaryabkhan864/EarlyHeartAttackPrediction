import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

const BluetoothDeviceList = ({ devices, onDeviceSelect, scanning }) => {
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.deviceItem}
            onPress={() => onDeviceSelect(item)}
        >
            <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>
                    {item.name || 'Unknown Device'}
                </Text>
                <Text style={styles.deviceId}>ID: {item.id}</Text>
                {item.rssi && (
                    <Text style={styles.deviceSignal}>
                        Signal Strength: {item.rssi} dBm
                    </Text>
                )}
            </View>
            <View style={styles.connectButtonContainer}>
                <Text style={styles.connectButtonText}>Connect</Text>
            </View>
        </TouchableOpacity>
    );

    const EmptyListComponent = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
                {scanning
                    ? 'Scanning for devices...'
                    : 'No devices found. Make sure your Bluetooth device is turned on and in range.'}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Available Devices</Text>
            <FlatList
                data={devices}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                ListEmptyComponent={EmptyListComponent}
                style={styles.list}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 12,
        color: '#2e7d32',
        paddingHorizontal: 16,
    },
    list: {
        flex: 1,
    },
    listContent: {
        padding: 16,
        paddingTop: 0,
    },
    deviceItem: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    deviceInfo: {
        flex: 1,
    },
    deviceName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    deviceId: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    deviceSignal: {
        fontSize: 14,
        color: '#888',
    },
    connectButtonContainer: {
        backgroundColor: '#4caf50',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    connectButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        marginVertical: 20,
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        lineHeight: 22,
    },
});

export default BluetoothDeviceList;