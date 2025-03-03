import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from './ThemeContext';

const Label = ({ children, style, required, error }) => {
    const { theme } = useTheme();

    const labelStyle = [
        styles.label,
        { color: theme.textColor },
        error && { color: theme.errorColor },
        style
    ];

    return (
        <Text style={labelStyle}>
            {children}
            {required && <Text style={{ color: theme.errorColor }}> *</Text>}
            {error && <Text style={{ color: theme.errorColor, fontSize: 12 }}> {error}</Text>}
        </Text>
    );
};

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 6
    }
});

export default Label;