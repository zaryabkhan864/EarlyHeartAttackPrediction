import { StyleSheet } from 'react-native';

export const colors = {
    primary: '#4285F4',
    secondary: '#34A853',
    warning: '#FBBC05',
    danger: '#EA4335',
    light: '#F5F7FA',
    dark: '#202124',
    gray: '#5F6368',
    lightGray: '#E8EAED',
    white: '#FFFFFF',
    black: '#000000',

    // Risk level colors
    riskLow: '#34A853',      // Green
    riskModerate: '#FBBC05', // Yellow
    riskHigh: '#EA4335',     // Red
};

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light,
        padding: 20,
    },
    safeArea: {
        flex: 1,
        backgroundColor: colors.light,
    },
    headerContainer: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.dark,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: colors.gray,
        marginBottom: 20,
    },
    text: {
        fontSize: 16,
        color: colors.dark,
        marginBottom: 10,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: colors.lightGray,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginVertical: 10,
        backgroundColor: colors.white,
        fontSize: 16,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.primary,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    secondaryButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 20,
        marginVertical: 10,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export const formStyles = StyleSheet.create({
    formContainer: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 20,
        marginVertical: 10,
    },
    formLabel: {
        fontSize: 16,
        color: colors.gray,
        marginBottom: 5,
    },
    formInput: {
        height: 50,
        borderWidth: 1,
        borderColor: colors.lightGray,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    radioGroup: {
        marginBottom: 15,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    radioButton: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    radioSelected: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: colors.primary,
    },
    radioLabel: {
        fontSize: 16,
        color: colors.dark,
    },
    errorText: {
        color: colors.danger,
        fontSize: 14,
        marginBottom: 10,
    },
});