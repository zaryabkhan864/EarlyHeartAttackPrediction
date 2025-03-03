/**
 * Utility functions for form validation
 */

// Check if value is empty
export const isEmpty = (value) => {
    return value === undefined || value === null || value === '';
};

// Validate email format
export const isValidEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

// Validate number within range
export const isNumberInRange = (value, min, max) => {
    const num = Number(value);
    if (isNaN(num)) return false;
    if (min !== undefined && num < min) return false;
    if (max !== undefined && num > max) return false;
    return true;
};

// Validate minimum length
export const minLength = (value, length) => {
    if (isEmpty(value)) return false;
    return String(value).length >= length;
};

// Validate maximum length
export const maxLength = (value, length) => {
    if (isEmpty(value)) return true;
    return String(value).length <= length;
};

// Validate password strength
export const isStrongPassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return re.test(password);
};

// Custom validation for user form
export const validateUserForm = (values) => {
    const errors = {};

    // Age validation
    if (isEmpty(values.age)) {
        errors.age = 'Age is required';
    } else if (!isNumberInRange(values.age, 18, 120)) {
        errors.age = 'Age must be between 18 and 120';
    }

    // Gender validation
    if (isEmpty(values.gender)) {
        errors.gender = 'Gender is required';
    }

    // Weight validation (optional)
    if (!isEmpty(values.weight) && !isNumberInRange(values.weight, 30, 500)) {
        errors.weight = 'Weight must be between 30 and 500 kg';
    }

    // Height validation (optional)
    if (!isEmpty(values.height) && !isNumberInRange(values.height, 100, 250)) {
        errors.height = 'Height must be between 100 and 250 cm';
    }

    // Optional blood pressure validation
    if (!isEmpty(values.bloodPressureSystolic) &&
        !isNumberInRange(values.bloodPressureSystolic, 70, 250)) {
        errors.bloodPressureSystolic = 'Systolic pressure must be between 70 and 250';
    }

    if (!isEmpty(values.bloodPressureDiastolic) &&
        !isNumberInRange(values.bloodPressureDiastolic, 40, 150)) {
        errors.bloodPressureDiastolic = 'Diastolic pressure must be between 40 and 150';
    }

    return errors;
};

// Validation for Bluetooth device connection
export const validateBluetoothForm = (values) => {
    const errors = {};

    if (isEmpty(values.deviceId)) {
        errors.deviceId = 'Please select a device';
    }

    return errors;
};

// Combine multiple validation functions
export const combineValidators = (...validators) => (values) => {
    return validators.reduce((errors, validator) => {
        return {
            ...errors,
            ...validator(values)
        };
    }, {});
};