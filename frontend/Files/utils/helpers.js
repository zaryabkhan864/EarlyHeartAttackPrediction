import { RISK_LEVELS } from './constants';

/**
 * Formats a timestamp into a readable date/time string
 * @param {Date} timestamp - Date object or timestamp
 * @returns {String} Formatted date string
 */
export const formatDateTime = (timestamp) => {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleString();
};

/**
 * Determines risk level based on calculated risk score
 * @param {Number} riskScore - Calculated risk score (0-100)
 * @returns {Object} Risk level object
 */
export const getRiskLevel = (riskScore) => {
    if (riskScore < RISK_LEVELS.LOW.threshold) {
        return RISK_LEVELS.LOW;
    } else if (riskScore < RISK_LEVELS.MODERATE.threshold) {
        return RISK_LEVELS.MODERATE;
    } else {
        return RISK_LEVELS.HIGH;
    }
};

/**
 * Calculates heart attack risk score based on user info and sensor data
 * Note: This is a simplified algorithm for demonstration purposes
 * In a real app, this would use clinically validated algorithms
 * 
 * @param {Object} userInfo - User demographic and health info
 * @param {Array} sensorReadings - Array of sensor data readings
 * @returns {Number} Risk score (0-100)
 */
export const calculateRiskScore = (userInfo, sensorReadings) => {
    let score = 0;

    // Age factor (higher age = higher risk)
    switch (userInfo.ageRange) {
        case 'under30': score += 5; break;
        case '30-39': score += 10; break;
        case '40-49': score += 15; break;
        case '50-59': score += 20; break;
        case '60-69': score += 25; break;
        case '70plus': score += 30; break;
        default: score += 15;
    }

    // Gender factor (statistically males have higher risk)
    if (userInfo.gender === 'male') {
        score += 5;
    }

    // Smoking factor
    if (userInfo.isSmoker) {
        score += 15;
    }

    // Family history factor
    if (userInfo.hasHeartAttackHistory) {
        score += 15;
    }

    // Hypertension factor
    if (userInfo.hasHypertension) {
        score += 10;
    }

    // Analyze sensor data (e.g., heart rate variability, etc.)
    if (sensorReadings && sensorReadings.length > 0) {
        let abnormalReadings = 0;

        // Example analysis of heart rate data
        sensorReadings.forEach(reading => {
            // Check for abnormal readings (simplified example)
            if (reading.heartRate > 100 || reading.heartRate < 50) {
                abnormalReadings++;
            }

            // Add other sensor data analysis here
        });

        // Adjust score based on abnormal readings percentage
        const abnormalPercentage = (abnormalReadings / sensorReadings.length) * 100;
        score += Math.min(25, abnormalPercentage * 0.5);
    }

    // Ensure score is between 0-100
    return Math.min(100, Math.max(0, score));
};

/**
 * Generates simulated sensor data for testing
 * @returns {Object} Mock sensor reading
 */
export const generateMockReading = () => {
    // Generate random values within normal ranges
    const heartRate = Math.floor(60 + Math.random() * 40); // 60-100 bpm
    const systolicBP = Math.floor(110 + Math.random() * 30); // 110-140 mmHg
    const diastolicBP = Math.floor(70 + Math.random() * 20); // 70-90 mmHg
    const oxygenSaturation = Math.floor(95 + Math.random() * 5); // 95-100%

    return {
        timestamp: new Date(),
        heartRate,
        bloodPressure: {
            systolic: systolicBP,
            diastolic: diastolicBP,
        },
        oxygenSaturation,
        // Add more sensor data as needed
    };
};

/**
 * Validates user information for completeness
 * @param {Object} userInfo - User information object
 * @returns {Object} Validation result with errors
 */
export const validateUserInfo = (userInfo) => {
    const errors = {};

    if (!userInfo.ageRange) {
        errors.ageRange = 'Please select your age range';
    }

    if (!userInfo.gender) {
        errors.gender = 'Please select your gender';
    }

    if (userInfo.isSmoker === undefined) {
        errors.isSmoker = 'Please specify if you smoke';
    }

    if (userInfo.hasHeartAttackHistory === undefined) {
        errors.hasHeartAttackHistory = 'Please specify if you have a family history of heart attacks';
    }

    if (userInfo.hasHypertension === undefined) {
        errors.hasHypertension = 'Please specify if you have hypertension';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Extracts and parses Bluetooth device data
 * @param {Object} data - Raw data from Bluetooth device
 * @returns {Object} Parsed sensor data
 */
export const parseDeviceData = (data) => {
    try {
        // This would be implementation-specific to your device's data format
        // For example, parsing a string of comma-separated values
        // or decoding a binary payload

        // Placeholder implementation - replace with actual parsing logic
        const parsed = {
            heartRate: 75, // Example value
            bloodPressure: {
                systolic: 120,
                diastolic: 80,
            },
            oxygenSaturation: 98,
            timestamp: new Date(),
        };

        return parsed;
    } catch (error) {
        console.error('Error parsing device data:', error);
        return null;
    }
};