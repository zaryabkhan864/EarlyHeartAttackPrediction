import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BluetoothSetupScreen from '../screens/BluetoothSetupScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

export default function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="BluetoothSetup" component={BluetoothSetupScreen} />
        </Stack.Navigator>
    );
}