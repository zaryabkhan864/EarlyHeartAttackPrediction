import React, { createContext, useState, useEffect, useContext } from 'react';
import { storageService } from '../services/storageService';
import { bluetoothService } from '../services/bluetoothService';
import { riskCalculationService } from '../services/riskCalculationService';

// Create context
export const AppContext = createContext();

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);

// Provider component
export const AppProvider = ({ children }) => {
    // User data state
    const [userData, setUserData] = useState(null);

    // Bluetooth states
    const [bluetoothDevice, setBluetoothDevice] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [deviceList, setDeviceList] = useState([]);

    // Sensor data states
    const [sensorData, setSensorData] = useState([]);
    const [latestReading, setLatestReading] = useState(null);

    // Risk assessment states
    const [riskScore, setRiskScore] = useState(null);
    const [riskLevel, setRiskLevel] = useState(null);
    const [recommendations, setRecommendations] = useState([]);

    // App state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [settings, setSettings] = useState({
        notificationsEnabled: false,
        bluetoothAutoConnect: false,
        darkModeEnabled: false,
        dataBackupEnabled: false,
    });

    // Initialize app data
    useEffect(() => {
        const initializeApp = async () => {
            try {
                // Load user data from storage
                const storedUserData = await storageService.getUserData();
                if (storedUserData) {
                    setUserData(storedUserData);
                }

                // Load settings
                const storedSettings = await storageService.getSettings();
                if (storedSettings) {
                    setSettings(storedSettings);
                }

                // Auto-connect to last connected device if enabled
                if (settings.bluetoothAutoConnect) {
                    const lastDevice = await storageService.getLastConnectedDevice();
                    if (lastDevice) {
                        connectToDevice(lastDevice);
                    }
                }

                // Load latest sensor data
                const storedSensorData = await storageService.getLatestSensorData();
                if (storedSensorData) {
                    setSensorData(storedSensorData);
                    if (storedSensorData.length > 0) {
                        setLatestReading(storedSensorData[storedSensorData.length - 1]);
                    }
                }
            } catch (error) {
                console.error("Error initializing app:", error);
                setError("Failed to initialize app. Please restart.");
            } finally {
                setLoading(false);
            }
        };

        initializeApp();

        // Set up bluetooth event listeners
        bluetoothService.onDeviceDiscovered((device) => {
            setDeviceList(prevList => {
                // Check if device already exists in the list
                const exists = prevList.some(d => d.id === device.id);
                if (exists) {
                    return prevList.map(d => d.id === device.id ? device : d);
                } else {
                    return [...prevList, device];
                }
            });
        });

        bluetoothService.onConnected((device) => {
            setBluetoothDevice(device);
            setIsConnected(true);
            storageService.saveLastConnectedDevice(device);
        });

        bluetoothService.onDisconnected(() => {
            setIsConnected(false);
        });

        bluetoothService.onDataReceived((newData) => {
            setSensorData(prevData => [...prevData, newData]);
            setLatestReading(newData);

            // Calculate risk if we have both user data and sensor data
            if (userData) {
                calculateRisk(userData, newData);
            }
        });

        return () => {
            // Clean up bluetooth listeners when component unmounts
            bluetoothService.removeAllListeners();
        };
    }, []);

    // Start scanning for bluetooth devices
    const startScan = async () => {
        try {
            setIsScanning(true);
            setDeviceList([]);
            await bluetoothService.startScan();
        } catch (error) {
            console.error("Error starting scan:", error);
            setError("Failed to start scanning for devices.");
        }
    };

    // Stop scanning for bluetooth devices
    const stopScan = async () => {
        try {
            await bluetoothService.stopScan();
        } catch (error) {
            console.error("Error stopping scan:", error);
        } finally {
            setIsScanning(false);
        }
    };

    // Connect to a bluetooth device
    const connectToDevice = async (device) => {
        try {
            setLoading(true);
            await bluetoothService.connectToDevice(device);
        } catch (error) {
            console.error("Error connecting to device:", error);
            setError("Failed to connect to device. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Disconnect from bluetooth device
    const disconnectDevice = async () => {
        try {
            setLoading(true);
            await bluetoothService.disconnect();
            setBluetoothDevice(null);
        } catch (error) {
            console.error("Error disconnecting device:", error);
            setError("Failed to disconnect from device.");
        } finally {
            setLoading(false);
        }
    };

    // Save user data
    const saveUserData = async (data) => {
        try {
            setLoading(true);
            await storageService.saveUserData(data);
            setUserData(data);
        } catch (error) {
            console.error("Error saving user data:", error);
            setError("Failed to save user data.");
        } finally {
            setLoading(false);
        }
    };

    // Calculate risk based on user data and sensor readings
    const calculateRisk = async (user, sensorReading) => {
        try {
            const riskResult = await riskCalculationService.calculateRisk(user, sensorReading);
            setRiskScore(riskResult.riskScore);
            setRiskLevel(riskResult.riskLevel);
            setRecommendations(riskResult.recommendations);
            return riskResult;
        } catch (error) {
            console.error("Error calculating risk:", error);
            setError("Failed to calculate risk assessment.");
            return null;
        }
    };

    // Update app settings
    const updateSettings = async (newSettings) => {
        try {
            await storageService.saveSettings(newSettings);
            setSettings(newSettings);
        } catch (error) {
            console.error("Error updating settings:", error);
            setError("Failed to update settings.");
        }
    };

    // Clear error message
    const clearError = () => {
        setError(null);
    };

    // Context value
    const contextValue = {
        // User data
        userData,
        saveUserData,

        // Bluetooth
        bluetoothDevice,
        isConnected,
        isScanning,
        deviceList,
        startScan,
        stopScan,
        connectToDevice,
        disconnectDevice,

        // Sensor data
        sensorData,
        latestReading,

        // Risk assessment
        riskScore,
        riskLevel,
        recommendations,
        calculateRisk,

        // App state
        loading,
        error,
        clearError,
        settings,
        updateSettings,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};