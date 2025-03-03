import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors } from '../styles/globalStyles';

const screenWidth = Dimensions.get('window').width - 40; // Account for padding

const DataChart = ({
    data,
    title = 'Heart Rate Over Time',
    dataKey = 'heartRate',
    timeKey = 'timestamp',
    color = colors.primary,
    unit = 'bpm'
}) => {
    if (!data || data.length < 2) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.noDataText}>
                    Not enough data to display chart. Continue monitoring to collect more data.
                </Text>
            </View>
        );
    }

    // Format the data for the chart
    const chartData = {
        labels: data.map((item, index) => {
            // If it's a timestamp string, convert to Date
            const timestamp = typeof item[timeKey] === 'string'
                ? new Date(item[timeKey])
                : item[timeKey];

            // Format to hours:minutes
            const hours = timestamp.getHours().toString().padStart(2, '0');
            const minutes = timestamp.getMinutes().toString().padStart(2, '0');

            // Only show every other label if there are many points
            return index % Math.ceil(data.length / 6) === 0 ? `${hours}:${minutes}` : '';
        }),
        datasets: [
            {
                data: data.map(item => item[dataKey]),
                color: () => color,
                strokeWidth: 2,
            },
        ],
    };

    const chartConfig = {
        backgroundGradientFrom: colors.white,
        backgroundGradientTo: colors.white,
        decimalPlaces: 0,
        color: () => color,
        labelColor: () => colors.gray,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '4',
            strokeWidth: '1',
            stroke: color,
        },
    };

    // Calculate average
    const values = data.map(item => item[dataKey]);
    const average = values.reduce((sum, value) => sum + value, 0) / values.length;

    // Find min and max
    const min = Math.min(...values);
    const max = Math.max(...values);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            <LineChart
                data={chartData}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
            />

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Average</Text>
                    <Text style={styles.statValue}>{average.toFixed(1)} {unit}</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Min</Text>
                    <Text style={styles.statValue}>{min} {unit}</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Max</Text>
                    <Text style={styles.statValue}>{max} {unit}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 15,
        marginVertical: 10,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: colors.gray,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    noDataText: {
        textAlign: 'center',
        color: colors.gray,
        marginVertical: 40,
    },
});

export default DataChart;