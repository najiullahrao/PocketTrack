import React, { useState } from 'react';
import { View, Alert, SafeAreaView, StatusBar } from 'react-native';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import AddExpenseForm from '../components/AddExpenseForm';
import CategorySelector from '../components/CategorySelector';

const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: '🍽️', color: '#10B981' },
  { id: 'transport', name: 'Transportation', icon: '🚗', color: '#3B82F6' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#8B5CF6' },
  { id: 'bills', name: 'Bills & Utilities', icon: '⚡', color: '#F59E0B' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#EF4444' },
  { id: 'health', name: 'Health & Fitness', icon: '🏥', color: '#06B6D4' },
  { id: 'education', name: 'Education', icon: '📚', color: '#84CC16' },
  { id: 'travel', name: 'Travel', icon: '✈️', color: '#F97316' },
  { id: 'other', name: 'Other', icon: '📦', color: '#6B7280' },
];

export default function AddExpenseScreen({ navigation }: { navigation: any }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [adding, setAdding] = useState(false);

  const handleAddExpense = async () => {
    if (!description.trim() || !amount.trim()) {
      Alert.alert('Error', 'Please fill in both description and amount');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    setAdding(true);
    try {
      await addDoc(collection(db, 'expenses'), {
        description: description.trim(),
        amount: numAmount,
        category: selectedCategory,
        date: selectedDate,
        createdAt: new Date(),
      });
      setDescription('');
      setAmount('');
      setSelectedCategory('food');
      setSelectedDate(new Date());
      Alert.alert('Success', 'Expense added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add expense');
    }
    setAdding(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <StatusBar barStyle="light-content" backgroundColor="#10B981" />
      <AddExpenseForm
        description={description}
        amount={amount}
        selectedCategory={selectedCategory}
        onDescriptionChange={setDescription}
        onAmountChange={setAmount}
        onCategoryChange={setSelectedCategory}
        onAdd={handleAddExpense}
        adding={adding}
        renderCategorySelector={(selected, onSelect) => (
          <CategorySelector
            selectedValue={selected}
            onSelect={onSelect}
            categories={EXPENSE_CATEGORIES}
          />
        )}
      />
    </SafeAreaView>
  );
} 