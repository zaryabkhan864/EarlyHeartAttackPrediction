import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { colors, spacing, typography } from '../globalStyles';

/**
 * Custom button component with different variants
 * @param {string} variant - 'primary', 'secondary', 'outline', 'danger'
 * @param {function} onPress - Function to call on press
 * @param {boolean} loading - Whether to show loading indicator
 * @param {boolean} disabled - Whether button is disabled
 * @param {string} title - Button text
 * @param {object} style - Additional styles
 */
const Button = ({
    variant = 'primary',
    onPress,
    loading = false,
    disabled = false,
    title,
    style,
    ...props
}) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'secondary':
                return {
                    button: styles.secondaryButton,
                    text: styles.secondaryText
                };
            case 'outline':
                return {
                    button: styles.outlineButton,
                    text: styles.outlineText
                };
            case 'danger':
                return {
                    button: styles.dangerButton,
                    text: styles.dangerText
                };
            default:
                return {
                    button: styles.primaryButton,
                    text: styles.primaryText
                };
        }
    };

    const variantStyles = getVariantStyles();
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                variantStyles.button,
                isDisabled && styles.disabledButton,
                style
            ]}
            onPress={onPress}
            disabled={isDisabled}
            {...props}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'outline' ? colors.primary : 'white'}
                    size="small"
                />
            ) : (
                <Text
                    style={[
                        styles.text,
                        variantStyles.text,
                        isDisabled && styles.disabledText
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        minHeight: 48,
    },
    text: {
        ...typography.button,
        textAlign: 'center',
    },
    primaryButton: {
        backgroundColor: colors.primary,
    },
    primaryText: {
        color: colors.white,
    },
    secondaryButton: {
        backgroundColor: colors.secondary,
    },
    secondaryText: {
        color: colors.white,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    outlineText: {
        color: colors.primary,
    },
    dangerButton: {
        backgroundColor: colors.error,
    },
    dangerText: {
        color: colors.white,
    },
    disabledButton: {
        backgroundColor: colors.gray200,
        borderColor: colors.gray200,
    },
    disabledText: {
        color: colors.gray500,
    }
});

export default Button;