import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as ExpoPermissions from 'expo-permissions';

/**
 * Custom hook for managing app permissions
 */
const usePermissions = () => {
    const [permissions, setPermissions] = useState({
        bluetooth: null,
        location: null,
        notifications: null,
    });
    const [loading, setLoading] = useState(true);

    // Check permissions on mount
    useEffect(() => {
        checkAllPermissions();
    }, []);

    // Check all required permissions
    const checkAllPermissions = useCallback(async () => {
        setLoading(true);
        try {
            const bluetoothStatus = await checkBluetoothPermission();
            const locationStatus = await checkLocationPermission();
            const notificationsStatus = await checkNotificationsPermission();

            setPermissions({
                bluetooth: bluetoothStatus,
                location: locationStatus,
                notifications: notificationsStatus,
            });
        } catch (error) {
            console.error('Error checking permissions:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Check Bluetooth permission
    const checkBluetoothPermission = useCallback(async () => {
        try {
            if (Platform.OS === 'ios') {
                const { status } = await ExpoPermissions.getAsync(ExpoPermissions.BLUETOOTH_PERIPHERAL);
                return status;
            } else if (Platform.OS === 'android') {
                // On Android, we need both BLUETOOTH and BLUETOOTH_ADMIN permissions
                // plus LOCATION permission for scanning on older Android versions
                const { status } = await ExpoPermissions.getAsync(ExpoPermissions.BLUETOOTH);
                return status;
            }
            return 'denied';
        } catch (error) {
            console.error('Error checking Bluetooth permission:', error);
            return 'denied';
        }
    }, []);

    // Check Location permission
    const checkLocationPermission = useCallback(async () => {
        try {
            const { status } = await ExpoPermissions.getAsync(ExpoPermissions.LOCATION);
            return status;
        } catch (error) {
            console.error('Error checking Location permission:', error);
            return 'denied';
        }
    }, []);

    // Check Notifications permission
    const checkNotificationsPermission = useCallback(async () => {
        try {
            const { status } = await ExpoPermissions.getAsync(ExpoPermissions.NOTIFICATIONS);
            return status;
        } catch (error) {
            console.error('Error checking Notifications permission:', error);
            return 'denied';
        }
    }, []);

    // Request Bluetooth permission
    const requestBluetoothPermission = useCallback(async () => {
        try {
            if (Platform.OS === 'ios') {
                const { status } = await ExpoPermissions.askAsync(ExpoPermissions.BLUETOOTH_PERIPHERAL);
                setPermissions(prev => ({ ...prev, bluetooth: status }));
                return status;
            } else if (Platform.OS === 'android') {
                const { status } = await ExpoPermissions.askAsync(ExpoPermissions.BLUETOOTH);
                setPermissions(prev => ({ ...prev, bluetooth: status }));
                return status;
            }
            return 'denied';
        } catch (error) {
            console.error('Error requesting Bluetooth permission:', error);
            return 'denied';
        }
    }, []);

    // Request Location permission
    const requestLocationPermission = useCallback(async () => {
        try {
            const { status } = await ExpoPermissions.askAsync(ExpoPermissions.LOCATION);
            setPermissions(prev => ({ ...prev, location: status }));
            return status;
        } catch (error) {
            console.error('Error requesting Location permission:', error);
            return 'denied';
        }
    }, []);

    // Request Notifications permission
    const requestNotificationsPermission = useCallback(async () => {
        try {
            const { status } = await ExpoPermissions.askAsync(ExpoPermissions.NOTIFICATIONS);
            setPermissions(prev => ({ ...prev, notifications: status }));
            return status;
        } catch (error) {
            console.error('Error requesting Notifications permission:', error);
            return 'denied';
        }
    }, []);

    // Request all permissions
    const requestAllPermissions = useCallback(async () => {
        setLoading(true);
        try {
            await requestBluetoothPermission();
            await requestLocationPermission();
            await requestNotificationsPermission();
            return permissions;
        } catch (error) {
            console.error('Error requesting all permissions:', error);
        } finally {
            setLoading(false);
        }
    }, [
        requestBluetoothPermission,
        requestLocationPermission,
        requestNotificationsPermission,
        permissions
    ]);

    return {
        permissions,
        loading,
        checkAllPermissions,
        requestBluetoothPermission,
        requestLocationPermission,
        requestNotificationsPermission,
        requestAllPermissions,
    };
};

export default usePermissions;