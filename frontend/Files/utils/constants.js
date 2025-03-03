// App info
export const APP_NAME = 'EarlyHeartAttackPredictor';
export const APP_VERSION = '1.0.0';

// Storage keys
export const STORAGE_KEYS = {
    USER_INFO: 'user_info',
    SAVED_DEVICES: 'saved_devices',
    READINGS_HISTORY: 'readings_history',
    LAST_RESULT: 'last_result',
};

// Risk categories
export const RISK_LEVELS = {
    LOW: {
        id: 'low',
        label: 'Low Risk',
        description: 'Your risk of heart attack appears to be low based on current data.',
        color: '#34A853',
        threshold: 20,
    },
    MODERATE: {
        id: 'moderate',
        label: 'Moderate Risk',
        description: 'Your risk factors indicate a moderate risk of heart attack.',
        color: '#FBBC05',
        threshold: 50,
    },
    HIGH: {
        id: 'high',
        label: 'High Risk',
        description: 'Multiple factors indicate a high risk for heart attack. Please consult a doctor.',
        color: '#EA4335',
        threshold: 100,
    },
};

// Age ranges
export const AGE_RANGES = [
    { label: 'Under 30', value: 'under30' },
    { label: '30-39', value: '30-39' },
    { label: '40-49', value: '40-49' },
    { label: '50-59', value: '50-59' },
    { label: '60-69', value: '60-69' },
    { label: '70+', value: '70plus' },
];

// Gender options
export const GENDER_OPTIONS = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
    { label: 'Prefer not to say', value: 'not_specified' },
];

// Yes/No options
export const YES_NO_OPTIONS = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
];

// Bluetooth scanning durations
export const SCAN_TIMEOUT = 10000; // 10 seconds

// Health recommendations
export const HEALTH_RECOMMENDATIONS = {
    general: [
        'Maintain a balanced diet rich in fruits, vegetables, and whole grains',
        'Exercise regularly, aiming for at least 150 minutes of moderate activity weekly',
        'Avoid smoking and limit alcohol consumption',
        'Manage stress through mindfulness, meditation, or other relaxation techniques',
        'Get regular check-ups with your healthcare provider',
    ],
    highRisk: [
        'Consult with a cardiologist as soon as possible',
        'Monitor your blood pressure and heart rate daily',
        'Take prescribed medications regularly and as directed',
        'Be aware of heart attack warning signs (chest pain, shortness of breath, etc.)',
        'Have an emergency plan in place',
    ],
};

// Example Bluetooth device info for testing
export const TEST_DEVICE = {
    id: 'test-device-id',
    name: 'HeartSensor-01',
};

// Simulated data for testing (without actual Bluetooth device)
export const SIMULATE_DATA = true; // Set to false in production