import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import CategorySelector from './CategorySelector';

const { width, height } = Dimensions.get('window');

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filterCategory: string;
  filterPeriod: string;
  onCategoryChange: (cat: string) => void;
  onPeriodChange: (period: string) => void;
  categories: { id: string; name: string; icon: string; color: string }[];
}

export default function FilterModal({ visible, onClose, filterCategory, filterPeriod, onCategoryChange, onPeriodChange, categories }: FilterModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Filter Expenses</Text>
          <Text style={styles.modalLabel}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptions}>
            <TouchableOpacity
              style={[
                styles.filterOption,
                { backgroundColor: filterCategory === 'all' ? '#10B981' : '#F9FAFB' },
              ]}
              onPress={() => onCategoryChange('all')}
            >
              <Text style={[
                styles.filterOptionText,
                { color: filterCategory === 'all' ? '#FFFFFF' : '#374151' },
              ]}>All</Text>
            </TouchableOpacity>
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.filterOption,
                  { backgroundColor: filterCategory === category.id ? category.color : '#F9FAFB' },
                ]}
                onPress={() => onCategoryChange(category.id)}
              >
                <Text style={styles.filterOptionIcon}>{category.icon}</Text>
                <Text style={[
                  styles.filterOptionText,
                  { color: filterCategory === category.id ? '#FFFFFF' : '#374151' },
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.modalLabel}>Time Period</Text>
          <View style={styles.periodSelector}>
            {[
              { key: 'all', label: 'All Time' },
              { key: 'today', label: 'Today' },
              { key: 'week', label: 'This Week' },
              { key: 'month', label: 'This Month' },
            ].map(period => (
              <TouchableOpacity
                key={period.key}
                style={[
                  styles.periodOption,
                  { backgroundColor: filterPeriod === period.key ? '#10B981' : '#F9FAFB' },
                ]}
                onPress={() => onPeriodChange(period.key)}
              >
                <Text style={[
                  styles.periodOptionText,
                  { color: filterPeriod === period.key ? '#FFFFFF' : '#374151' },
                ]}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => { onCategoryChange('all'); onPeriodChange('all'); onClose(); }}>
              <Text style={styles.cancelButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.updateButton} onPress={onClose}>
              <Text style={styles.updateButtonText}>Apply</Text>
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
  filterOptions: {
    marginBottom: 20,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 110,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterOptionIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  filterOptionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  periodSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  periodOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 90,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  periodOptionText: {
    fontSize: 14,
    fontWeight: '600',
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

