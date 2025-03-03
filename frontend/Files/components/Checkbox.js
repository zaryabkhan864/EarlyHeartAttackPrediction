import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from './ThemeContext';

const Checkbox = ({
    label,
    checked,
    onToggle,
    disabled = false,
    error,
    style
}) => {
    const { theme } = useTheme();

    const containerStyle = [
        styles.container,
        style
    ];

    const checkboxStyle = [
        styles.checkbox,
        {
            borderColor: error ? theme.errorColor : theme.borderColor,
            backgroundColor: checked ? theme.primaryColor : theme.cardBackground
        },
        disabled && { opacity: 0.5 }
    ];

    const labelStyle = [
        styles.label,
        { color: theme.textColor },
        disabled && { opacity: 0.5 },
        error && { color: theme.errorColor }
    ];

    return (
        <View style={containerStyle}>
            <TouchableOpacity
                style={checkboxStyle}
                onPress={() => !disabled && onToggle(!checked)}
                disabled={disabled}
            >
                {checked && (
                    <Text style={styles.checkmark}>✓</Text>
                )}
            </TouchableOpacity>
            {label && (
                <TouchableOpacity
                    onPress={() => !disabled && onToggle(!checked)}
                    disabled={disabled}
                >
                    <Text style={labelStyle}>{label}</Text>
                </TouchableOpacity>
            )}
            {error && (
                <Text style={[styles.errorText, { color: theme.errorColor }]}>
                    {error}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderRadius: 4,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 16,
    },
    errorText: {
        fontSize: 12,
        marginLeft: 10,
    }
});

export default Checkbox;