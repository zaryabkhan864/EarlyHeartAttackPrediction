import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Switch, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { storageService } from '../services/storageService';
import { globalStyles } from '../styles/globalStyles';

const UserFormComponent = ({ onComplete }) => {
    const [formData, setFormData] = useState({
        age: '',
        gender: 'male', // male, female, other
        smoker: false,
        familyHistory: false,
        hypertension: false,
        weight: '',
        height: '',
        cholesterolLevel: '',
        diabetic: false,
        physicalActivity: 'low', // low, moderate, high
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Load user data from storage if available
        const loadUserData = async () => {
            try {
                const userData = await storageService.getUserProfile();
                if (userData) {
                    setFormData(userData);
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        };

        loadUserData();
    }, []);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.age || isNaN(formData.age) || parseInt(formData.age) <= 0 || parseInt(formData.age) > 120) {
            newErrors.age = 'Please enter a valid age (1-120)';
        }

        if (!formData.weight || isNaN(formData.weight) || parseFloat(formData.weight) <= 0) {
            newErrors.weight = 'Please enter a valid weight';
        }

        if (!formData.height || isNaN(formData.height) || parseFloat(formData.height) <= 0) {
            newErrors.height = 'Please enter a valid height';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                // Save to storage
                await storageService.saveUserProfile(formData);

                // Call the onComplete callback with the form data
                if (onComplete) {
                    onComplete(formData);
                }
            } catch (error) {
                console.error('Error saving user data:', error);
            }
        }
    };

    const updateFormData = (key, value) => {
        setFormData(prevData => ({
            ...prevData,
            [key]: value
        }));
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.formContainer}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Age</Text>
                        <TextInput
                            style={[styles.input, errors.age && styles.inputError]}
                            value={formData.age}
                            onChangeText={(text) => updateFormData('age', text)}
                            keyboardType="numeric"
                            placeholder="Enter your age"
                        />
                        {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Gender</Text>
                        <View style={styles.optionsContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    formData.gender === 'male' && styles.optionButtonSelected
                                ]}
                                onPress={() => updateFormData('gender', 'male')}
                            >
                                <Text style={[
                                    styles.optionButtonText,
                                    formData.gender === 'male' && styles.optionButtonTextSelected
                                ]}>Male</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    formData.gender === 'female' && styles.optionButtonSelected
                                ]}
                                onPress={() => updateFormData('gender', 'female')}
                            >
                                <Text style={[
                                    styles.optionButtonText,
                                    formData.gender === 'female' && styles.optionButtonTextSelected
                                ]}>Female</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    formData.gender === 'other' && styles.optionButtonSelected
                                ]}
                                onPress={() => updateFormData('gender', 'other')}
                            >
                                <Text style={[
                                    styles.optionButtonText,
                                    formData.gender === 'other' && styles.optionButtonTextSelected
                                ]}>Other</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Weight (kg)</Text>
                        <TextInput
                            style={[styles.input, errors.weight && styles.inputError]}
                            value={formData.weight}
                            onChangeText={(text) => updateFormData('weight', text)}
                            keyboardType="numeric"
                            placeholder="Enter your weight in kg"
                        />
                        {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Height (cm)</Text>
                        <TextInput
                            style={[styles.input, errors.height && styles.inputError]}
                            value={formData.height}
                            onChangeText={(text) => updateFormData('height', text)}
                            keyboardType="numeric"
                            placeholder="Enter your height in cm"
                        />
                        {errors.height && <Text style={styles.errorText}>{errors.height}</Text>}
                    </View>

                    <Text style={styles.sectionTitle}>Risk Factors</Text>

                    <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>Smoker</Text>
                        <Switch
                            value={formData.smoker}
                            onValueChange={(value) => updateFormData('smoker', value)}
                            trackColor={{ false: '#767577', true: '#4caf50' }}
                            thumbColor="#f4f3f4"
                        />
                    </View>

                    <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>Family History of Heart Attacks</Text>
                        <Switch
                            value={formData.familyHistory}
                            onValueChange={(value) => updateFormData('familyHistory', value)}
                            trackColor={{ false: '#767577', true: '#4caf50' }}
                            thumbColor="#f4f3f4"
                        />
                    </View>

                    <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>Hypertension</Text>
                        <Switch
                            value={formData.hypertension}
                            onValueChange={(value) => updateFormData('hypertension', value)}
                            trackColor={{ false: '#767577', true: '#4caf50' }}
                            thumbColor="#f4f3f4"
                        />
                    </View>

                    <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>Diabetic</Text>
                        <Switch
                            value={formData.diabetic}
                            onValueChange={(value) => updateFormData('diabetic', value)}
                            trackColor={{ false: '#767577', true: '#4caf50' }}
                            thumbColor="#f4f3f4"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Cholesterol Level (mg/dL)</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.cholesterolLevel}
                            onChangeText={(text) => updateFormData('cholesterolLevel', text)}
                            keyboardType="numeric"
                            placeholder="Enter if known (optional)"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Physical Activity Level</Text>
                        <View style={styles.optionsContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    formData.physicalActivity === 'low' && styles.optionButtonSelected
                                ]}
                                onPress={() => updateFormData('physicalActivity', 'low')}
                            >
                                <Text style={[
                                    styles.optionButtonText,
                                    formData.physicalActivity === 'low' && styles.optionButtonTextSelected
                                ]}>Low</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    formData.physicalActivity === 'moderate' && styles.optionButtonSelected
                                ]}
                                onPress={() => updateFormData('physicalActivity', 'moderate')}
                            >
                                <Text style={[
                                    styles.optionButtonText,
                                    formData.physicalActivity === 'moderate' && styles.optionButtonTextSelected
                                ]}>Moderate</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    formData.physicalActivity === 'high' && styles.optionButtonSelected
                                ]}
                                onPress={() => updateFormData('physicalActivity', 'high')}
                            >
                                <Text style={[
                                    styles.optionButtonText,
                                    formData.physicalActivity === 'high' && styles.optionButtonTextSelected
                                ]}>High</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[
                            globalStyles.button,
                            globalStyles.primaryButton,
                            styles.submitButton
                        ]}
                        onPress={handleSubmit}
                    >
                        <Text style={globalStyles.buttonText}>Save Profile</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    formContainer: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 12,
        color: '#2e7d32',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    inputError: {
        borderColor: '#f44336',
    },
    errorText: {
        color: '#f44336',
        fontSize: 14,
        marginTop: 4,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    optionButton: {
        flex: 1,
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
        backgroundColor: '#f5f5f5',
    },
    optionButtonSelected: {
        backgroundColor: '#4caf50',
        borderColor: '#2e7d32',
    },
    optionButtonText: {
        color: '#333',
    },
    optionButtonTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        padding: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    switchLabel: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    submitButton: {
        marginTop: 24,
        paddingVertical: 14,
    },
});

export default UserFormComponent;