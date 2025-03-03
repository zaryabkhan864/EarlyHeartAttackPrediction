import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import HomeScreen from './screens/HomeScreen';
import UserInfoScreen from './screens/UserInfoScreen';
import DeviceConnectScreen from './screens/DeviceConnectScreen';
import MonitoringScreen from './screens/MonitoringScreen';
import ResultsScreen from './screens/ResultsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <StatusBar style="auto" />
                <Stack.Navigator
                    initialRouteName="Home"
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: '#F5F7FA' }
                    }}
                >
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="UserInfo" component={UserInfoScreen} />
                    <Stack.Screen name="DeviceConnect" component={DeviceConnectScreen} />
                    <Stack.Screen name="Monitoring" component={MonitoringScreen} />
                    <Stack.Screen name="Results" component={ResultsScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}