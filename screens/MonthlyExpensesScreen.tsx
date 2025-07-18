import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from '../firebase/config';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

interface Expense {
  id: string;
  amount: number;
  date: Date;
}

interface MonthSummary {
  year: number;
  month: number;
  total: number;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function MonthlyExpensesScreen() {
  const [summaries, setSummaries] = useState<MonthSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'expenses'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expenses: Expense[] = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        amount: docSnap.data().amount,
        date: docSnap.data().date?.toDate() || new Date(),
      }));
      // Group by year and month
      const map = new Map<string, number>();
      expenses.forEach(exp => {
        const d = new Date(exp.date);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        map.set(key, (map.get(key) || 0) + exp.amount);
      });
      const summaryArr: MonthSummary[] = Array.from(map.entries()).map(([key, total]) => {
        const [year, month] = key.split('-').map(Number);
        return { year, month, total };
      }).sort((a, b) => b.year !== a.year ? b.year - a.year : b.month - a.month);
      setSummaries(summaryArr);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Monthly Expenses</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#10B981" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={summaries}
          keyExtractor={item => `${item.year}-${item.month}`}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.month}>{MONTHS[item.month]} {item.year}</Text>
              <Text style={styles.amount}>PKR {item.total.toFixed(2)}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No expenses found.</Text>}
        />
      )}
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  month: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  amount: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '700',
  },
  empty: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 40,
    fontSize: 16,
  },
}); 