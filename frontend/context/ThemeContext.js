import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    const theme = {
        colors: {
            background: isDarkMode ? '#121212' : '#f8f9fa',
            card: isDarkMode ? '#1e1e1e' : '#ffffff',
            text: isDarkMode ? '#ffffff' : '#212529',
            border: isDarkMode ? '#333333' : '#e0e0e0',
            primary: '#e74c3c',
            secondary: '#3498db',
            success: '#2ecc71',
            warning: '#f39c12',
            danger: '#e74c3c',
        },
        isDarkMode,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};