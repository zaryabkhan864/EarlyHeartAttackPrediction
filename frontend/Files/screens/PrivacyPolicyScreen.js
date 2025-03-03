import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderComponent from '../components/HeaderComponent';
import { COLORS, FONTS, SIZES } from '../constants';
import { globalStyles } from '../styles/globalStyles';

const PrivacyPolicyScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={globalStyles.container}>
            <HeaderComponent title="Privacy Policy" showBackButton onBackPress={() => navigation.goBack()} />
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.contentContainer}>
                    <Text style={styles.lastUpdated}>Last Updated: March 1, 2025</Text>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Introduction</Text>
                        <Text style={styles.paragraph}>
                            Welcome to the EarlyHeartAttackPredictor privacy policy. This policy describes how we collect,
                            use, and protect your personal information when you use our application.
                        </Text>
                        <Text style={styles.paragraph}>
                            Your privacy is of utmost importance to us, especially given the sensitive nature of health data.
                            We are committed to maintaining the confidentiality and security of your information.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Information We Collect</Text>
                        <Text style={styles.paragraph}>
                            We collect the following types of information:
                        </Text>
                        <Text style={styles.listItem}>• Personal Information: Age, gender, and other demographic details you provide</Text>
                        <Text style={styles.listItem}>• Health Information: Medical history, smoking status, family history, and other health-related data you enter</Text>
                        <Text style={styles.listItem}>• Biometric Data: Heart rate, blood pressure, and other biometric measurements from connected devices</Text>
                        <Text style={styles.listItem}>• Device Information: Bluetooth device identifiers, connection status, and technical data</Text>
                        <Text style={styles.listItem}>• Usage Data: How you interact with the app, features used, and time spent</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>How We Use Your Information</Text>
                        <Text style={styles.paragraph}>
                            We use your information for the following purposes:
                        </Text>
                        <Text style={styles.listItem}>• To provide risk assessment and health recommendations</Text>
                        <Text style={styles.listItem}>• To improve the app's accuracy and functionality</Text>
                        <Text style={styles.listItem}>• To troubleshoot technical issues and optimize performance</Text>
                        <Text style={styles.listItem}>• To develop new features based on user needs</Text>
                        <Text style={styles.paragraph}>
                            We do not sell your personal information to third parties under any circumstances.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Data Security</Text>
                        <Text style={styles.paragraph}>
                            We implement appropriate security measures to protect your information:
                        </Text>
                        <Text style={styles.listItem}>• Encryption of sensitive health and personal data</Text>
                        <Text style={styles.listItem}>• Secure storage practices and regular security audits</Text>
                        <Text style={styles.listItem}>• Access controls limiting who can view your information</Text>
                        <Text style={styles.listItem}>• Regular security updates and vulnerability testing</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Data Sharing</Text>
                        <Text style={styles.paragraph}>
                            We may share your information in the following limited circumstances:
                        </Text>
                        <Text style={styles.listItem}>• With third-party service providers who help us operate the app</Text>
                        <Text style={styles.listItem}>• When required by law or in response to valid legal requests</Text>
                        <Text style={styles.listItem}>• With your explicit consent for specific purposes</Text>
                        <Text style={styles.paragraph}>
                            All third-party providers are bound by confidentiality agreements and are required to protect your data.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Your Rights</Text>
                        <Text style={styles.paragraph}>
                            You have the following rights regarding your personal information:
                        </Text>
                        <Text style={styles.listItem}>• Access: Request a copy of your data</Text>
                        <Text style={styles.listItem}>• Correction: Update or correct inaccurate information</Text>
                        <Text style={styles.listItem}>• Deletion: Request deletion of your data</Text>
                        <Text style={styles.listItem}>• Restriction: Limit how we use your data</Text>
                        <Text style={styles.listItem}>• Portability: Receive your data in a structured format</Text>
                        <Text style={styles.paragraph}>
                            To exercise these rights, please contact us at privacy@earlyheartattackpredictor.com.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Changes to This Policy</Text>
                        <Text style={styles.paragraph}>
                            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy
                            in the app and updating the "Last Updated" date.
                        </Text>
                        <Text style={styles.paragraph}>
                            It is advisable to review this policy periodically for any changes.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Contact Us</Text>
                        <Text style={styles.paragraph}>
                            If you have any questions or concerns about this privacy policy or our data practices, please contact us at:
                        </Text>
                        <Text style={styles.contactInfo}>privacy@earlyheartattackpredictor.com</Text>
                        <Text style={styles.contactInfo}>EarlyHeartAttackPredictor</Text>
                        <Text style={styles.contactInfo}>123 Health Street</Text>
                        <Text style={styles.contactInfo}>Medical City, MC 12345</Text>
                    </View>
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
    contentContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    lastUpdated: {
        fontSize: SIZES.small,
        color: COLORS.gray,
        marginBottom: 16,
        textAlign: 'right',
    },
    section: {
        marginBottom: 24,
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
    listItem: {
        fontSize: SIZES.small,
        color: COLORS.text,
        lineHeight: 22,
        marginBottom: 8,
        marginLeft: 8,
    },
    contactInfo: {
        fontSize: SIZES.small,
        color: COLORS.text,
        lineHeight: 22,
    },
});

export default PrivacyPolicyScreen;