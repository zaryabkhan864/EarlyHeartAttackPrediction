import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from './ThemeContext';

class ErrorBoundaryClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        // You can log the error to an error reporting service here
        console.error('Error caught by Error Boundary:', error, errorInfo);
    }

    resetError = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        if (this.props.onReset) {
            this.props.onReset();
        }
    };

    render() {
        if (this.state.hasError) {
            const { theme } = this.props;

            const styles = StyleSheet.create({
                container: {
                    flex: 1,
                    padding: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: theme.backgroundColor,
                },
                errorCard: {
                    width: '100%',
                    padding: 20,
                    backgroundColor: theme.cardBackground,
                    borderRadius: 10,
                    alignItems: 'center',
                    shadowColor: theme.shadowColor,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                },
                title: {
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: theme.errorColor,
                    marginBottom: 10,
                },
                message: {
                    fontSize: 16,
                    color: theme.textColor,
                    marginBottom: 20,
                    textAlign: 'center',
                },
                button: {
                    backgroundColor: theme.primaryColor,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 5,
                },
                buttonText: {
                    color: 'white',
                    fontSize: 16,
                    fontWeight: 'bold',
                },
            });

            return (
                <View style={styles.container}>
                    <View style={styles.errorCard}>
                        <Text style={styles.title}>Oops! Something went wrong.</Text>
                        <Text style={styles.message}>
                            The app encountered an error. Please try again or restart the app if the problem persists.
                        </Text>
                        <TouchableOpacity style={styles.button} onPress={this.resetError}>
                            <Text style={styles.buttonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        return this.props.children;
    }
}

// Create a wrapper component to use the theme context
const ErrorBoundary = (props) => {
    const { theme } = useTheme();
    return <ErrorBoundaryClass {...props} theme={theme} />;
};

export default ErrorBoundary;