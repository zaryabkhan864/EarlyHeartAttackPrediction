import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { useTheme } from './ThemeContext';

const SplashScreen = ({ onFinish }) => {
    const { theme } = useTheme();
    const fadeAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(0.8);

    useEffect(() => {
        const timeout = setTimeout(() => {
            onFinish();
        }, 2500);

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();

        return () => clearTimeout(timeout);
    }, [fadeAnim, scaleAnim, onFinish]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.backgroundColor,
        },
        logo: {
            width: 150,
            height: 150,
            marginBottom: 20,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.primaryColor,
            marginBottom: 10,
            textAlign: 'center',
        },
        subtitle: {
            fontSize: 16,
            color: theme.textColor,
            textAlign: 'center',
            paddingHorizontal: 30,
        },
        version: {
            position: 'absolute',
            bottom: 40,
            fontSize: 12,
            color: theme.textSecondary,
        },
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={{
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                }}
            >
                <Image
                    source={require('../assets/heart-icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>EarlyHeartAttackPredictor</Text>
                <Text style={styles.subtitle}>
                    Monitoring heart health and predicting risks in real-time
                </Text>
            </Animated.View>
            <Text style={styles.version}>Version 1.0.0</Text>
        </View>
    );
};

export default SplashScreen;