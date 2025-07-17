import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';

interface AddExpenseFormProps {
  description: string;
  amount: string;
  selectedCategory: string;
  onDescriptionChange: (text: string) => void;
  onAmountChange: (text: string) => void;
  onCategoryChange: (cat: string) => void;
  onAdd: () => void;
  adding: boolean;
  renderCategorySelector: (selected: string, onSelect: (cat: string) => void) => React.ReactNode;
}

export default function AddExpenseForm({
  description,
  amount,
  selectedCategory,
  onDescriptionChange,
  onAmountChange,
  onCategoryChange,
  onAdd,
  adding,
  renderCategorySelector
}: AddExpenseFormProps) {
  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Add New Expense</Text>
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="What did you spend on?"
            value={description}
            onChangeText={onDescriptionChange}
            maxLength={50}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            value={amount}
            onChangeText={onAmountChange}
            keyboardType="decimal-pad"
            maxLength={10}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>
      <Text style={styles.sectionLabel}>Category</Text>
      {renderCategorySelector(selectedCategory, onCategoryChange)}
      <TouchableOpacity
        style={[styles.addButton, adding && styles.disabledButton]}
        onPress={onAdd}
        disabled={adding}
      >
        <Text style={styles.addButtonText}>
          {adding ? '⏳ Adding...' : '+ Add Expense'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 24,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inputContainer: {
    flex: 0.48,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#111827',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.6,
  },
}); 