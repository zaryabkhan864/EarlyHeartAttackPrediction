import { calculateRiskScore, getRiskLevel } from '../utils/helpers';
import { saveResult } from './storageService';

/**
 * Analyze sensor readings and calculate heart attack risk
 * @param {Object} userInfo - User information and risk factors
 * @param {Array} readings - Array of sensor readings
 * @returns {Object} Risk assessment result
 */
export const analyzeRiskData = (userInfo, readings) => {
    // Must have user info and readings
    if (!userInfo || !readings || readings.length === 0) {
        throw new Error('Insufficient data for risk analysis');
    }

    // Calculate risk score
    const riskScore = calculateRiskScore(userInfo, readings);

    // Determine risk level
    const riskLevel = getRiskLevel(riskScore);

    // Generate result with personalized recommendations
    const result = {
        score: riskScore,
        level: riskLevel.id,
        label: riskLevel.label,
        color: riskLevel.color,
        description: riskLevel.description,
        timestamp: new Date().toISOString(),
        readings: {
            count: readings.length,
            timespan: getReadingsTimespan(readings),
        },
        userFactors: summarizeUserFactors(userInfo),
        recommendations: generateRecommendations(riskScore, userInfo),
    };

    // Save result for later
    saveResult(result);

    return result;
};

/**
 * Calculate the timespan of readings
 * @param {Array} readings - Array of sensor readings
 * @returns {Object} Timespan information
 */
const getReadingsTimespan = (readings) => {
    if (!readings || readings.length === 0) {
        return { start: null, end: null, durationMinutes: 0 };
    }

    // Convert string timestamps to Date objects if needed
    const timestamps = readings.map(r =>
        r.timestamp instanceof Date ? r.timestamp : new Date(r.timestamp)
    );

    // Sort timestamps
    timestamps.sort((a, b) => a - b);

    const start = timestamps[0];
    const end = timestamps[timestamps.length - 1];

    // Calculate duration in minutes
    const durationMinutes = Math.round((end - start) / (1000 * 60));

    return {
        start: start.toISOString(),
        end: end.toISOString(),
        durationMinutes,
    };
};

/**
 * Create summary of user risk factors
 * @param {Object} userInfo - User information
 * @returns {Array} Array of risk factor descriptions
 */
const summarizeUserFactors = (userInfo) => {
    const factors = [];

    // Age factor
    let ageDescription = 'Age: ';
    switch (userInfo.ageRange) {
        case 'under30': ageDescription += 'Under 30 (low risk)'; break;
        case '30-39': ageDescription += '30-39 (low-moderate risk)'; break;
        case '40-49': ageDescription += '40-49 (moderate risk)'; break;
        case '50-59': ageDescription += '50-59 (moderate-high risk)'; break;
        case '60-69': ageDescription += '60-69 (high risk)'; break;
        case '70plus': ageDescription += '70+ (high risk)'; break;
        default: ageDescription += 'Unknown';
    }
    factors.push(ageDescription);

    // Gender factor
    factors.push(`Gender: ${userInfo.gender || 'Not specified'}`);

    // Smoking factor
    if (userInfo.isSmoker) {
        factors.push('Smoking: Yes (significant risk factor)');
    }

    // Family history factor
    if (userInfo.hasHeartAttackHistory) {
        factors.push('Family history of heart attacks (significant risk factor)');
    }

    // Hypertension factor
    if (userInfo.hasHypertension) {
        factors.push('Hypertension: Yes (significant risk factor)');
    }

    return factors;
};

/**
 * Generate personalized recommendations based on risk level
 * @param {Number} riskScore - Calculated risk score
 * @param {Object} userInfo - User information
 * @returns {Array} Array of recommendations
 */
const generateRecommendations = (riskScore, userInfo) => {
    const recommendations = [];

    // Base recommendations for everyone
    recommendations.push('Regular cardio exercise for 30 minutes, 5 times per week');
    recommendations.push('Maintain a balanced diet low in saturated fats and sodium');

    // Add customized recommendations based on risk factors
    if (userInfo.isSmoker) {
        recommendations.push('Quit smoking to significantly reduce your heart attack risk');
    }

    if (userInfo.hasHypertension) {
        recommendations.push('Monitor blood pressure regularly and take prescribed medications');
        recommendations.push('Reduce sodium intake and manage stress');
    }

    // Recommendations based on risk score
    if (riskScore < 20) {
        // Low risk
        recommendations.push('Continue healthy lifestyle habits');
        recommendations.push('Annual check-up with your healthcare provider');
    } else if (riskScore < 50) {
        // Moderate risk
        recommendations.push('Schedule a follow-up with your doctor within 3 months');
        recommendations.push('Consider stress management techniques like meditation');
    } else {
        // High risk
        recommendations.push('Consult with a cardiologist as soon as possible');
        recommendations.push('Discuss medication options with your healthcare provider');
        recommendations.push('Create an emergency plan and know the signs of heart attack');
    }

    return recommendations;
};