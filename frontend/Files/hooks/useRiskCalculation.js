import { useState, useCallback } from 'react';
import { riskCalculationService } from '../services/riskCalculationService';
import { storageService } from '../services/storageService';

export const useRiskCalculation = () => {
    const [riskData, setRiskData] = useState(null);
    const [calculating, setCalculating] = useState(false);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState(null);

    // Load historical risk data
    const loadHistory = useCallback(async () => {
        try {
            const historicalData = await storageService.getHistoricalData();
            setHistory(historicalData);
            return historicalData;
        } catch (err) {
            console.error('Error loading risk history:', err);
            setError('Failed to load risk history');
            return [];
        }
    }, []);

    // Calculate risk based on user data and sensor readings
    const calculateRisk = useCallback(async (userData, sensorData) => {
        try {
            setCalculating(true);
            setError(null);

            // Calculate risk using the risk calculation service
            const result = await riskCalculationService.calculateRisk(userData, sensorData);

            // Set the risk data
            setRiskData(result);

            // Save to history
            await storageService.saveRiskResult(result);

            // Reload history
            await loadHistory();

            return result;
        } catch (err) {
            console.error('Error calculating risk:', err);
            setError('Failed to calculate risk');
            return null;
        } finally {
            setCalculating(false);
        }
    }, [loadHistory]);

    // Get risk trend (increasing, decreasing, or stable)
    const getRiskTrend = useCallback(() => {
        if (history.length < 2) {
            return 'not enough data';
        }

        // Sort history by timestamp (latest last)
        const sortedHistory = [...history].sort((a, b) =>
            new Date(a.timestamp) - new Date(b.timestamp)
        );

        // Get last two risk scores
        const latestScore = sortedHistory[sortedHistory.length - 1].riskScore;
        const previousScore = sortedHistory[sortedHistory.length - 2].riskScore;

        // Calculate difference as percentage
        const difference = ((latestScore - previousScore) / previousScore) * 100;

        if (difference > 5) {
            return 'increasing';
        } else if (difference < -5) {
            return 'decreasing';
        } else {
            return 'stable';
        }
    }, [history]);

    return {
        riskData,
        calculating,
        error,
        history,
        calculateRisk,
        loadHistory,
        getRiskTrend,
    };
};
