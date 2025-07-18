import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, Platform } from 'react-native';
import { db } from '../firebase/config';
import { collection, onSnapshot, orderBy, query, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import useReload from '../utils/useReload';

interface Budget {
  id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'daily';
}

const CATEGORIES = [
  'food', 'transport', 'shopping', 'bills', 'entertainment', 'health', 'education', 'travel', 'other'
];
const PERIODS = ['monthly', 'weekly', 'daily'];

export default function BudgetsScreen() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'monthly' | 'weekly' | 'daily'>('monthly');
  const [saving, setSaving] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const { refreshing, reload } = useReload();

  useEffect(() => {
    const q = query(collection(db, 'budgets'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Budget[] = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Budget[];
      setBudgets(data);
    });
    return unsubscribe;
  }, []);

  const handleDelete = async (id: string) => {
    Alert.alert('Delete Budget', 'Are you sure you want to delete this budget?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await deleteDoc(doc(db, 'budgets', id));
          } catch (error) {
            Alert.alert('Error', 'Failed to delete budget');
          }
        }
      }
    ]);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setCategory(budget.category);
    setAmount(budget.amount.toString());
    setPeriod(budget.period);
    setModalVisible(true);
  };

  const handleSaveBudget = async () => {
    if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    setSaving(true);
    try {
      if (editingBudget) {
        // Update existing budget
        await updateDoc(doc(db, 'budgets', editingBudget.id), {
          category,
          amount: Number(amount),
          period,
        });
      } else {
        // Add new budget
        await addDoc(collection(db, 'budgets'), {
          category,
          amount: Number(amount),
          period,
          createdAt: new Date(),
        });
      }
      setModalVisible(false);
      setAmount('');
      setCategory(CATEGORIES[0]);
      setPeriod('monthly');
      setEditingBudget(null);
    } catch (error) {
      Alert.alert('Error', editingBudget ? 'Failed to update budget' : 'Failed to add budget');
    }
    setSaving(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Text
          style={[
            styles.title,
            {
              fontSize: 28,
              color: '#111827',
              fontWeight: '700',
              letterSpacing: 0.5,
              marginBottom: 4,
            },
          ]}
        >
          Budget Overview
        </Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add Budget</Text>
      </TouchableOpacity>
      <FlatList
        data={budgets}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={styles.budgetCard}>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.amount}>PKR {item.amount.toFixed(2)}</Text>
            <Text style={styles.period}>{item.period}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No budgets found.</Text>}
        refreshing={refreshing}
        onRefresh={reload}
      />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => { setModalVisible(false); setEditingBudget(null); }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{editingBudget ? 'Edit Budget' : 'Add Budget'}</Text>
            <Text style={styles.modalLabel}>Category</Text>
            <View style={styles.pickerRow}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.pickerOption, category === cat && styles.pickerOptionSelected]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={{ color: category === cat ? '#fff' : '#374151' }}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.modalLabel}>Amount</Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount"
            />
            <Text style={styles.modalLabel}>Period</Text>
            <View style={styles.pickerRow}>
              {PERIODS.map(p => (
                <TouchableOpacity
                  key={p}
                  style={[styles.pickerOption, period === p && styles.pickerOptionSelected]}
                  onPress={() => setPeriod(p as 'monthly' | 'weekly' | 'daily')}
                >
                  <Text style={{ color: period === p ? '#fff' : '#374151' }}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, saving && { opacity: 0.6 }]}
                onPress={handleSaveBudget}
                disabled={saving}
              >
                <Text style={styles.saveButtonText}>{saving ? (editingBudget ? 'Updating...' : 'Saving...') : (editingBudget ? 'Update' : 'Save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10B981',
    margin: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 8,
    paddingVertical: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  budgetCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  category: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  amount: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '700',
    marginBottom: 2,
  },
  period: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 12,
  },
  editButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 14,
  },
  empty: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 40,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
    marginBottom: 4,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#111827',
    marginBottom: 8,
  },
  pickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  pickerOption: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  pickerOptionSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 12,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
}); 