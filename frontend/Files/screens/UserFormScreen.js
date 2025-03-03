import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { HeaderComponent } from '../components/HeaderComponent';
import UserFormComponent from '../components/UserFormComponent';

const UserFormScreen = ({ navigation }) => {
    const handleFormComplete = (userData) => {
        // Navigate back to home screen or to the next appropriate screen
        navigation.navigate('Home');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <HeaderComponent
                title="Health Profile"
                showBackButton
                onBackPress={() => navigation.goBack()}
            />
            <View style={styles.container}>
                <UserFormComponent onComplete={handleFormComplete} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
        padding: 16,
    }
});

export default UserFormScreen;