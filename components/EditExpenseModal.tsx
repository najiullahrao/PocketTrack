import React from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions } from 'react-native';
import CategorySelector from './CategorySelector';

const { width, height } = Dimensions.get('window');

interface EditExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  description: string;
  amount: string;
  category: string;
  onDescriptionChange: (val: string) => void;
  onAmountChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
  onSave: () => void;
  loading: boolean;
  categories: { id: string; name: string; icon: string; color: string }[];
}

export default function EditExpenseModal({ visible, onClose, description, amount, category, onDescriptionChange, onAmountChange, onCategoryChange, onSave, loading, categories }: EditExpenseModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Expense</Text>
          <View style={styles.modalInputContainer}>
            <Text style={styles.modalInputLabel}>Description</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Description"
              value={description}
              onChangeText={onDescriptionChange}
              maxLength={50}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <View style={styles.modalInputContainer}>
            <Text style={styles.modalInputLabel}>Amount</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Amount (Rs)"
              value={amount}
              onChangeText={onAmountChange}
              keyboardType="decimal-pad"
              maxLength={10}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <Text style={styles.modalLabel}>Category</Text>
          <CategorySelector selectedValue={category} onSelect={onCategoryChange} categories={categories} />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.updateButton} onPress={onSave} disabled={loading}>
              <Text style={styles.updateButtonText}>{loading ? 'Updating...' : 'Update'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: width * 0.9,
    maxWidth: 400,
    maxHeight: height * 0.8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    marginTop: 16,
  },
  modalInputContainer: {
    marginBottom: 16,
  },
  modalInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#111827',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  updateButton: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
}); 