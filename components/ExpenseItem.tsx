import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

interface ExpenseItemProps {
  description: string;
  amount: number;
  category: any;
  date: string;
  onEdit: () => void;
  onDelete: () => void;
  overBudget?: boolean;
}

export default function ExpenseItem({ description, amount, category, date, onEdit, onDelete, overBudget }: ExpenseItemProps) {
  return (
    <View style={styles.expenseItem}>
      <View style={styles.expenseLeft}>
        <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
          <Text style={styles.categoryEmoji}>{category.icon}</Text>
        </View>
        <View style={styles.expenseInfo}>
          <Text style={styles.expenseDesc}>{description}</Text>
          <Text style={styles.expenseCategory}>{category.name}</Text>
          <Text style={styles.expenseDate}>{date}</Text>
        </View>
      </View>
      <View style={styles.expenseRight}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {overBudget && (
            <Text style={{ color: '#EF4444', fontSize: 18, marginRight: 4 }}>⚠️</Text>
          )}
          <Text style={[styles.expenseAmount, overBudget && { color: '#EF4444', fontWeight: 'bold' }]}>-Rs{amount.toFixed(2)}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Text style={styles.editButtonText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDesc: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  expenseCategory: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
    fontWeight: '500',
  },
  expenseDate: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '400',
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#EF4444',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#DBEAFE',
    borderRadius: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 14,
  },
}); 