import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function UserDataEntryScreen({ navigation }) {
    const [userData, setUserData] = useState({
        fullName: '',
        age: '',
        gender: '',
        smoker: '',
        familyHistory: '',
        hypertension: ''
    });

    const inputFields = [
        {
            label: 'Full Name',
            key: 'fullName',
            icon: 'person-outline',
            placeholder: 'Enter your full name'
        },
        {
            label: 'Age',
            key: 'age',
            icon: 'calendar-outline',
            placeholder: 'Enter your age',
            keyboardType: 'numeric'
        },
        {
            label: 'Gender',
            key: 'gender',
            icon: 'male-female-outline',
            placeholder: 'Select your gender'
        }
    ];

    const toggleOptions = [
        {
            label: 'Are you a smoker?',
            key: 'smoker',
            options: ['Yes', 'No']
        },
        {
            label: 'Family history of heart attacks?',
            key: 'familyHistory',
            options: ['Yes', 'No']
        },
        {
            label: 'Do you have hypertension?',
            key: 'hypertension',
            options: ['Yes', 'No']
        }
    ];

    const handleSave = () => {
        // Implement save logic
        console.log('Saved User Data:', userData);
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Personal Health Profile</Text>
                    <Text style={styles.headerSubtitle}>
                        Help us understand your health better
                    </Text>
                </View>

                {inputFields.map((field, index) => (
                    <View key={index} style={styles.inputContainer}>
                        <Ionicons
                            name={field.icon}
                            size={24}
                            color="#1D3557"
                            style={styles.inputIcon}
                        />
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>{field.label}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={field.placeholder}
                                value={userData[field.key]}
                                onChangeText={(text) => setUserData({ ...userData, [field.key]: text })}
                                keyboardType={field.keyboardType || 'default'}
                            />
                        </View>
                    </View>
                ))}

                {toggleOptions.map((option, index) => (
                    <View key={index} style={styles.toggleContainer}>
                        <Text style={styles.toggleLabel}>{option.label}</Text>
                        <View style={styles.toggleButtonGroup}>
                            {option.options.map((opt, optIndex) => (
                                <TouchableOpacity
                                    key={optIndex}
                                    style={[
                                        styles.toggleButton,
                                        userData[option.key] === opt && styles.activeToggleButton
                                    ]}
                                    onPress={() => setUserData({ ...userData, [option.key]: opt })}
                                >
                                    <Text style={[
                                        styles.toggleButtonText,
                                        userData[option.key] === opt && styles.activeToggleButtonText
                                    ]}>
                                        {opt}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                >
                    <Ionicons
                        name="save-outline"
                        size={24}
                        color="white"
                        style={styles.saveButtonIcon}
                    />
                    <Text style={styles.saveButtonText}>Save Profile</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // Similar styling approach to previous screens
    container: {
        flex: 1,
        backgroundColor: '#F1FAEE',
    },
    headerContainer: {
        backgroundColor: '#1D3557',
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#A8DADC',
    },
    // Add more styles similar to previous screens
});