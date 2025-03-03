import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/globalStyles';

const RiskIndicator = ({ score, level, label, color }) => {
    // Calculate indicator position
    const position = Math.min(Math.max(score, 0), 100);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Risk Level: {label}</Text>

            <View style={styles.meterContainer}>
                <View style={styles.meter}>
                    <View
                        style={[
                            styles.fill,
                            {
                                width: `${position}%`,
                                backgroundColor: color || (
                                    position < 20 ? colors.riskLow :
                                        position < 50 ? colors.riskModerate :
                                            colors.riskHigh
                                )
                            }
                        ]}
                    />
                </View>

                <View style={styles.markers}>
                    <Text style={styles.markerText}>Low</Text>
                    <Text style={styles.markerText}>Moderate</Text>
                    <Text style={styles.markerText}>High</Text>
                </View>
            </View>

            <Text style={styles.scoreText}>Risk Score: {score.toFixed(1)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: colors.white,
        borderRadius: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginVertical: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    meterContainer: {
        marginBottom: 10,
    },
    meter: {
        height: 20,
        backgroundColor: colors.lightGray,
        borderRadius: 10,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: 10,
    },
    markers: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    markerText: {
        fontSize: 12,
        color: colors.gray,
    },
    scoreText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
});

export default RiskIndicator;