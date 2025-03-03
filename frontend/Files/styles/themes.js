// Light and dark theme definitions

export const lightTheme = {
    colors: {
        primary: '#1E88E5',
        secondary: '#42A5F5',
        background: '#FFFFFF',
        card: '#F5F5F5',
        text: '#212121',
        subtext: '#757575',
        border: '#E0E0E0',
        notification: '#FF5252',
        success: '#4CAF50',
        warning: '#FFC107',
        error: '#F44336',
        info: '#2196F3',
        lightGray: '#EEEEEE',
        mediumGray: '#BDBDBD',
        darkGray: '#757575',
        black: '#000000',
        white: '#FFFFFF',

        // Heart-specific colors
        heartRed: '#E53935',
        heartStrongRed: '#C62828',
        heartLightRed: '#EF5350',

        // Risk level colors
        riskLow: '#66BB6A',
        riskModerate: '#FFA726',
        riskHigh: '#F44336',
        riskVeryHigh: '#D32F2F',

        // Chart colors
        chartLine: '#2196F3',
        chartGrid: '#E0E0E0',
        chartAxis: '#9E9E9E',
    },

    shadows: {
        small: {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
        },
        medium: {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,
            elevation: 4,
        },
        large: {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
        },
    },

    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
        xxl: 48,
    },

    borderRadius: {
        small: 4,
        medium: 8,
        large: 16,
        pill: 999,
    },

    typography: {
        fontFamily: {
            regular: 'System',
            medium: 'System',
            bold: 'System',
        },
        fontSize: {
            xs: 12,
            s: 14,
            m: 16,
            l: 18,
            xl: 20,
            xxl: 24,
            xxxl: 32,
        },
        lineHeight: {
            xs: 16,
            s: 20,
            m: 24,
            l: 28,
            xl: 32,
            xxl: 36,
            xxxl: 40,
        },
    },
};

export const darkTheme = {
    colors: {
        primary: '#90CAF9',
        secondary: '#64B5F6',
        background: '#121212',
        card: '#1E1E1E',
        text: '#FFFFFF',
        subtext: '#B0B0B0',
        border: '#424242',
        notification: '#FF5252',
        success: '#66BB6A',
        warning: '#FFCA28',
        error: '#EF5350',
        info: '#42A5F5',
        lightGray: '#424242',
        mediumGray: '#757575',
        darkGray: '#9E9E9E',
        black: '#000000',
        white: '#FFFFFF',

        // Heart-specific colors
        heartRed: '#EF5350',
        heartStrongRed: '#E53935',
        heartLightRed: '#EF9A9A',

        // Risk level colors
        riskLow: '#81C784',
        riskModerate: '#FFB74D',
        riskHigh: '#E57373',
        riskVeryHigh: '#EF5350',

        // Chart colors
        chartLine: '#64B5F6',
        chartGrid: '#424242',
        chartAxis: '#BDBDBD',
    },

    shadows: {
        small: {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.4,
            shadowRadius: 1.41,
            elevation: 2,
        },
        medium: {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 2.62,
            elevation: 4,
        },
        large: {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.6,
            shadowRadius: 4.65,
            elevation: 8,
        },
    },

    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
        xxl: 48,
    },

    borderRadius: {
        small: 4,
        medium: 8,
        large: 16,
        pill: 999,
    },

    typography: {
        fontFamily: {
            regular: 'System',
            medium: 'System',
            bold: 'System',
        },
        fontSize: {
            xs: 12,
            s: 14,
            m: 16,
            l: 18,
            xl: 20,
            xxl: 24,
            xxxl: 32,
        },
        lineHeight: {
            xs: 16,
            s: 20,
            m: 24,
            l: 28,
            xl: 32,
            xxl: 36,
            xxxl: 40,
        },
    },
};