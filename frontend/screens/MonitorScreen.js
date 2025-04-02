import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MonitorScreen({ navigation }) {
    const [heartData, setHeartData] = useState({
        heartRate: 72,
        bloodPressure: '120/80',
        oxygenLevel: 98,
        riskLevel: 'Low',
        lastUpdated: new Date()
    });

    const [vitalsHistory, setVitalsHistory] = useState([
        { time: '9:15 AM', heartRate: 70, riskLevel: 'Low' },
        { time: '9:00 AM', heartRate: 75, riskLevel: 'Low' },
        { time: '8:45 AM', heartRate: 68, riskLevel: 'Low' }
    ]);

    const riskColorMap = {
        'Low': '#2A9D8F',
        'Medium': '#F4A261',
        'High': '#E76F51'
    };

    const vitalIndicators = [
        {
            icon: 'heart-outline',
            label: 'Heart Rate',
            value: heartData.heartRate,
            unit: 'BPM'
        },
        {
            icon: 'water-outline',
            label: 'Blood Pressure',
            value: heartData.bloodPressure,
            unit: 'mmHg'
        },
        {
            icon: 'fitness-outline',
            label: 'Oxygen Level',
            value: heartData.oxygenLevel,
            unit: '%'
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Live Health Monitoring</Text>
                    <Text style={styles.headerSubtitle}>
                        Last Updated: {heartData.lastUpdated.toLocaleTimeString()}
                    </Text>
                </View>

                <View style={styles.riskContainer}>
                    <Text style={styles.riskTitle}>Current Risk Level</Text>
                    <View style={[
                        styles.riskLevelBadge,
                        { backgroundColor: riskColorMap[heartData.riskLevel] }
                    ]}>
                        <Text style={styles.riskLevelText}>{heartData.riskLevel} Risk</Text>
                    </View>
                </View>

                <View style={styles.vitalsContainer}>
                    {vitalIndicators.map((vital, index) => (
                        <View key={index} style={styles.vitalCard}>
                            <Ionicons
                                name={vital.icon}
                                size={30}
                                color="#1D3557"
                                style={styles.vitalIcon}
                            />
                            <View style={styles.vitalDetails}>
                                <Text style={styles.vitalLabel}>{vital.label}</Text>
                                <Text style={styles.vitalValue}>
                                    {vital.value} {vital.unit}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Vitals History</Text>
                <View style={styles.historyContainer}>
                    {vitalsHistory.map((record, index) => (
                        <View key={index} style={styles.historyCard}>
                            <Text style={styles.historyTime}>{record.time}</Text>
                            <Text style={styles.historyHeartRate}>
                                {record.heartRate} BPM
                            </Text>
                            <View style={[
                                styles.historyRiskBadge,
                                { backgroundColor: riskColorMap[record.riskLevel] }
                            ]}>
                                <Text style={styles.historyRiskText}>{record.riskLevel}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('BluetoothSetup')}
                >
                    <Ionicons
                        name="bluetooth-outline"
                        size={24}
                        color="white"
                        style={styles.actionButtonIcon}
                    />
                    <Text style={styles.actionButtonText}>Connect Device</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // (Add the styles from the previous code, similar to HomeScreen and ProfileScreen)
    // I've omitted the full styles for brevity, but they would follow a similar pattern
    container: {
        flex: 1,
        backgroundColor: '#F1FAEE',
    },
    // ... rest of the styles would be similar to previous screens
});