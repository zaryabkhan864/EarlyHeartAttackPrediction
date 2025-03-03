import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { AppContext } from '../contexts/AppContext';
import { DeviceContext } from '../contexts/DeviceContext';
import { NotificationContext } from '../contexts/NotificationContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from '../components/ui/Card';
import LoadingIndicator from '../components/LoadingIndicator';
import RiskIndicator from '../components/RiskIndicator';
import DataCharts from '../components/DataCharts';
import Button from '../components/ui/Button';
import { formatTime, formatDate } from '../utils/dateUtils';
import { calculateRiskScore, determineRiskLevel } from '../services/riskCalculationService';

const DashboardComponent = ({ navigation }) => {
    const { theme } = useTheme();
    const { user, readings, riskScore, riskLevel, updateRiskAssessment } = useContext(AppContext);
    const { selectedDevice, isConnected } = useContext(DeviceContext);
    const { sendRiskLevelNotification } = useContext(NotificationContext);
    const [lastReading, setLastReading] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(false);

    useEffect(() => {
        // Update the latest reading when readings change
        if (readings && readings.length > 0) {
            setLastReading(readings[readings.length - 1]);
        }
    }, [readings]);

    useEffect(() => {
        // Calculate risk when user data or readings change
        if (user && readings && readings.length > 0) {
            const score = calculateRiskScore(user, readings);
            const level = determineRiskLevel(score);
            updateRiskAssessment(score, level);

            // If risk is medium or high, send notification
            if (level === 'medium' || level === 'high') {
                sendRiskLevelNotification(level);
            }
        }
    }, [user, readings, updateRiskAssessment, sendRiskLevelNotification]);

    const getStatusColor = () => {
        if (!riskLevel) return theme.disabledColor;

        switch (riskLevel) {
            case 'low':
                return theme.successColor;
            case 'medium':
                return theme.warningColor;
            case 'high':
                return theme.errorColor;
            default:
                return theme.disabledColor;
        }
    };

    const getStatusText = () => {
        if (!riskLevel) return 'Not enough data';

        switch (riskLevel) {
            case 'low':
                return 'Low Risk';
            case 'medium':
                return 'Moderate Risk';
            case 'high':
                return 'High Risk';
            default:
                return 'Unknown';
        }
    };

    const refreshData = async () => {
        setIsLoadingData(true);
        // Simulate refreshing data - in a real app, this would fetch from your service
        setTimeout(() => {
            setIsLoadingData(false);
        }, 1500);
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 16,
        },
        headerSection: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        greeting: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.textColor,
        },
        deviceStatus: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 8,
            borderRadius: 20,
            backgroundColor: isConnected ? `${theme.successColor}20` : `${theme.warningColor}20`,
        },
        deviceStatusText: {
            fontSize: 12,
            marginLeft: 5,
            color: isConnected ? theme.successColor : theme.warningColor,
        },
        statusCard: {
            marginBottom: 20,
        },
        statusHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 15,
        },
        statusTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.textColor,
        },
        refreshButton: {
            padding: 5,
        },
        statusContent: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        statusInfo: {
            flex: 1,
        },
        statusLabel: {
            fontSize: 14,
            color: theme.textSecondary,
            marginBottom: 5,
        },
        statusValue: {
            fontSize: 22,
            fontWeight: 'bold',
            color: getStatusColor(),
            marginBottom: 10,
        },
        riskScore: {
            fontSize: 16,
            color: theme.textColor,
        },
        lastUpdated: {
            fontSize: 12,
            color: theme.textSecondary,
            marginTop: 10,
        },
        riskIndicatorContainer: {
            width: 120,
            height: 120,
            justifyContent: 'center',
            alignItems: 'center',
        },
        chartsCard: {
            marginBottom: 20,
        },
        chartTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.textColor,
            marginBottom: 10,
        },
        actionsCard: {
            marginBottom: 20,
        },
        actionButtons: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
        },
        actionButton: {
            width: '48%',
            marginBottom: 10,
        },
        noDataContainer: {
            alignItems: 'center',
            padding: 30,
        },
        noDataText: {
            fontSize: 16,
            color: theme.textSecondary,
            textAlign: 'center',
            marginBottom: 20,
        },
    });

    if (!user) {
        return (
            <View style={[styles.container, styles.noDataContainer]}>
                <Icon name="account-alert-outline" size={80} color={theme.textSecondary} />
                <Text style={styles.noDataText}>
                    Please complete your profile to enable health monitoring and risk assessment
                </Text>
                <Button
                    title="Complete Profile"
                    onPress={() => navigation.navigate('UserForm')}
                />
            </View>
        );
    }

    if (!selectedDevice || !isConnected) {
        return (
            <View style={[styles.container, styles.noDataContainer]}>
                <Icon name="bluetooth-off" size={80} color={theme.textSecondary} />
                <Text style={styles.noDataText}>
                    Connect to a Bluetooth device to start monitoring your heart health
                </Text>
                <Button
                    title="Connect Device"
                    onPress={() => navigation.navigate('Bluetooth')}
                />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerSection}>
                <Text style={styles.greeting}>Hello, {user.name || 'User'}</Text>
                <View style={styles.deviceStatus}>
                    <Icon
                        name={isConnected ? "bluetooth-connect" : "bluetooth-off"}
                        size={16}
                        color={isConnected ? theme.successColor : theme.warningColor}
                    />
                    <Text style={styles.deviceStatusText}>
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </Text>
                </View>
            </View>

            <Card style={styles.statusCard}>
                <View style={styles.statusHeader}>
                    <Text style={styles.statusTitle}>Current Status</Text>
                    <TouchableOpacity style={styles.refreshButton} onPress={refreshData}>
                        <Icon
                            name="refresh"
                            size={20}
                            color={theme.primaryColor}
                        />
                    </TouchableOpacity>
                </View>

                {isLoadingData ? (
                    <LoadingIndicator />
                ) : (
                    <View style={styles.statusContent}>
                        <View style={styles.statusInfo}>
                            <Text style={styles.statusLabel}>Heart Attack Risk</Text>
                            <Text style={styles.statusValue}>{getStatusText()}</Text>
                            {riskScore && (
                                <Text style={styles.riskScore}>Score: {riskScore.toFixed(1)}/10</Text>
                            )}
                            {lastReading && (
                                <Text style={styles.lastUpdated}>
                                    Last updated: {formatTime(lastReading.timestamp)} | {formatDate(lastReading.timestamp)}
                                </Text>
                            )}
                        </View>
                        <View style={styles.riskIndicatorContainer}>
                            <RiskIndicator
                                riskLevel={riskLevel || 'unknown'}
                                size={100}
                            />
                        </View>
                    </View>
                )}
            </Card>

            {readings && readings.length > 0 ? (
                <Card style={styles.chartsCard}>
                    <Text style={styles.chartTitle}>Health Metrics Trends</Text>
                    <DataCharts readings={readings} theme={theme} />
                </Card>
            ) : (
                <Card style={styles.chartsCard}>
                    <View style={styles.noDataContainer}>
                        <Icon name="chart-line" size={50} color={theme.textSecondary} />
                        <Text style={styles.noDataText}>
                            Waiting for data from your device...
                        </Text>
                    </View>
                </Card>
            )}

            <Card style={styles.actionsCard}>
                <Text style={styles.chartTitle}>Quick Actions</Text>
                <View style={styles.actionButtons}>
                    <Button
                        title="View Details"
                        onPress={() => navigation.navigate('Results')}
                        style={styles.actionButton}
                    />
                    <Button
                        title="Update Profile"
                        onPress={() => navigation.navigate('UserForm')}
                        style={styles.actionButton}
                    />
                    <Button
                        title="Manage Device"
                        onPress={() => navigation.navigate('Bluetooth')}
                        style={styles.actionButton}
                    />
                    <Button
                        title="Health Tips"
                        onPress={() => navigation.navigate('About')}
                        style={styles.actionButton}
                    />
                </View>
            </Card>
        </ScrollView>
    );
};

export default DashboardComponent;