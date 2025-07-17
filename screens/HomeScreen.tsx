import React, { useEffect, useState, useMemo } from 'react';
// import styles from './HomeStyles';  
import { db } from '../firebase/config';
import {
  SafeAreaView,
  StatusBar,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  View,
  Text,
  Platform,
  Image,
} from 'react-native';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  updateDoc,
  where,
  getDocs,
  setDoc,
  getDoc
} from 'firebase/firestore';
import ExpenseItem from '../components/ExpenseItem';
import QuickActions from '../components/QuickActions';
import CategorySelector from '../components/CategorySelector';
import StatsHeader from '../components/StatsHeader';
// import AnalyticsModal from '../components/AnalyticsModal';
import BudgetModal from '../components/BudgetModal';
import EditExpenseModal from '../components/EditExpenseModal';
import formatDate from '../utils/formatDate';
import FilterModal from '../components/FilterModal';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './HomeStyles';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
  createdAt?: any;
  updatedAt?: any;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget?: number;
}

interface Budget {
  id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'daily';
  createdAt: Date;
}

const EXPENSE_CATEGORIES: Category[] = [
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

export default function HomeScreen({ navigation }: { navigation: any }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  // Modal states
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [analyticsModalVisible, setAnalyticsModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  
  // Edit states
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('food');
  
  // Filter states
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Budget states
  const [budgetCategory, setBudgetCategory] = useState('food');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetPeriod, setBudgetPeriod] = useState<'monthly' | 'weekly' | 'daily'>('monthly');

  // Load expenses
  useEffect(() => {
    const q = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Expense[] = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
        date: docSnap.data().date?.toDate() || new Date(),
      })) as Expense[];
      setExpenses(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Load budgets
  useEffect(() => {
    const q = query(collection(db, 'budgets'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Budget[] = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
      })) as Budget[];
      setBudgets(data);
    });
    return unsubscribe;
  }, []);

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    let filtered = expenses;
    
    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(expense => expense.category === filterCategory);
    }
    
    // Period filter
    if (filterPeriod !== 'all') {
      const now = new Date();
      const startOfPeriod = new Date();
      
      switch (filterPeriod) {
        case 'today':
          startOfPeriod.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startOfPeriod.setDate(now.getDate() - 7);
          break;
        case 'month':
          startOfPeriod.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(expense => 
        new Date(expense.date) >= startOfPeriod
      );
    }
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [expenses, filterCategory, filterPeriod, searchQuery]);

  // Analytics calculations
  const analytics = useMemo(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    
    const monthlyExpenses = expenses.filter(expense => 
      new Date(expense.date) >= startOfMonth
    );
    
    const weeklyExpenses = expenses.filter(expense => 
      new Date(expense.date) >= startOfWeek
    );
    
    const categoryTotals = EXPENSE_CATEGORIES.map(category => {
      const categoryExpenses = monthlyExpenses.filter(expense => 
        expense.category === category.id
      );
      const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      const budget = budgets.find(b => b.category === category.id && b.period === 'monthly');
      
      return {
        ...category,
        total,
        budget: budget?.amount || 0,
        percentage: budget ? (total / budget.amount) * 100 : 0,
      };
    });
    
    return {
      totalExpenses: expenses.reduce((sum, expense) => sum + expense.amount, 0),
      monthlyTotal: monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0),
      weeklyTotal: weeklyExpenses.reduce((sum, expense) => sum + expense.amount, 0),
      dailyAverage: monthlyExpenses.length > 0 ? 
        monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0) / new Date().getDate() : 0,
      categoryTotals,
      topCategory: categoryTotals.reduce((max, category) => 
        category.total > max.total ? category : max, categoryTotals[0]
      ),
    };
  }, [expenses, budgets]);

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
      Alert.alert('Success', 'Expense added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add expense');
    }
    setAdding(false);
  };

  const handleAddBudget = async () => {
    if (!budgetAmount.trim()) {
      Alert.alert('Error', 'Please enter a budget amount');
      return;
    }
    
    const numAmount = parseFloat(budgetAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      // Check if budget already exists for this category and period
      const existingBudget = budgets.find(b => 
        b.category === budgetCategory && b.period === budgetPeriod
      );
      
      if (existingBudget) {
        await updateDoc(doc(db, 'budgets', existingBudget.id), {
          amount: numAmount,
          updatedAt: new Date(),
        });
      } else {
        await addDoc(collection(db, 'budgets'), {
          category: budgetCategory,
          amount: numAmount,
          period: budgetPeriod,
          createdAt: new Date(),
        });
      }
      
      setBudgetAmount('');
      setBudgetModalVisible(false);
      Alert.alert('Success', 'Budget saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save budget');
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setEditDescription(expense.description);
    setEditAmount(expense.amount.toString());
    setEditCategory(expense.category);
    setEditModalVisible(true);
  };

  const handleUpdateExpense = async () => {
    if (!editDescription.trim() || !editAmount.trim()) {
      Alert.alert('Error', 'Please fill in both description and amount');
      return;
    }
    
    const numAmount = parseFloat(editAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setUpdating(true);
    try {
      await updateDoc(doc(db, 'expenses', editingExpense!.id), {
        description: editDescription.trim(),
        amount: numAmount,
        category: editCategory,
        updatedAt: new Date(),
      });
      closeEditModal();
      Alert.alert('Success', 'Expense updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update expense');
    }
    setUpdating(false);
  };

  const handleDeleteExpense = async (id: string, description: string) => {
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to delete "${description}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await deleteDoc(doc(db, 'expenses', id));
              Alert.alert('Success', 'Expense deleted successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete expense');
            }
            setLoading(false);
          },
        },
      ]
    );
  };

  const getCategoryById = (id: string) => {
    return EXPENSE_CATEGORIES.find(cat => cat.id === id) || EXPENSE_CATEGORIES[0];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined 
    });
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setEditingExpense(null);
    setEditDescription('');
    setEditAmount('');
    setEditCategory('food');
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => {
    const category = getCategoryById(item.category);
    // Find the monthly budget for this category
    const budget = budgets.find(b => b.category === item.category && b.period === 'monthly');
    // Calculate total spent in this category this month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const spentThisMonth = expenses.filter(e => e.category === item.category && new Date(e.date) >= startOfMonth).reduce((sum, e) => sum + e.amount, 0);
    const overBudget = budget ? spentThisMonth > budget.amount : false;
    return (
      <ExpenseItem
        description={item.description}
        amount={item.amount}
        category={category}
        date={formatDate(item.date)}
        onEdit={() => handleEditExpense(item)}
        onDelete={() => handleDeleteExpense(item.id, item.description)}
        overBudget={overBudget}
      />
    );
  };

  const renderCategorySelector = (selectedValue: string, onSelect: (value: string) => void) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categorySelectorContainer}>
      {EXPENSE_CATEGORIES.map(category => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categorySelector,
            { 
              backgroundColor: selectedValue === category.id ? category.color : '#F9FAFB',
              borderColor: selectedValue === category.id ? category.color : '#E5E7EB'
            }
          ]}
          onPress={() => onSelect(category.id)}
        >
          <Text style={styles.categorySelectorIcon}>{category.icon}</Text>
          <Text style={[
            styles.categorySelectorText,
            { color: selectedValue === category.id ? '#FFFFFF' : '#374151' }
          ]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderAnalytics = () => (
    <ScrollView style={styles.analyticsContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.analyticsTitle}>📊 Spending Analytics</Text>
      
      {/* Overview Cards */}
      <View style={styles.overviewCards}>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewCardTitle}>This Month</Text>
          <Text style={styles.overviewCardAmount}>Rs{analytics.monthlyTotal.toFixed(2)}</Text>
        </View>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewCardTitle}>This Week</Text>
          <Text style={styles.overviewCardAmount}>Rs{analytics.weeklyTotal.toFixed(2)}</Text>
        </View>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewCardTitle}>Daily Avg</Text>
          <Text style={styles.overviewCardAmount}>Rs{analytics.dailyAverage.toFixed(2)}</Text>
        </View>
      </View>

      {/* Category Breakdown */}
      <Text style={styles.sectionTitle}>Category Breakdown</Text>
      {analytics.categoryTotals.map(category => (
        <View key={category.id} style={styles.categoryBreakdown}>
          <View style={styles.categoryBreakdownHeader}>
            <View style={styles.categoryBreakdownLeft}>
              <Text style={styles.categoryBreakdownIcon}>{category.icon}</Text>
              <Text style={styles.categoryBreakdownName}>{category.name}</Text>
            </View>
            <Text style={styles.categoryBreakdownAmount}>Rs{category.total.toFixed(2)}</Text>
          </View>
          {category.budget > 0 && (
            <View style={styles.budgetProgress}>
              <View style={styles.budgetProgressBg}>
                <View 
                  style={[
                    styles.budgetProgressFill,
                    { 
                      width: `${Math.min(category.percentage, 100)}%`,
                      backgroundColor: category.percentage > 100 ? '#EF4444' : category.color
                    }
                  ]}
                />
              </View>
              <Text style={[
                styles.budgetProgressText,
                { color: category.percentage > 100 ? '#EF4444' : '#6B7280' }
              ]}>
                {category.percentage.toFixed(0)}% of Rs{category.budget.toFixed(0)} budget
              </Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#10B981" />
        
        <FlatList
          ListHeaderComponent={
            <>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginLeft: 20, marginTop: 20 }}>
  <Image source={require('../assets/logo.png')} style={{ width: 36, height: 36, marginRight: 10 }} resizeMode="contain" />
  <Text style={{ fontSize: 28, fontWeight: '700', color: '#10B981', letterSpacing: -0.5 }}>PocketTrack</Text>
</View>

            <StatsHeader
  total={analytics.totalExpenses}
  monthly={analytics.monthlyTotal}
  weekly={analytics.weeklyTotal}
  daily={analytics.dailyAverage}
  transactions={expenses.length}
/>

            {/* <QuickActions
              onSetBudget={() => setBudgetModalVisible(true)}
              onFilter={() => setFilterModalVisible(true)}
              onAnalytics={() => setAnalyticsModalVisible(true)}
            /> */}

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search expenses..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity
                onPress={() => setFilterModalVisible(true)}
                style={{ marginLeft: 8, padding: 8 }}
                accessibilityLabel="Filter"
              >
                <Text style={{ fontSize: 20 }}>⚙️</Text>
              </TouchableOpacity>
            </View>

            {/* Recent Transactions Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderTitle}>Recent Transactions</Text>
              {/* <Text style={styles.sectionHeaderCount}>
                {filteredExpenses.length} {filteredExpenses.length === 1 ? 'transaction' : 'transactions'}
              </Text> */}
            </View>
          </>
        }
        data={loading ? [] : filteredExpenses}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={renderExpenseItem}
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#10B981" />
              <Text style={styles.loadingText}>Loading expenses...</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>💰</Text>
              <Text style={styles.emptyText}>No expenses found</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery ? 'Try adjusting your search' : 'Add your first expense above!'}
              </Text>
    </View>
          )
        }
      />

      {/* Edit Modal */}
      <EditExpenseModal
        visible={editModalVisible}
        onClose={closeEditModal}
        description={editDescription}
        amount={editAmount}
        category={editCategory}
        onDescriptionChange={setEditDescription}
        onAmountChange={setEditAmount}
        onCategoryChange={setEditCategory}
        onSave={handleUpdateExpense}
        loading={updating}
        categories={EXPENSE_CATEGORIES}
      />

      {/* Budget Modal */}
      <BudgetModal
        visible={budgetModalVisible}
        onClose={() => setBudgetModalVisible(false)}
        category={budgetCategory}
        amount={budgetAmount}
        period={budgetPeriod}
        onCategoryChange={setBudgetCategory}
        onAmountChange={setBudgetAmount}
        onPeriodChange={setBudgetPeriod}
        onSave={handleAddBudget}
        categories={EXPENSE_CATEGORIES}
        loading={false}
      />

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filterCategory={filterCategory}
        filterPeriod={filterPeriod}
        onCategoryChange={setFilterCategory}
        onPeriodChange={setFilterPeriod}
        categories={EXPENSE_CATEGORIES}
      />

      {/* Analytics Modal */}
      {/* <AnalyticsModal
        visible={analyticsModalVisible}
        onClose={() => setAnalyticsModalVisible(false)}
        renderAnalytics={renderAnalytics}
      /> */}
    </SafeAreaView>
    <View style={{ position: 'absolute', bottom: 48, right: 24, zIndex: 100 }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('AddExpense')}
        style={[
          {
            backgroundColor: '#10B981',
            width: 60,
            height: 60,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
          },
          Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
            },
            android: {
              elevation: 5,
            },
          })
        ]}
        activeOpacity={0.8}
      >
        <MaterialIcons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  </View>
  );
}
