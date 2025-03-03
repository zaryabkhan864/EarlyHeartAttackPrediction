import React, { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { NotificationContext } from './NotificationContext';
import { requestNotificationPermissions, checkNotificationPermissions } from './permissionsService';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export const NotificationProvider = ({ children }) => {
    const [hasPermission, setHasPermission] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const checkPermissions = async () => {
            const permissionGranted = await checkNotificationPermissions();
            setHasPermission(permissionGranted);
        };

        checkPermissions();

        const notificationListener = Notifications.addNotificationReceivedListener(
            notification => {
                setNotification(notification);
            }
        );

        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
        };
    }, []);

    const requestPermissions = useCallback(async () => {
        const granted = await requestNotificationPermissions();
        setHasPermission(granted);
        return granted;
    }, []);

    const scheduleNotification = useCallback(async (title, body, data = {}, seconds = 5) => {
        if (!hasPermission) {
            const granted = await requestPermissions();
            if (!granted) return false;
        }

        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data,
            },
            trigger: {
                seconds,
            },
        });

        return true;
    }, [hasPermission, requestPermissions]);

    const cancelAllNotifications = useCallback(async () => {
        await Notifications.cancelAllScheduledNotificationsAsync();
    }, []);

    const sendRiskLevelNotification = useCallback(async (riskLevel) => {
        let title, body;

        switch (riskLevel) {
            case 'high':
                title = 'High Risk Alert';
                body = 'Your heart health indicators suggest a high risk. Please consult a healthcare professional.';
                break;
            case 'medium':
                title = 'Moderate Risk Alert';
                body = 'Your heart health indicators suggest a moderate risk. Consider lifestyle changes.';
                break;
            case 'low':
                title = 'Low Risk Notice';
                body = 'Your heart health indicators suggest a low risk. Keep up the healthy habits!';
                break;
            default:
                title = 'Risk Assessment Update';
                body = 'Your latest heart health assessment is ready to view.';
        }

        return await scheduleNotification(title, body, { riskLevel });
    }, [scheduleNotification]);

    return (
        <NotificationContext.Provider
            value={{
                hasPermission,
                requestPermissions,
                scheduleNotification,
                cancelAllNotifications,
                sendRiskLevelNotification,
                lastNotification: notification
            }}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;