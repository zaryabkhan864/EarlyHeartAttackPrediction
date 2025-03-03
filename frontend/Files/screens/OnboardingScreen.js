import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import Button from '../components/ui/Button';

const { width } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const { updateUser } = useContext(AppContext);
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    const onboardingData = [
        {
            id: '1',
            title: 'Welcome to EarlyHeartAttackPredictor',
            description: 'Your personal heart health monitoring assistant. Track and predict potential heart issues before they become emergencies.',
            image: require('../assets/onboarding-1.png'),
        },
        {
            id: '2',
            title: 'Connect Your Device',
            description: 'Pair with your Bluetooth heart monitoring device to start tracking vital signs automatically every 15 seconds.',
            image: require('../assets/onboarding-2.png'),
        },
        {
            id: '3',
            title: 'Personalized Risk Assessment',
            description: 'Enter your personal information and risk factors for more accurate predictions tailored to your health profile.',
            image: require('../assets/onboarding-3.png'),
        },
        {
            id: '4',
            title: 'Real-time Monitoring',
            description: 'Get instant alerts when your readings indicate potential risks, allowing you to take proactive measures.',
            image: require('../assets/onboarding-4.png'),
        },
    ];

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.backgroundColor,
        },
        slideContainer: {
            width,
            alignItems: 'center',
            padding: 20,
        },
        image: {
            width: 250,
            height: 250,
            marginVertical: 30,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.textColor,
            textAlign: 'center',
            marginBottom: 10,
        },
        description: {
            fontSize: 16,
            color: theme.textSecondary,
            textAlign: 'center',
            paddingHorizontal: 20,
            marginBottom: 30,
        },
        footer: {
            padding: 20,
        },
        paginationContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 20,
        },
        dot: {
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 5,
            backgroundColor: theme.borderColor,
        },
        activeDot: {
            backgroundColor: theme.primaryColor,
            width: 20,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        skipButton: {
            marginRight: 10,
        },
        skipText: {
            color: theme.textSecondary,
            fontSize: 16,
            paddingVertical: 10,
        },
    });

    const renderItem = ({ item }) => {
        return (
            <View style={styles.slideContainer}>
                <Image source={item.image} style={styles.image} resizeMode="contain" />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        );
    };

    const handleNext = () => {
        if (currentIndex < onboardingData.length - 1) {
            flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
        } else {
            // Finish onboarding
            finishOnboarding();
        }
    };

    const finishOnboarding = () => {
        // Mark onboarding as completed in user data
        updateUser({ onboardingCompleted: true });
        // Navigate to the appropriate screen
        navigation.replace('UserForm');
    };

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={onboardingData}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                onMomentumScrollEnd={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(index);
                }}
            />

            <View style={styles.footer}>
                <View style={styles.paginationContainer}>
                    {onboardingData.map((_, index) => {
                        const inputRange = [
                            (index - 1) * width,
                            index * width,
                            (index + 1) * width,
                        ];

                        const dotWidth = scrollX.interpolate({
                            inputRange,
                            outputRange: [10, 20, 10],
                            extrapolate: 'clamp',
                        });

                        const backgroundColor = scrollX.interpolate({
                            inputRange,
                            outputRange: [theme.borderColor, theme.primaryColor, theme.borderColor],
                            extrapolate: 'clamp',
                        });

                        return (
                            <Animated.View
                                key={index}
                                style={[styles.dot, { width: dotWidth, backgroundColor }]}
                            />
                        );
                    })}
                </View>

                <View style={styles.buttonContainer}>
                    {currentIndex < onboardingData.length - 1 ? (
                        <TouchableOpacity style={styles.skipButton} onPress={finishOnboarding}>
                            <Text style={styles.skipText}>Skip</Text>
                        </TouchableOpacity>
                    ) : (
                        <View />
                    )}

                    <Button
                        title={currentIndex < onboardingData.length - 1 ? "Next" : "Get Started"}
                        onPress={handleNext}
                    />
                </View>
            </View>
        </View>
    );
};

export default OnboardingScreen;