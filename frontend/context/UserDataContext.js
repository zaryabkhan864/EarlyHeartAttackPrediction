import React, { createContext, useState, useContext } from 'react';

const UserDataContext = createContext();

export const useUserData = () => useContext(UserDataContext);

export const UserDataProvider = ({ children }) => {
    const [userData, setUserData] = useState({
        age: '',
        gender: '',
        isSmoker: false,
        hasHeartAttackHistory: false,
        hasHypertension: false,
        isDataComplete: false
    });

    const [readings, setReadings] = useState([]);

    const updateUserData = (newData) => {
        setUserData(prevData => {
            const updatedData = { ...prevData, ...newData };

            // Check if all required fields are filled
            const isComplete =
                updatedData.age !== '' &&
                updatedData.gender !== '';

            return {
                ...updatedData,
                isDataComplete: isComplete
            };
        });
    };

    const addReading = (reading) => {
        setReadings(prevReadings => [reading, ...prevReadings].slice(0, 100)); // Keep last 100 readings
    };

    return (
        <UserDataContext.Provider value={{
            userData,
            updateUserData,
            readings,
            addReading
        }}>
            {children}
        </UserDataContext.Provider>
    );
};