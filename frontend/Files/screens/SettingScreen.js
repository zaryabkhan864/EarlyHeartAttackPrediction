import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import HeaderComponent from '../components/HeaderComponent';
import { storageService } from '../services/storageService';
import { bluetoothService } from '../services/bluetoothService';
import { COLORS, FONTS, SIZES } from '../constants';
import { globalStyles } from '../styles/globalStyles';

const SettingsScreen = () => {
    const navigation = useNavigation();
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [bluetoothAutoConnect, setBluetoothAutoConnect] = useState(false);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);
    const [dataBackupEnabled, setDataBackupEnabled] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const settings = await storageService.getSettings();
                if (settings) {
                    setNotificationsEnabled(settings.notificationsEnabled || false);
                    setBluetoothAutoConnect(settings.bluetoothAutoConnect || false);
                    setDarkModeEnabled(settings.darkModeEnabled || false);
                    setDataBackupEnabled(settings.dataBackupEnabled || false);
                }
            } catch (error) {
                console.error("Error loading settings:", error);
            }
        };

        loadSettings();
    }, []);

    const saveSettings = async (key, value) => {
        try {
            const settings = await storageService.getSettings() || {};
            settings[key] = value;
            await storageService.saveSettings(settings);
        } catch (error) {
            console.error("Error saving settings:", error);
            Alert.alert("Error", "Failed to save settings");
        }
    };

    const handleToggleNotifications = (value) => {
        setNotificationsEnabled(value);
        saveSettings('notificationsEnabled', value);
    };

    const handleToggleBluetoothAutoConnect = (value) => {
        setBluetoothAutoConnect(value);
        saveSettings('bluetoothAutoConnect', value);
        if (value) {
            bluetoothService.enableAutoConnect();
        } else {
            bluetoothService.disableAutoConnect();
        }
    };

    const handleToggleDarkMode = (value) => {
        setDarkModeEnabled(value);
        saveSettings('darkModeEnabled', value);
        // Actual theme changes would be implemented through a theme context
    };

    const handleToggleDataBackup = (value) => {
        setDataBackupEnabled(value);
        saveSettings('dataBackupEnabled', value);
    };

    const handleClearData = () => {
        Alert.alert(
            "Clear All Data",
            "Are you sure you want to clear all app data? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear Data",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await storageService.clearAllData();
                            Alert.alert("Success", "All data has been cleared");
                        } catch (error) {
                            console.error("Error clearing data:", error);
                            Alert.alert("Error", "Failed to clear data");
                        }
                    }
                }
            ]
        );
    };

    const handleAbout = () => {
        navigation.navigate('AboutScreen');
    };

    const handlePrivacyPolicy = () => {
        navigation.navigate('PrivacyPolicyScreen');
    };

    return (
        <SafeAreaView style={globalStyles.container}>
            <HeaderComponent title="Settings" showBackButton onBackPress={() => navigation.goBack()} />
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>App Settings</Text>

                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Enable Notifications</Text>
                        <Switch
                            trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                            thumbColor={notificationsEnabled ? COLORS.white : COLORS.lightGray}
                            onValueChange={handleToggleNotifications}
                            value={notificationsEnabled}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Auto-connect to Bluetooth Device</Text>
                        <Switch
                            trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                            thumbColor={bluetoothAutoConnect ? COLORS.white : COLORS.lightGray}
                            onValueChange={handleToggleBluetoothAutoConnect}
                            value={bluetoothAutoConnect}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Dark Mode</Text>
                        <Switch
                            trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                            thumbColor={darkModeEnabled ? COLORS.white : COLORS.lightGray}
                            onValueChange={handleToggleDarkMode}
                            value={darkModeEnabled}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Enable Data Backup</Text>
                        <Switch
                            trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                            thumbColor={dataBackupEnabled ? COLORS.white : COLORS.lightGray}
                            onValueChange={handleToggleDataBackup}
                            value={dataBackupEnabled}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Data Management</Text>

                    <TouchableOpacity style={styles.button} onPress={handleClearData}>
                        <Text style={styles.buttonText}>Clear All Data</Text>
                        <Ionicons name="trash-outline" size={24} color={COLORS.error} />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>

                    <TouchableOpacity style={styles.button} onPress={handleAbout}>
                        <Text style={styles.buttonText}>About EarlyHeartAttackPredictor</Text>
                        <Ionicons name="information-circle-outline" size={24} color={COLORS.text} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={handlePrivacyPolicy}>
                        <Text style={styles.buttonText}>Privacy Policy</Text>
                        <Ionicons name="shield-checkmark-outline" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        width: '100%',
    },
    section: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: SIZES.medium,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 16,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    settingLabel: {
        fontSize: SIZES.small,
        color: COLORS.text,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    buttonText: {
        fontSize: SIZES.small,
        color: COLORS.text,
    },
});

export default SettingsScreen;