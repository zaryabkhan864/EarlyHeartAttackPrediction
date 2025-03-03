import React, { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeContext } from './ThemeContext';
import { lightTheme, darkTheme } from './constants';
import { getStoredTheme, storeTheme } from './storageService';

export const ThemeProvider = ({ children }) => {
    const deviceTheme = useColorScheme();
    const [theme, setTheme] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const storedTheme = await getStoredTheme();
                if (storedTheme === 'system') {
                    setTheme(deviceTheme === 'dark' ? darkTheme : lightTheme);
                } else if (storedTheme === 'dark') {
                    setTheme(darkTheme);
                } else {
                    setTheme(lightTheme);
                }
            } catch (error) {
                console.error('Failed to load theme:', error);
                setTheme(deviceTheme === 'dark' ? darkTheme : lightTheme);
            } finally {
                setIsLoading(false);
            }
        };

        loadTheme();
    }, [deviceTheme]);

    const toggleTheme = async () => {
        const newTheme = theme === lightTheme ? darkTheme : lightTheme;
        setTheme(newTheme);
        await storeTheme(newTheme === darkTheme ? 'dark' : 'light');
    };

    const setSystemTheme = async () => {
        const systemTheme = deviceTheme === 'dark' ? darkTheme : lightTheme;
        setTheme(systemTheme);
        await storeTheme('system');
    };

    if (isLoading) {
        return null; // Or a loading indicator
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setSystemTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;