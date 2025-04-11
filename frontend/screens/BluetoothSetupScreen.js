import React, { useState, useEffect } from 'react';
import {
  View, Text, Button, FlatList, StyleSheet,
  ActivityIndicator, Alert, PermissionsAndroid, Platform,
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import base64 from 'react-native-base64';

const manager = new BleManager();

const BluetoothSetupScreen = () => {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [data, setData] = useState('');
  const [characteristic, setCharacteristic] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      return Object.values(granted).every(val => val === PermissionsAndroid.RESULTS.GRANTED);
    }
    return true;
  };

  const scanDevices = async () => {
    const permission = await requestPermissions();
    if (!permission) {
      Alert.alert('Permission denied');
      return;
    }

    setDevices([]);
    setIsScanning(true);

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error(error);
        setIsScanning(false);
        return;
      }

      if (device.name && device.name.includes('HM')) {
        setDevices(prev => {
          const exists = prev.find(d => d.id === device.id);
          return exists ? prev : [...prev, device];
        });
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setIsScanning(false);
    }, 5000);
  };

  const connectDevice = async (device) => {
    try {
      const connected = await device.connect();
      await connected.discoverAllServicesAndCharacteristics();
      const services = await connected.services();

      for (const service of services) {
        const chars = await service.characteristics();
        for (const c of chars) {
          if (c.isReadable || c.isNotifiable) {
            setCharacteristic(c);
            c.monitor((error, char) => {
              if (error) {
                console.error('Monitor error:', error);
                return;
              }
              const value = base64.decode(char?.value || '');
              setData(value);
            });
            break;
          }
        }
      }

      setConnectedDevice(connected);
    } catch (err) {
      console.error('Connection failed', err);
      Alert.alert('Failed to connect');
    }
  };

  const disconnectDevice = async () => {
    if (connectedDevice) {
      await connectedDevice.cancelConnection();
      setConnectedDevice(null);
      setCharacteristic(null);
      setData('');
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title={isScanning ? "Scanning..." : "Scan for HM-10"}
        onPress={scanDevices}
        disabled={isScanning}
      />

      {connectedDevice && (
        <Button
          title="Disconnect"
          onPress={disconnectDevice}
          color="#E63946"
        />
      )}

      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.deviceItem}>
            <Text style={styles.deviceText}>{item.name} - {item.id}</Text>
            <Button title="Connect" onPress={() => connectDevice(item)} />
          </View>
        )}
      />

      {connectedDevice && (
        <View style={styles.dataContainer}>
          <Text style={styles.title}>Connected to {connectedDevice.name}</Text>
          <Text style={styles.dataText}>{data || 'Waiting for data...'}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: '#fff' },
  deviceItem: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  deviceText: { fontSize: 16 },
  dataContainer: { marginTop: 20 },
  title: { fontSize: 18, fontWeight: 'bold' },
  dataText: { marginTop: 10, fontSize: 16, color: '#333' },
});

export default BluetoothSetupScreen;
