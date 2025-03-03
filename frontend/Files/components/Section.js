import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../globalStyles';

/**
 * Section component for organizing content with title and optional subtitle
 * @param {string} title - Section title
 * @param {string} subtitle - Optional subtitle
 * @param {object} style - Additional container styles
 * @param {object} titleStyle - Additional title styles
 * @param {object} subtitleStyle - Additional subtitle styles
 * @param {object} contentStyle - Additional content styles
 */
const Section = ({
    title,
    subtitle,
    children,
    style,
    titleStyle,
    subtitleStyle,
    contentStyle,
}) => {
    return (
        <View style={[styles.container, style]}>
            {title && (
                <View style={styles.headerContainer}>
                    <Text style={[styles.title, titleStyle]}>{title}</Text>
                    {subtitle && (
                        <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
                    )}
                </View>
            )}
            <View style={[styles.content, contentStyle]}>
                {children}
            </View>
        </View>
    );
};

/**
 * Collapsible section component
 */
export const CollapsibleSection = ({
    title,
    subtitle,
    children,
    initiallyExpanded = false,
    ...props
}) => {
    const [expanded, setExpanded] = React.useState(initiallyExpanded);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    return (
        <View style={styles.collapsibleContainer}>
            <View
                style={styles.collapsibleHeader}
                onStartShouldSetResponder={() => true}
                onResponderRelease={toggleExpanded}
            >
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{title}</Text>
                    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>
                <Text style={styles.expandIcon}>{expanded ? '−' : '+'}</Text>
            </View>

            {expanded && (
                <View style={styles.collapsibleContent}>
                    {children}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: spacing.md,
    },
    headerContainer: {
        marginBottom: spacing.sm,
    },
    title: {
        ...typography.h5,
        color: colors.gray900,
    },
    subtitle: {
        ...typography.caption,
        color: colors.gray600,
        marginTop: spacing.xs,
    },
    content: {
        marginTop: spacing.xs,
    },
    collapsibleContainer: {
        marginVertical: spacing.sm,
        borderWidth: 1,
        borderColor: colors.gray200,
        borderRadius: 8,
        overflow: 'hidden',
    },
    collapsibleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.gray50,
    },
    collapsibleContent: {
        padding: spacing.md,
        backgroundColor: colors.white,
    },
    expandIcon: {
        ...typography.h5,
        color: colors.primary,
        marginLeft: spacing.sm,
    },
});

export default Section;