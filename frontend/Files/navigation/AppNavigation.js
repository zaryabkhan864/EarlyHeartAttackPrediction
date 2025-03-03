import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import UserFormScreen from '../screens/UserFormScreen';
import BluetoothScreen from '../screens/BluetoothScreen';
import ResultsScreen from '../screens/ResultsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';

// Import constants
import { COLORS } from '../constants';

// Create navigation stacks
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main tab navigation
const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'UserForm') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else if (route.name === 'Bluetooth') {
                        iconName = focused ? 'bluetooth' : 'bluetooth-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.gray,
                tabBarStyle: {
                    height: 60,
                    paddingBottom: 10,
                    paddingTop: 10,
                },
                headerShown: false,
                tabBarLabel: () => null,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="UserForm" component={UserFormScreen} options={{ title: 'Profile' }} />
            <Tab.Screen name="Bluetooth" component={BluetoothScreen} options={{ title: 'Devices' }} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
};

// Main stack navigation with tabs as root
const AppNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="TabNavigator" component={TabNavigator} />
                <Stack.Screen name="Results" component={ResultsScreen} />
                <Stack.Screen name="AboutScreen" component={AboutScreen} />
                <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigation;