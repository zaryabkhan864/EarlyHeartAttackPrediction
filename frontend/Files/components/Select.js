import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { useTheme } from './ThemeContext';
import Label from './Label';

const Select = ({
    label,
    value,
    options,
    onValueChange,
    placeholder = 'Select an option',
    required = false,
    error,
    disabled = false,
    style
}) => {
    const { theme } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);

    // Find selected option for display
    const selectedOption = options.find(option => option.value === value);

    const styles = StyleSheet.create({
        container: {
            marginBottom: 16,
        },
        selectContainer: {
            borderWidth: 1,
            borderColor: error ? theme.errorColor : theme.borderColor,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 14,
            backgroundColor: disabled ? theme.disabledBackground : theme.inputBackground,
        },
        selectText: {
            fontSize: 16,
            color: value ? theme.textColor : theme.placeholderColor,
        },
        modalOverlay: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContainer: {
            width: '90%',
            maxHeight: '80%',
            backgroundColor: theme.cardBackground,
            borderRadius: 10,
            overflow: 'hidden',
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.textColor,
        },
        closeButton: {
            fontSize: 22,
            color: theme.primaryColor,
        },
        item: {
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
        },
        selectedItem: {
            backgroundColor: `${theme.primaryColor}20`,
        },
        itemText: {
            fontSize: 16,
            color: theme.textColor,
        },
    });

    const openModal = () => {
        if (!disabled) {
            setModalVisible(true);
        }
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const handleSelect = (option) => {
        onValueChange(option.value);
        closeModal();
    };

    return (
        <View style={[styles.container, style]}>
            {label && <Label required={required} error={error}>{label}</Label>}

            <TouchableOpacity
                style={styles.selectContainer}
                onPress={openModal}
                disabled={disabled}
            >
                <Text style={styles.selectText}>
                    {selectedOption ? selectedOption.label : placeholder}
                </Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{label || "Select an option"}</Text>
                            <TouchableOpacity onPress={closeModal}>
                                <Text style={styles.closeButton}>×</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.item,
                                        item.value === value && styles.selectedItem
                                    ]}
                                    onPress={() => handleSelect(item)}
                                >
                                    <Text style={styles.itemText}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Select;