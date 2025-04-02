import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
    const [userStats, setUserStats] = useState({
        heartCheckups: 3,
        healthyDays: 45,
        recommendations: 2
    });

    const healthMetrics = [
        { label: 'Blood Pressure', value: '120/80', status: 'Normal' },
        { label: 'Cholesterol', value: '190', status: 'Good' },
        { label: 'BMI', value: '24.5', status: 'Healthy' }
    ];

    const menuItems = [
        {
            icon: 'document-text-outline',
            title: 'Medical Records',
            onPress: () => navigation.navigate('MedicalRecords')
        },
        {
            icon: 'settings-outline',
            title: 'App Settings',
            onPress: () => navigation.navigate('Settings')
        },
        {
            icon: 'notifications-outline',
            title: 'Notifications',
            onPress: () => navigation.navigate('Notifications')
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person" size={60} color="white" />
                    </View>
                    <Text style={styles.profileName}>John Doe</Text>
                    <Text style={styles.profileSubtitle}>Heart Health Warrior</Text>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{userStats.heartCheckups}</Text>
                        <Text style={styles.statLabel}>Heart Checkups</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{userStats.healthyDays}</Text>
                        <Text style={styles.statLabel}>Healthy Days</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{userStats.recommendations}</Text>
                        <Text style={styles.statLabel}>Recommendations</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Health Metrics</Text>
                <View style={styles.metricsContainer}>
                    {healthMetrics.map((metric, index) => (
                        <View key={index} style={styles.metricCard}>
                            <Text style={styles.metricLabel}>{metric.label}</Text>
                            <View style={styles.metricValueContainer}>
                                <Text style={styles.metricValue}>{metric.value}</Text>
                                <Text style={styles.metricStatus}>{metric.status}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Quick Menu</Text>
                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.menuItem}
                            onPress={item.onPress}
                        >
                            <Ionicons
                                name={item.icon}
                                size={24}
                                color="#1D3557"
                                style={styles.menuIcon}
                            />
                            <Text style={styles.menuItemText}>{item.title}</Text>
                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color="#457B9D"
                            />
                        </TouchableOpacity>
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
    profileHeader: {
        backgroundColor: '#1D3557',
        alignItems: 'center',
        paddingVertical: 30,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    avatarContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#457B9D',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    profileSubtitle: {
        fontSize: 16,
        color: '#A8DADC',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    statCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        width: '30%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E63946',
    },
    statLabel: {
        fontSize: 12,
        color: '#457B9D',
        marginTop: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1D3557',
        marginTop: 20,
        marginBottom: 10,
        paddingHorizontal: 15,
    },
    metricsContainer: {
        paddingHorizontal: 15,
    },
    metricCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    metricLabel: {
        fontSize: 16,
        color: '#1D3557',
    },
    metricValueContainer: {
        alignItems: 'flex-end',
    },
    metricValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E63946',
    },
    metricStatus: {
        fontSize: 12,
        color: '#457B9D',
    },
    menuContainer: {
        paddingHorizontal: 15,
    },
    menuItem: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    menuIcon: {
        marginRight: 15,
    },
    menuItemText: {
        flex: 1,
        fontSize: 16,
        color: '#1D3557',
    },
});