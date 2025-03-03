import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/globalStyles';

const HeaderComponent = ({ title, showBackButton = true, rightComponent = null }) => {
    const navigation = useNavigation();

    return (
        <SafeAreaView edges={['top']} style={styles.safeArea}>
            <View style={styles.container}>
                {showBackButton ? (
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.emptySpace} />
                )}

                <Text style={styles.title}>{title}</Text>

                {rightComponent ? (
                    rightComponent
                ) : (
                    <View style={styles.emptySpace} />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
        paddingHorizontal: 16,
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        fontSize: 24,
        color: colors.primary,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark,
        textAlign: 'center',
        flex: 1,
    },
    emptySpace: {
        width: 40,
    },
});

export default HeaderComponent;