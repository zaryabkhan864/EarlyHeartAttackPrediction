// navigation/MonitorStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import MonitorScreen from '../screens/MonitorScreen';

const Stack = createStackNavigator();

export default function MonitorStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MonitorMain"
                component={MonitorScreen}
                options={{ headerTitle: 'Live Monitoring' }}
            />
        </Stack.Navigator>
    );
}