import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import HeaderComponent from '../components/HeaderComponent';
import LoadingIndicator from '../components/LoadingIndicator';
import ResultsComponent from '../components/ResultsComponent';
import DataCharts from '../components/DataCharts';
import { riskCalculationService } from '../services/riskCalculationService';
import { storageService } from '../services/storageService';
import { COLORS, FONTS } from '../constants';
import { globalStyles } from '../styles/globalStyles';

const ResultsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [loading, setLoading] = useState(true);
    const [riskData, setRiskData] = useState(null);
    const [historicalData, setHistoricalData] = useState([]);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get user data passed from previous screen or from storage
                const userInfo = route.params?.userData || await storageService.getUserData();
                setUserData(userInfo);

                // Get latest sensor readings
                const sensorData = route.params?.sensorData || await storageService.getLatestSensorData();

                // Calculate risk based on user info and sensor data
                const risk = await riskCalculationService.calculateRisk(userInfo, sensorData);
                setRiskData(risk);

                // Get historical data for charts
                const history = await storageService.getHistoricalData();
                setHistoricalData(history);

                // Save this result to history
                await storageService.saveRiskResult(risk);
            } catch (error) {
                console.error("Error loading results data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleBackToHome = () => {
        navigation.navigate('Home');
    };

    if (loading) {
        return <LoadingIndicator message="Analyzing your data..." />;
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <HeaderComponent title="Your Results" showBackButton onBackPress={handleBackToHome} />
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.contentContainer}>
                    {riskData && (
                        <ResultsComponent
                            riskScore={riskData.riskScore}
                            riskLevel={riskData.riskLevel}
                            recommendations={riskData.recommendations}
                            userData={userData}
                        />
                    )}

                    {historicalData.length > 0 && (
                        <DataCharts historicalData={historicalData} />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        width: '100%',
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 40,
    },
});

export default ResultsScreen;