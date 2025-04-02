// navigation/HomeStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

export default function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="HomeMain"
                component={HomeScreen}
                options={{ headerTitle: 'Heart Attack Predictor' }}
            />
        </Stack.Navigator>
    );
}