import React, { useState, useEffect } from 'react';
import { AppContext } from './AppContext';
import { User } from './User';
import { getStoredUser, storeUser } from './storageService';

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [readings, setReadings] = useState([]);
    const [riskScore, setRiskScore] = useState(null);
    const [riskLevel, setRiskLevel] = useState(null);
    const [isFirstLaunch, setIsFirstLaunch] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    // Load user data on app start
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userData = await getStoredUser();
                if (userData) {
                    setUser(new User(userData));
                    setIsFirstLaunch(false);
                }
            } catch (error) {
                console.error('Failed to load user data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUserData();
    }, []);

    // Save user data whenever it changes
    useEffect(() => {
        const saveUserData = async () => {
            if (user) {
                try {
                    await storeUser(user);
                } catch (error) {
                    console.error('Failed to save user data:', error);
                }
            }
        };

        saveUserData();
    }, [user]);

    const updateUser = (userData) => {
        const updatedUser = new User({
            ...(user || {}),
            ...userData
        });
        setUser(updatedUser);
        setIsFirstLaunch(false);
    };

    const addReading = (reading) => {
        setReadings(currentReadings => [...currentReadings, reading]);
    };

    const clearReadings = () => {
        setReadings([]);
    };

    const updateRiskAssessment = (score, level) => {
        setRiskScore(score);
        setRiskLevel(level);
    };

    return (
        <AppContext.Provider
            value={{
                user,
                updateUser,
                readings,
                addReading,
                clearReadings,
                riskScore,
                riskLevel,
                updateRiskAssessment,
                isFirstLaunch,
                isLoading
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;