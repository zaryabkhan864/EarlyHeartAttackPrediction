import { colors } from '../globalStyles';

/**
 * Utility functions for chart data preparation
 */

// Generate line chart data from readings
export const prepareLineChartData = (readings, valueKey = 'heartRate', dateFormat = 'time') => {
    if (!readings || readings.length === 0) {
        return { labels: [], datasets: [{ data: [] }] };
    }

    // Sort readings by timestamp
    const sortedReadings = [...readings].sort((a, b) =>
        new Date(a.timestamp) - new Date(b.timestamp)
    );

    const labels = sortedReadings.map(reading => {
        const date = new Date(reading.timestamp);
        if (dateFormat === 'time') {
            return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
        } else if (dateFormat === 'date') {
            return `${date.getMonth() + 1}/${date.getDate()}`;
        }
        return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    });

    const data = sortedReadings.map(reading => reading[valueKey] || 0);

    return {
        labels,
        datasets: [
            {
                data,
                color: () => colors.primary,
                strokeWidth: 2,
            }
        ]
    };
};

// Generate multi-line chart data
export const prepareMultiLineChartData = (readings, keys = ['heartRate', 'bloodPressureSystolic', 'bloodPressureDiastolic']) => {
    if (!readings || readings.length === 0) {
        return { labels: [], datasets: keys.map(key => ({ data: [] })) };
    }

    // Sort readings by timestamp
    const sortedReadings = [...readings].sort((a, b) =>
        new Date(a.timestamp) - new Date(b.timestamp)
    );

    const labels = sortedReadings.map(reading => {
        const date = new Date(reading.timestamp);
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    });

    const datasets = keys.map((key, index) => ({
        data: sortedReadings.map(reading => reading[key] || 0),
        color: () => colors.chartColors[index % colors.chartColors.length], // Cycle through predefined chart colors
        strokeWidth: 2,
    }));

    return { labels, datasets };
};

// Generate bar chart data
export const prepareBarChartData = (readings, valueKey = 'heartRate') => {
    if (!readings || readings.length === 0) {
        return { labels: [], datasets: [{ data: [] }] };
    }

    // Aggregate data by date
    const aggregatedData = readings.reduce((acc, reading) => {
        const date = new Date(reading.timestamp);
        const dateLabel = `${date.getMonth() + 1}/${date.getDate()}`;

        if (!acc[dateLabel]) {
            acc[dateLabel] = [];
        }
        acc[dateLabel].push(reading[valueKey] || 0);
        return acc;
    }, {});

    const labels = Object.keys(aggregatedData);
    const data = labels.map(label => {
        const values = aggregatedData[label];
        return values.reduce((sum, value) => sum + value, 0) / values.length; // Average value per day
    });

    return {
        labels,
        datasets: [
            {
                data,
                color: () => colors.primary,
            }
        ]
    };
};
