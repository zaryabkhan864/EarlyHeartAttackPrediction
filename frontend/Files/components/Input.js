import React from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { colors, spacing, typography } from '../globalStyles';

/**
 * Custom input component with label and error handling
 * @param {string} label - Input label
 * @param {string} value - Input value
 * @param {function} onChangeText - Function to call on text change
 * @param {string} error - Error message
 * @param {boolean} required - Whether field is required
 * @param {string} placeholder - Placeholder text
 * @param {object} style - Additional container styles
 * @param {object} inputStyle - Additional input styles
 */
const Input = ({
    label,
    value,
    onChangeText,
    error,
    required = false,
    placeholder,
    style,
    inputStyle,
    ...props
}) => {
    return (
        <View style={[styles.container, style]}>
            {label && (
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>{label}</Text>
                    {required && <Text style={styles.required}>*</Text>}
                </View>
            )}

            <TextInput
                style={[
                    styles.input,
                    error && styles.inputError,
                    inputStyle
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.gray400}
                {...props}
            />

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

/**
 * Numeric input component
 */
export const NumericInput = (props) => (
    <Input
        keyboardType="numeric"
        {...props}
    />
);

/**
 * Email input component
 */
export const EmailInput = (props) => (
    <Input
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
    />
);

/**
 * Password input component with show/hide functionality
 */
export const PasswordInput = ({ secureTextEntry = true, ...props }) => {
    const [isSecure, setIsSecure] = React.useState(secureTextEntry);

    return (
        <View style={styles.passwordContainer}>
            <Input
                secureTextEntry={isSecure}
                style={{ flex: 1 }}
                {...props}
            />
            <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setIsSecure(!isSecure)}
            >
                <Text style={styles.eyeButtonText}>
                    {isSecure ? 'Show' : 'Hide'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    labelContainer: {
        flexDirection: 'row',
        marginBottom: spacing.xs,
    },
    label: {
        ...typography.label,
        color: colors.gray800,
    },
    required: {
        color: colors.error,
        marginLeft: 4,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: colors.gray300,
        borderRadius: 8,
        paddingHorizontal: spacing.md,
        color: colors.gray900,
        backgroundColor: colors.white,
        ...typography.body,
    },
    inputError: {
        borderColor: colors.error,
    },
    errorText: {
        ...typography.caption,
        color: colors.error,
        marginTop: spacing.xs,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eyeButton: {
        position: 'absolute',
        right: spacing.md,
        height: 48,
        justifyContent: 'center',
    },
    eyeButtonText: {
        ...typography.caption,
        color: colors.primary,
    },
});

export default Input;