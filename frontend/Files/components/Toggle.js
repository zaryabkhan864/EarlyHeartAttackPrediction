import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated
} from 'react-native';
import { colors, spacing, typography } from '../globalStyles';

/**
 * Custom toggle switch component
 * @param {boolean} value - Whether toggle is on
 * @param {function} onValueChange - Function to call on toggle
 * @param {string} label - Toggle label
 * @param {object} style - Additional styles
 */
const Toggle = ({
    value,
    onValueChange,
    label,
    style,
    disabled = false,
    ...props
}) => {
    const [toggleAnimation] = React.useState(new Animated.Value(value ? 1 : 0));

    React.useEffect(() => {
        Animated.timing(toggleAnimation, {
            toValue: value ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [value]);

    const thumbPosition = toggleAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 22],
    });

    const backgroundColor = toggleAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.gray300, colors.primary],
    });

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => !disabled && onValueChange(!value)}
                style={[styles.toggleContainer, disabled && styles.disabled]}
                {...props}
            >
                <Animated.View
                    style={[
                        styles.toggleBackground,
                        { backgroundColor },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.thumb,
                        { transform: [{ translateX: thumbPosition }] },
                    ]}
                />
            </TouchableOpacity>
        </View>
    );
};

/**
 * Switch with left and right labels
 */
export const LabeledToggle = ({
    value,
    onValueChange,
    leftLabel,
    rightLabel,
    style,
    disabled = false,
}) => {
    return (
        <View style={[styles.labeledContainer, style]}>
            <Text style={[
                styles.sideLabel,
                !value && styles.activeSideLabel
            ]}>
                {leftLabel}
            </Text>

            <Toggle
                value={value}
                onValueChange={onValueChange}
                disabled={disabled}
            />

            <Text style={[
                styles.sideLabel,
                value && styles.activeSideLabel
            ]}>
                {rightLabel}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: spacing.xs,
    },
    label: {
        ...typography.body,
        flex: 1,
        color: colors.gray800,
    },
    toggleContainer: {
        width: 50,
        height: 30,
        borderRadius: 15,
        padding: 2,
        justifyContent: 'center',
    },
    toggleBackground: {
        position: 'absolute',
        width: 50,
        height: 30,
        borderRadius: 15,
    },
    thumb: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: colors.white,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    disabled: {
        opacity: 0.5,
    },
    labeledContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: spacing.sm,
    },
    sideLabel: {
        ...typography.body,
        color: colors.gray500,
        marginHorizontal: spacing.md,
    },
    activeSideLabel: {
        color: colors.primary,
        fontWeight: '600',
    },
});

export default Toggle;