import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import HeaderComponent from '../components/HeaderComponent';
import { COLORS, FONTS, SIZES } from '../constants';
import { globalStyles } from '../styles/globalStyles';

const AboutScreen = () => {
    const navigation = useNavigation();
    const appVersion = "1.0.0";

    const handleEmailSupport = () => {
        Linking.openURL('mailto:support@earlyheartattackpredictor.com');
    };

    const handleVisitWebsite = () => {
        Linking.openURL('https://www.earlyheartattackpredictor.com');
    };

    return (
        <SafeAreaView style={globalStyles.container}>
            <HeaderComponent title="About" showBackButton onBackPress={() => navigation.goBack()} />
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/app-logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.appName}>EarlyHeartAttackPredictor</Text>
                    <Text style={styles.version}>Version {appVersion}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About This App</Text>
                    <Text style={styles.paragraph}>
                        EarlyHeartAttackPredictor is designed to help users monitor their heart health and
                        identify potential risk factors for heart attacks. By combining personal health information
                        with real-time biometric data from connected devices, the app provides a comprehensive
                        risk assessment and recommendations to improve heart health.
                    </Text>
                    <Text style={styles.paragraph}>
                        This application is intended for informational purposes only and should not replace
                        professional medical advice. Always consult with a healthcare provider for any
                        health concerns.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Features</Text>
                    <View style={styles.featureItem}>
                        <Ionicons name="pulse" size={24} color={COLORS.primary} style={styles.featureIcon} />
                        <Text style={styles.featureText}>Real-time biometric monitoring</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Ionicons name="bluetooth" size={24} color={COLORS.primary} style={styles.featureIcon} />
                        <Text style={styles.featureText}>Bluetooth device integration</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Ionicons name="analytics" size={24} color={COLORS.primary} style={styles.featureIcon} />
                        <Text style={styles.featureText}>Risk assessment algorithms</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Ionicons name="pencil" size={24} color={COLORS.primary} style={styles.featureIcon} />
                        <Text style={styles.featureText}>Personalized health recommendations</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Us</Text>
                    <TouchableOpacity style={styles.contactItem} onPress={handleEmailSupport}>
                        <Ionicons name="mail" size={24} color={COLORS.primary} style={styles.contactIcon} />
                        <Text style={styles.contactText}>support@earlyheartattackpredictor.com</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.contactItem} onPress={handleVisitWebsite}>
                        <Ionicons name="globe" size={24} color={COLORS.primary} style={styles.contactIcon} />
                        <Text style={styles.contactText}>www.earlyheartattackpredictor.com</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Legal</Text>
                    <TouchableOpacity
                        style={styles.legalItem}
                        onPress={() => navigation.navigate('PrivacyPolicyScreen')}
                    >
                        <Text style={styles.legalText}>Privacy Policy</Text>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.text} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.legalItem}
                        onPress={() => navigation.navigate('TermsOfServiceScreen')}
                    >
                        <Text style={styles.legalText}>Terms of Service</Text>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.text} />
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2025 EarlyHeartAttackPredictor</Text>
                    <Text style={styles.footerText}>All Rights Reserved</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        width: '100%',
    },
    logoContainer: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 16,
    },
    appName: {
        fontSize: SIZES.large,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 8,
    },
    version: {
        fontSize: SIZES.small,
        color: COLORS.gray,
    },
    section: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: SIZES.medium,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 12,
    },
    paragraph: {
        fontSize: SIZES.small,
        color: COLORS.text,
        lineHeight: 22,
        marginBottom: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    featureIcon: {
        marginRight: 12,
    },
    featureText: {
        fontSize: SIZES.small,
        color: COLORS.text,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    contactIcon: {
        marginRight: 12,
    },
    contactText: {
        fontSize: SIZES.small,
        color: COLORS.primary,
    },
    legalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    legalText: {
        fontSize: SIZES.small,
        color: COLORS.text,
    },
    footer: {
        padding: 24,
        alignItems: 'center',
    },
    footerText: {
        fontSize: SIZES.small,
        color: COLORS.gray,
        marginBottom: 4,
    },
});

export default AboutScreen;