import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator, Alert, PermissionsAndroid, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BleManager } from 'react-native-ble-plx';

const BluetoothSetupScreen = ({ navigation }) => {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [data, setData] = useState(null);
  const [manager] = useState(new BleManager());

  // Request Bluetooth permissions for Android
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);
        
        if (
          granted['android.permission.ACCESS_FINE_LOCATION'] !== PermissionsAndroid.RESULTS.GRANTED ||
          granted['android.permission.BLUETOOTH_SCAN'] !== PermissionsAndroid.RESULTS.GRANTED ||
          granted['android.permission.BLUETOOTH_CONNECT'] !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          Alert.alert('Permissions required', 'Bluetooth scanning requires location and Bluetooth permissions');
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // BLE scan function
  const startScan = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    setIsScanning(true);
    setDevices([]);
    
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error(error);
        setIsScanning(false);
        return;
      }
      
      // Only show devices with names or local names
      if (device.name || device.localName) {
        setDevices(prevDevices => {
          const exists = prevDevices.some(d => d.id === device.id);
          return exists ? prevDevices : [...prevDevices, device];
        });
      }
    });

    // Stop scanning after 5 seconds
    setTimeout(() => {
      manager.stopDeviceScan();
      setIsScanning(false);
    }, 5000);
  };

  // BLE connection function
  const connectToDevice = async (device) => {
    setIsConnecting(true);
    try {
      const connected = await device.connect();
      await connected.discoverAllServicesAndCharacteristics();
      setConnectedDevice(connected);
      
      // Here you would set up actual monitoring of characteristics
      // For now, we'll simulate data
      const interval = setInterval(() => {
        setData(`Heart Rate: ${Math.floor(60 + Math.random() * 40)} bpm`);
      }, 3000);
      
      return () => clearInterval(interval);
    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert('Connection Failed', 'Could not connect to the device');
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect function
  const disconnectDevice = () => {
    if (connectedDevice) {
      connectedDevice.cancelConnection();
    }
    setConnectedDevice(null);
    setData(null);
  };

  useEffect(() => {
    return () => {
      manager.destroy();
    };
  }, []);

  const getDeviceName = (device) => {
    return device.name || device.localName || 'Unnamed Device';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons 
          name="arrow-back" 
          size={24} 
          color="#1D3557" 
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>Bluetooth Setup</Text>
        <View style={{ width: 24 }} /> // Spacer for alignment
      </View>

      <View style={styles.controlPanel}>
        <Button
          title={isScanning ? 'Scanning...' : 'Scan for Devices'}
          onPress={startScan}
          disabled={isScanning || connectedDevice}
          color="#E63946"
        />
        
        {connectedDevice && (
          <Button
            title="Disconnect"
            onPress={disconnectDevice}
            color="#457B9D"
            style={styles.disconnectButton}
          />
        )}
      </View>

      {isScanning && (
        <View style={styles.scanningIndicator}>
          <ActivityIndicator size="small" color="#E63946" />
          <Text style={styles.scanningText}>Searching for devices...</Text>
        </View>
      )}

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.deviceItem}>
            <Ionicons name="bluetooth" size={20} color="#1D3557" />
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>{getDeviceName(item)}</Text>
              <Text style={styles.deviceId}>{item.id}</Text>
            </View>
            <Button
              title={isConnecting ? 'Connecting...' : 'Connect'}
              onPress={() => connectToDevice(item)}
              disabled={!!connectedDevice || isConnecting}
            />
          </View>
        )}
        ListEmptyComponent={
          !isScanning && (
            <Text style={styles.emptyText}>
              No devices found. Tap "Scan for Devices" to search.
            </Text>
          )
        }
      />

      {connectedDevice && (
        <View style={styles.dataContainer}>
          <Text style={styles.connectedText}>
            Connected to: {getDeviceName(connectedDevice)}
          </Text>
          <View style={styles.dataBox}>
            <Text style={styles.dataTitle}>Live Data:</Text>
            <Text style={styles.dataValue}>{data || 'Waiting for data...'}</Text>
          </View>
        </View>
      )}
    </View>
  );
};


export default BluetoothSetupScreen;