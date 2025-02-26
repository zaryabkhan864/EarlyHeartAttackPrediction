// frontend/components/UserForm.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function UserForm({ onSubmit }) {
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [smoker, setSmoker] = useState('');
    const [familyHistory, setFamilyHistory] = useState('');
    const [hypertension, setHypertension] = useState('');

    const handleSubmit = () => {
        const userData = {
            age,
            gender,
            smoker,
            familyHistory,
            hypertension,
        };
        onSubmit(userData); // Pass data to the parent component
    };

    return (
        <View style={styles.formContainer}>
            <Text>Age:</Text>
            <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
            />
            <Text>Gender:</Text>
            <TextInput style={styles.input} value={gender} onChangeText={setGender} />
            <Text>Smoker Status (Yes/No):</Text>
            <TextInput
                style={styles.input}
                value={smoker}
                onChangeText={setSmoker}
            />
            <Text>Family History of Heart Attack (Yes/No):</Text>
            <TextInput
                style={styles.input}
                value={familyHistory}
                onChangeText={setFamilyHistory}
            />
            <Text>Hypertension (Yes/No):</Text>
            <TextInput
                style={styles.input}
                value={hypertension}
                onChangeText={setHypertension}
            />
            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 10,
    },
});
