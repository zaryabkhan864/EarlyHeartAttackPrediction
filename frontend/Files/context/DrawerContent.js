import React, { useContext } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useTheme } from '../contexts/ThemeContext';
import { AppContext } from '../contexts/AppContext';
import { DeviceContext } from '../contexts/DeviceContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DrawerContent = (props) => {
    const { theme, toggleTheme } = useTheme();
    const { user } = useContext(AppContext);
    const { selectedDevice } = useContext(DeviceContext);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.drawerBackground,
        },
        userSection: {
            paddingHorizontal: 20,
            paddingVertical: 20,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
        },
        userInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
        },
        profileImage: {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: theme.primaryColor,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 15,
        },
        profileInitial: {
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
        },
        userName: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.textColor,
        },
        userAge: {
            fontSize: 14,
            color: theme.textSecondary,
        },
        deviceInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
        },
        deviceStatus: {
            fontSize: 14,
            color: selectedDevice ? theme.successColor : theme.warningColor,
            marginLeft: 5,
        },
        section: {
            paddingTop: 15,
            paddingBottom: 5,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
        },
        sectionTitle: {
            fontSize: 14,
            color: theme.textSecondary,
            marginBottom: 10,
        },
        themeToggle: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 15,
        },
        themeText: {
            fontSize: 14,
            color: theme.textColor,
        },
        drawerItem: {
            backgroundColor: 'transparent',
        },
        drawerLabel: {
            fontSize: 14,
            color: theme.textColor,
            fontWeight: 'normal',
        },
        footer: {
            padding: 20,
            borderTopWidth: 1,
            borderTopColor: theme.borderColor,
        },
        version: {
            fontSize: 12,
            color: theme.textSecondary,
            textAlign: 'center',
        },
    });

    // Get the first letter of the user's name for the profile circle
    const getInitial = () => {
        if (user && user.name) {
            return user.name.charAt(0).toUpperCase();
        }
        return 'U';
    };

    return (
        <DrawerContentScrollView
            {...props}
            contentContainerStyle={styles.container}
        >
            <View style={styles.userSection}>
                <View style={styles.userInfo}>
                    <View style={styles.profileImage}>
                        <Text style={styles.profileInitial}>{getInitial()}</Text>
                    </View>
                    <View>
                        <Text style={styles.userName}>{user ? user.name : 'User'}</Text>
                        <Text style={styles.userAge}>
                            {user ? `Age: ${user.age || 'N/A'}` : 'Complete your profile'}
                        </Text>
                    </View>
                </View>
                <View style={styles.deviceInfo}>
                    <Icon
                        name={selectedDevice ? 'bluetooth-connect' : 'bluetooth-off'}
                        size={16}
                        color={selectedDevice ? theme.successColor : theme.warningColor}
                    />
                    <Text style={styles.deviceStatus}>
                        {selectedDevice
                            ? `Connected to ${selectedDevice.name}`
                            : 'No device connected'}
                    </Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>MAIN</Text>
                <DrawerItem
                    icon={({ color, size }) => (
                        <Icon name="home-outline" color={theme.textColor} size={size} />
                    )}
                    label="Home"
                    labelStyle={styles.drawerLabel}
                    style={styles.drawerItem}
                    onPress={() => props.navigation.navigate('Home')}
                />
                <DrawerItem
                    icon={({ color, size }) => (
                        <Icon name="account-outline" color={theme.textColor} size={size} />
                    )}
                    label="Profile"
                    labelStyle={styles.drawerLabel}
                    style={styles.drawerItem}
                    onPress={() => props.navigation.navigate('UserForm')}
                />
                <DrawerItem
                    icon={({ color, size }) => (
                        <Icon name="bluetooth" color={theme.textColor} size={size} />
                    )}
                    label="Bluetooth Devices"
                    labelStyle={styles.drawerLabel}
                    style={styles.drawerItem}
                    onPress={() => props.navigation.navigate('Bluetooth')}
                />
                <DrawerItem
                    icon={({ color, size }) => (
                        <Icon name="chart-line" color={theme.textColor} size={size} />
                    )}
                    label="Results"
                    labelStyle={styles.drawerLabel}
                    style={styles.drawerItem}
                    onPress={() => props.navigation.navigate('Results')}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>PREFERENCES</Text>
                <DrawerItem
                    icon={({ color, size }) => (
                        <Icon name="cog-outline" color={theme.textColor} size={size} />
                    )}
                    label="Settings"
                    labelStyle={styles.drawerLabel}
                    style={styles.drawerItem}
                    onPress={() => props.navigation.navigate('Settings')}
                />
                <View style={styles.themeToggle}>
                    <Text style={styles.themeText}>Dark Theme</Text>
                    <Switch
                        value={theme.dark}
                        onValueChange={toggleTheme}
                        trackColor={{ false: '#767577', true: `${theme.primaryColor}80` }}
                        thumbColor={theme.primaryColor}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>INFORMATION</Text>
                <DrawerItem
                    icon={({ color, size }) => (
                        <Icon name="information-outline" color={theme.textColor} size={size} />
                    )}
                    label="About"
                    labelStyle={styles.drawerLabel}
                    style={styles.drawerItem}
                    onPress={() => props.navigation.navigate('About')}
                />
                <DrawerItem
                    icon={({ color, size }) => (
                        <Icon name="shield-outline" color={theme.textColor} size={size} />
                    )}
                    label="Privacy Policy"
                    labelStyle={styles.drawerLabel}
                    style={styles.drawerItem}
                    onPress={() => props.navigation.navigate('PrivacyPolicy')}
                />
            </View>

            <View style={styles.footer}>
                <Text style={styles.version}>EarlyHeartAttackPredictor v1.0.0</Text>
            </View>
        </DrawerContentScrollView>
    );
};

export default DrawerContent;