import React from 'react';
import { Modal as RNModal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from './ThemeContext';
import Button from './Button';

const Modal = ({
    visible,
    onClose,
    title,
    children,
    footer,
    closeButtonText = 'Close',
    showCloseButton = true
}) => {
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        modalOverlay: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContainer: {
            width: '90%',
            maxWidth: 400,
            backgroundColor: theme.cardBackground,
            borderRadius: 10,
            padding: 20,
            shadowColor: theme.shadowColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
            paddingBottom: 10,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.textColor,
        },
        closeButton: {
            padding: 5,
        },
        closeButtonText: {
            fontSize: 22,
            color: theme.primaryColor,
            fontWeight: 'bold',
        },
        content: {
            marginBottom: 20,
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 10,
            gap: 10,
        },
    });

    return (
        <RNModal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    {title && (
                        <View style={styles.header}>
                            <Text style={styles.title}>{title}</Text>
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Text style={styles.closeButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={styles.content}>
                        {children}
                    </View>

                    {footer ? (
                        <View style={styles.footer}>
                            {footer}
                        </View>
                    ) : showCloseButton ? (
                        <View style={styles.footer}>
                            <Button title={closeButtonText} onPress={onClose} />
                        </View>
                    ) : null}
                </View>
            </View>
        </RNModal>
    );
};

export default Modal;