import * as Permissions from 'expo-permissions';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export const requestBluetoothPermissions = async () => {
    // iOS always needs permission for Bluetooth
    if (Platform.OS === 'ios') {
        const { status } = await Permissions.askAsync(Permissions.BLUETOOTH_PERIPHERAL);
        return status === 'granted';
    }

    // Android permissions handling
    if (Platform.OS === 'android') {
        if (Device.osVersion >= 12) {
            const bluetoothScan = await Permissions.askAsync(Permissions.BLUETOOTH_SCAN);
            const bluetoothConnect = await Permissions.askAsync(Permissions.BLUETOOTH_CONNECT);
            return bluetoothScan.status === 'granted' && bluetoothConnect.status === 'granted';
        } else {
            const locationPermission = await Permissions.askAsync(Permissions.LOCATION);
            return locationPermission.status === 'granted';
        }
    }

    return false;
};

export const checkBluetoothPermissions = async () => {
    if (Platform.OS === 'ios') {
        const { status } = await Permissions.getAsync(Permissions.BLUETOOTH_PERIPHERAL);
        return status === 'granted';
    }

    if (Platform.OS === 'android') {
        if (Device.osVersion >= 12) {
            const bluetoothScan = await Permissions.getAsync(Permissions.BLUETOOTH_SCAN);
            const bluetoothConnect = await Permissions.getAsync(Permissions.BLUETOOTH_CONNECT);
            return bluetoothScan.status === 'granted' && bluetoothConnect.status === 'granted';
        } else {
            const locationPermission = await Permissions.getAsync(Permissions.LOCATION);
            return locationPermission.status === 'granted';
        }
    }

    return false;
};

export const requestNotificationPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    return status === 'granted';
};

export const checkNotificationPermissions = async () => {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    return status === 'granted';
};