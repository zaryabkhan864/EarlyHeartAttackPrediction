import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/globalStyles';

const LoadingIndicator = ({ message = 'Loading...' }) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    message: {
        marginTop: 10,
        color: colors.gray,
        fontSize: 16,
        textAlign: 'center',
    },
});

export default LoadingIndicator;