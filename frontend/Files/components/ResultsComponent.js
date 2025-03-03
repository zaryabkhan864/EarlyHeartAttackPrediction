import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RiskIndicator } from './RiskIndicator';
import { DataCharts } from './DataCharts';
import { globalStyles } from '../styles/globalStyles';

const ResultsComponent = ({
    riskScore,
    riskLevel,
    riskFactors,
    historicalData,
    onViewDetails,
    lastUpdated
}) => {
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'Unknown';

        const date = new Date(timestamp);
        return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
    };

    const getRiskLevelColor = (level) => {
        switch (level.toLowerCase()) {
            case 'high': return '#f44336';
            case 'moderate': return '#ff9800';
            case 'low': return '#4caf50';
            default: return '#2196f3';
        }
    };

    const getRiskLevelDescription = (level) => {
        switch (level.toLowerCase()) {
            case 'high':
                return 'Your risk level is high. Please consult with a healthcare professional as soon as possible.';
            case 'moderate':
                return 'Your risk level is moderate. Regular check-ups with your doctor are recommended.';
            case 'low':
                return 'Your risk level is low. Continue maintaining a healthy lifestyle.';
            default:
                return 'Insufficient data to determine risk level.';
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.title}>Heart Attack Risk Assessment</Text>
                <Text style={styles.subtitle}>
                    Last updated: {formatTimestamp(lastUpdated)}
                </Text>
            </View>

            <View style={styles.riskContainer}>
                <View style={styles.riskScoreContainer}>
                    <RiskIndicator
                        score={riskScore}
                        level={riskLevel}
                        size={120}
                    />
                </View>

                <View style={styles.riskDetails}>
                    <Text style={[
                        styles.riskLevelText,
                        { color: getRiskLevelColor(riskLevel) }
                    ]}>
                        {riskLevel} Risk
                    </Text>
                    <Text style={styles.riskDescription}>
                        {getRiskLevelDescription(riskLevel)}
                    </Text>
                </View>
            </View>

            {historicalData && historicalData.length > 0 && (
                <View style={styles.chartsContainer}>
                    <Text style={styles.sectionTitle}>Data Trends</Text>
                    <DataCharts data={historicalData} />
                </View>
            )}

            <View style={styles.factorsContainer}>
                <Text style={styles.sectionTitle}>Risk Factors Analysis</Text>

                {riskFactors && riskFactors.length > 0 ? (
                    riskFactors.map((factor, index) => (
                        <View key={index} style={styles.factorItem}>
                            <View style={[
                                styles.factorIndicator,
                                { backgroundColor: getRiskLevelColor(factor.impact) }
                            ]} />
                            <View style={styles.factorContent}>
                                <Text style={styles.factorTitle}>{factor.name}</Text>
                                <Text style={styles.factorDescription}>{factor.description}</Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noDataText}>
                        No risk factor data available. Please ensure your profile is complete and device is connected.
                    </Text>
                )}
            </View>

            <TouchableOpacity
                style={[globalStyles.button, globalStyles.primaryButton, styles.detailsButton]}
                onPress={onViewDetails}
            >
                <Text style={globalStyles.buttonText}>View Detailed Report</Text>
            </TouchableOpacity>

            <View style={styles.disclaimer}>
                <Text style={styles.disclaimerText}>
                    DISCLAIMER: This is not a medical diagnosis. Always consult with a healthcare professional for medical advice.
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2e7d32',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
    },
    riskContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    riskScoreContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    riskDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    riskLevelText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    riskDescription: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
    chartsContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2e7d32',
        marginBottom: 16,
    },
    factorsContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    factorItem: {
        flexDirection: 'row',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    factorIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginTop: 4,
        marginRight: 12,
    },
    factorContent: {
        flex: 1,
    },
    factorTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    factorDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    noDataText: {
        color: '#888',
        fontStyle: 'italic',
        textAlign: 'center',
        padding: 16,
    },
    detailsButton: {
        marginBottom: 16,
    },
    disclaimer: {
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        marginBottom: 24,
    },
    disclaimerText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default ResultsComponent;