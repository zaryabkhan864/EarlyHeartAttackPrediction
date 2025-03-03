import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { storageService } from '../services/storageService';
import { lightTheme, darkTheme } from '../styles/themes';

// Create context
export const ThemeContext = createContext();

// Custom hook to use the context
export const useThemeContext = () => useContext(ThemeContext);

// Provider component
export const ThemeProvider = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [theme, setTheme] = useState(lightTheme);
    const [isUsingSystemTheme, setIsUsingSystemTheme] = useState(true);

    // Initialize theme based on settings or system preference
    useEffect(() => {
        const initializeTheme = async () => {
            try {
                const settings = await storageService.getSettings();

                if (settings && settings.themePreference) {
                    if (settings.themePreference === 'system') {
                        // Use system preference
                        setIsUsingSystemTheme(true);
                        setIsDarkMode(systemColorScheme === 'dark');
                        setTheme(systemColorScheme === 'dark' ? darkTheme : lightTheme);
                    } else {
                        // Use user preference
                        setIsUsingSystemTheme(false);
                        const isDark = settings.themePreference === 'dark';
                        setIsDarkMode(isDark);
                        setTheme(isDark ? darkTheme : lightTheme);
                    }
                } else {
                    // Default to system preference if no setting exists
                    setIsUsingSystemTheme(true);
                    setIsDarkMode(systemColorScheme === 'dark');
                    setTheme(systemColorScheme === 'dark' ? darkTheme : lightTheme);
                }
            } catch (error) {
                console.error('Error initializing theme:', error);
                // Default to light theme if there's an error
                setTheme(lightTheme);
                setIsDarkMode(false);
            }
        };

        initializeTheme();
    }, []);

    // Update theme when system color scheme changes if using system theme
    useEffect(() => {
        if (isUsingSystemTheme) {
            setIsDarkMode(systemColorScheme === 'dark');
            setTheme(systemColorScheme === 'dark' ? darkTheme : lightTheme);
        }
    }, [systemColorScheme, isUsingSystemTheme]);

    // Toggle dark mode
    const toggleDarkMode = async () => {
        try {
            const newIsDarkMode = !isDarkMode;
            setIsDarkMode(newIsDarkMode);
            setTheme(newIsDarkMode ? darkTheme : lightTheme);

            // Save theme preference
            const settings = await storageService.getSettings() || {};
            settings.themePreference = newIsDarkMode ? 'dark' : 'light';
            settings.darkModeEnabled = newIsDarkMode;
            setIsUsingSystemTheme(false);
            await storageService.saveSettings(settings);
        } catch (error) {
            console.error('Error toggling dark mode:', error);
        }
    };

    // Use system theme setting
    const useSystemTheme = async () => {
        try {
            setIsUsingSystemTheme(true);
            const isDark = systemColorScheme === 'dark';
            setIsDarkMode(isDark);
            setTheme(isDark ? darkTheme : lightTheme);

            // Save theme preference
            const settings = await storageService.getSettings() || {};
            settings.themePreference = 'system';
            settings.darkModeEnabled = isDark;
            await storageService.saveSettings(settings);
        } catch (error) {
            console.error('Error setting system theme:', error);
        }
    };

    // Explicitly set light theme
    const setLightTheme = async () => {
        try {
            setIsDarkMode(false);
            setTheme(lightTheme);
            setIsUsingSystemTheme(false);

            // Save theme preference
            const settings = await storageService.getSettings() || {};
            settings.themePreference = 'light';
            settings.darkModeEnabled = false;
            await storageService.saveSettings(settings);
        } catch (error) {
            console.error('Error setting light theme:', error);
        }
    };

    // Explicitly set dark theme
    const setDarkTheme = async () => {
        try {
            setIsDarkMode(true);
            setTheme(darkTheme);
            setIsUsingSystemTheme(false);

            // Save theme preference
            const settings = await storageService.getSettings() || {};
            settings.themePreference = 'dark';
            settings.darkModeEnabled = true;
            await storageService.saveSettings(settings);
        } catch (error) {
            console.error('Error setting dark theme:', error);
        }
    };

    // Context value
    const contextValue = {
        isDarkMode,
        theme,
        isUsingSystemTheme,
        toggleDarkMode,
        useSystemTheme,
        setLightTheme,
        setDarkTheme
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};