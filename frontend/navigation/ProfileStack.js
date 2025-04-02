// navigation/ProfileStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

export default function ProfileStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ProfileMain"
                component={ProfileScreen}
                options={{ headerTitle: 'My Profile' }}
            />
        </Stack.Navigator>
    );
}