import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
    const quickActionCards = [
        {
            icon: 'heart-outline',
            title: 'Risk Assessment',
            description: 'Get instant heart health prediction',
            onPress: () => navigation.navigate('Monitor')
        },
        {
            icon: 'person-outline',
            title: 'Update Profile',
            description: 'Keep your information current',
            onPress: () => navigation.navigate('UserDataEntry')
        },
        {
            icon: 'cellular-outline',
            title: 'Health Trends',
            description: 'View your health history',
            onPress: () => navigation.navigate('History')
        }
    ];

    const healthTips = [
        "Stay active for at least 30 minutes daily",
        "Maintain a balanced diet rich in fruits and vegetables",
        "Manage stress through meditation or yoga",
        "Get regular health check-ups",
        "Limit alcohol and avoid smoking"
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.headerContainer}>
                    <Text style={styles.welcomeText}>Welcome, John</Text>
                    <Text style={styles.subtitleText}>Early Heart Attack Predictor</Text>
                </View>

                <View style={styles.riskStatusContainer}>
                    <View style={styles.riskCard}>
                        <Text style={styles.riskTitle}>Current Risk Level</Text>
                        <Text style={styles.riskLevel}>Moderate</Text>
                        <View style={styles.riskIndicator}>
                            <View style={[styles.riskDot, styles.lowRisk]}></View>
                            <View style={[styles.riskDot, styles.mediumRisk, styles.activeDot]}></View>
                            <View style={[styles.riskDot, styles.highRisk]}></View>
                        </View>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.quickActionsContainer}>
                    {quickActionCards.map((card, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.quickActionCard}
                            onPress={card.onPress}
                        >
                            <Ionicons
                                name={card.icon}
                                size={30}
                                color="#1D3557"
                                style={styles.quickActionIcon}
                            />
                            <View>
                                <Text style={styles.quickActionTitle}>{card.title}</Text>
                                <Text style={styles.quickActionDescription}>{card.description}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Daily Health Tips</Text>
                <View style={styles.healthTipsContainer}>
                    {healthTips.map((tip, index) => (
                        <View key={index} style={styles.healthTipCard}>
                            <Ionicons
                                name="nutrition-outline"
                                size={20}
                                color="#457B9D"
                                style={styles.tipIcon}
                            />
                            <Text style={styles.healthTipText}>{tip}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1FAEE',
    },
    headerContainer: {
        backgroundColor: '#1D3557',
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    subtitleText: {
        fontSize: 16,
        color: '#A8DADC',
    },
    riskStatusContainer: {
        paddingHorizontal: 15,
        marginTop: 20,
    },
    riskCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    riskTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1D3557',
        textAlign: 'center',
    },
    riskLevel: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E63946',
        textAlign: 'center',
        marginVertical: 10,
    },
    riskIndicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    riskDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    lowRisk: {
        backgroundColor: '#2A9D8F',
    },
    mediumRisk: {
        backgroundColor: '#F4A261',
    },
    highRisk: {
        backgroundColor: '#E76F51',
    },
    activeDot: {
        transform: [{ scale: 1.2 }],
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1D3557',
        marginTop: 20,
        marginBottom: 10,
        paddingHorizontal: 15,
    },
    quickActionsContainer: {
        paddingHorizontal: 15,
    },
    quickActionCard: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    quickActionIcon: {
        marginRight: 15,
    },
    quickActionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1D3557',
    },
    quickActionDescription: {
        fontSize: 12,
        color: '#457B9D',
    },
    healthTipsContainer: {
        paddingHorizontal: 15,
    },
    healthTipCard: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    tipIcon: {
        marginRight: 10,
    },
    healthTipText: {
        fontSize: 14,
        color: '#1D3557',
        flex: 1,
        flexWrap: 'wrap',
    },
});