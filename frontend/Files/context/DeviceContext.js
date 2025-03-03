import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Platform, Dimensions } from 'react-native';

// Create device context
const DeviceContext = createContext(null);

/**
 * Provider component for device information
 */
export const DeviceProvider = ({ children }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [isTablet, setIsTablet] = useState(false);
    const [orientation, setOrientation] = useState(
        dimensions.width > dimensions.height ? 'landscape' : 'portrait'
    );

    // Update dimensions when screen size changes
    useEffect(() => {
        const handleChange = ({ window }) => {
            setDimensions(window);
            setOrientation(window.width > window.height ? 'landscape' : 'portrait');
        };

        // Check if device is a tablet
        const { width, height } = Dimensions.get('window');
        const screenWidth = width < height ? width : height;
        const screenHeight = width < height ? height : width;
        const aspectRatio = screenHeight / screenWidth;

        // Tablets typically have aspect ratios closer to 4:3
        setIsTablet(
            Platform.OS === 'ios'
                ? aspectRatio < 1.6 && screenWidth >= 768
                : aspectRatio < 1.6 && screenWidth >= 600
        );

        Dimensions.addEventListener('change', handleChange);

        return () => {
            // For Expo SDK 41+
            if (Dimensions.removeEventListener) {
                Dimensions.removeEventListener('change', handleChange);
            }
        };
    }, []);

    // Helper to determine if running on iOS
    const isIOS = Platform.OS === 'ios';

    // Helper to determine if running on Android
    const isAndroid = Platform.OS === 'android';

    // Helper to check if it's a small screen device
    const isSmallDevice = dimensions.width < 375;

    // Helper to check if it's a large screen device
    const isLargeDevice = dimensions.width >= 428;

    // Helper to check if device has notch (approximate)
    const hasNotch = useCallback(() => {
        // This is a simplified check that works for most devices
        if (Platform.OS === 'ios') {
            return !Platform.isPad && !Platform.isTVOS && dimensions.height > 800;
        }
        return false;
    }, [dimensions.height]);

    return (
        <DeviceContext.Provider
            value={{
                dimensions,
                isTablet,
                orientation,
                isIOS,
                isAndroid,
                isSmallDevice,
                isLargeDevice,
                hasNotch: hasNotch(),
                statusBarHeight: Platform.OS === 'ios' ? (hasNotch() ? 44 : 20) : 0,
                bottomInset: Platform.OS === 'ios' && hasNotch() ? 34 : 0,
            }}
        >
            {children}
        </DeviceContext.Provider>
    );
};

// Custom hook for using device information
export const useDevice = () => {
    const context = useContext(DeviceContext);
    if (!context) {
        throw new Error('useDevice must be used within a DeviceProvider');
    }
    return context;
};

export default DeviceContext;