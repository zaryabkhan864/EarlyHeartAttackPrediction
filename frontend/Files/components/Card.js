import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, shadows } from '../globalStyles';

/**
 * Card component for displaying grouped content
 * @param {object} style - Additional styles
 * @param {boolean} onPress - Makes card pressable if provided
 * @param {boolean} bordered - Whether to show border
 * @param {number} elevation - Shadow elevation
 */
const Card = ({
    children,
    style,
    onPress,
    bordered = false,
    elevation = 2
}) => {
    const cardContent = (
        <View
            style={[
                styles.card,
                bordered && styles.bordered,
                elevation > 0 && { ...shadows[elevation] },
                style
            ]}
        >
            {children}
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
                {cardContent}
            </TouchableOpacity>
        );
    }

    return cardContent;
};

/**
 * Card section component for internal card organization
 */
export const CardSection = ({ children, style, bordered = false }) => (
    <View style={[styles.section, bordered && styles.borderedSection, style]}>
        {children}
    </View>
);

/**
 * Card header component
 */
export const CardHeader = ({ children, style }) => (
    <View style={[styles.header, style]}>
        {children}
    </View>
);

/**
 * Card body component
 */
export const CardBody = ({ children, style }) => (
    <View style={[styles.body, style]}>
        {children}
    </View>
);

/**
 * Card footer component
 */
export const CardFooter = ({ children, style }) => (
    <View style={[styles.footer, style]}>
        {children}
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderRadius: 8,
        overflow: 'hidden',
        marginVertical: spacing.sm,
    },
    bordered: {
        borderWidth: 1,
        borderColor: colors.gray200,
    },
    section: {
        padding: spacing.md,
    },
    borderedSection: {
        borderBottomWidth: 1,
        borderBottomColor: colors.gray200,
    },
    header: {
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray200,
    },
    body: {
        padding: spacing.md,
    },
    footer: {
        padding: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.gray200,
    },
});

export default Card;