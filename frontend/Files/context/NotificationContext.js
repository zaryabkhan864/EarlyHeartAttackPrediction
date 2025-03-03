import React, { createContext, useState, useContext, useCallback } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { colors, typography, spacing } from '../globalStyles';

// Create notification context
const NotificationContext = createContext(null);

/**
 * Notification types with associated styles
 */
const NOTIFICATION_TYPES = {
    SUCCESS: {
        backgroundColor: colors.success,
        icon: '✓',
    },
    ERROR: {
        backgroundColor: colors.error,
        icon: '✗',
    },
    INFO: {
        backgroundColor: colors.info,
        icon: 'ℹ',
    },
    WARNING: {
        backgroundColor: colors.warning,
        icon: '⚠',
    },
};

/**
 * Provider component for notifications
 */
export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);
    const [animation] = useState(new Animated.Value(0));

    // Show notification
    const showNotification = useCallback((message, type = 'INFO', duration = 3000) => {
        // Hide any existing notification first
        if (notification) {
            hideNotification();
        }

        // Set new notification
        setNotification({
            message,
            type: NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.INFO,
        });

        // Animate in
        Animated.timing(animation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        // Auto-hide after duration
        if (duration > 0) {
            setTimeout(hideNotification, duration);
        }
    }, [notification, animation]);

    // Hide notification
    const hideNotification = useCallback(() => {
        Animated.timing(animation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setNotification(null);
        });
    }, [animation]);

    // Success notification shorthand
    const showSuccess = useCallback((message, duration) => {
        showNotification(message, 'SUCCESS', duration);
    }, [showNotification]);

    // Error notification shorthand
    const showError = useCallback((message, duration) => {
        showNotification(message, 'ERROR', duration);
    }, [showNotification]);

    // Info notification shorthand
    const showInfo = useCallback((message, duration) => {
        showNotification(message, 'INFO', duration);
    }, [showNotification]);

    // Warning notification shorthand
    const showWarning = useCallback((message, duration) => {
        showNotification(message, 'WARNING', duration);
    }, [showNotification]);

    // Animation styles
    const animatedStyles = {
        transform: [
            {
                translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, 0],
                }),
            },
        ],
        opacity: animation,
    };

    return (
        <NotificationContext.Provider
            value={{
                showNotification,
                hideNotification,
                showSuccess,
                showError,
                showInfo,
                showWarning,
            }}
        >
            {children}

            {notification && (
                <Animated.View
                    style={[
                        styles.notification,
                        { backgroundColor: notification.type.backgroundColor },
                        animatedStyles,
                    ]}
                >
                    <Text style={styles.icon}>{notification.type.icon}</Text>
                    <Text style={styles.message}>{notification.message}</Text>
                </Animated.View>
            )}
        </NotificationContext.Provider>
    );
};

// Custom hook for using notifications
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

const styles = StyleSheet.create({
    notification: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        zIndex: 1000,
    },
    icon: {
        color: colors.white,
        fontSize: 20,
        marginRight: spacing.sm,
    },
    message: {
        ...typography.body,
        color: colors.white,
        flex: 1,
    },
});

export default NotificationContext;