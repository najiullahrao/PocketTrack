import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

interface StatsHeaderProps {
  total: number;
  monthly: number;
  weekly: number;
  daily: number;
  transactions: number;
}

export default function StatsHeader({ total, monthly, weekly, daily, transactions }: StatsHeaderProps) {
  return (
    <>
      {/* ✅ Main Total Balance Section */}
      <View style={styles.header}>
        <Text style={styles.totalLabel}>Total Balance</Text>
        <Text style={styles.totalAmount}>PKR {total.toFixed(2)}</Text>

        {/* ✅ Sub Sections */}
        <View style={styles.subTotalsContainer}>
  <View style={styles.subTotalCard}>
    <Text style={styles.subTotalLabel}>💰 Remaining Balance</Text>
    <Text style={[styles.subTotalAmount, { color: '#FFFFFF' }]}>
      PKR {(total - monthly).toFixed(2)}
    </Text>
  </View>
  <View style={styles.subTotalCard}>
    <Text style={styles.subTotalLabel}>📉 Total Expenses</Text>
    <Text style={[styles.subTotalAmount, { color: '#EF4444' }]}>
      PKR {total.toFixed(2)}
    </Text>
  </View>
</View>

      </View>

      {/* ✅ Quick Stats Cards */}
      <View style={styles.quickStats}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>PKR {weekly.toFixed(0)}</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>PKR {daily.toFixed(0)}</Text>
          <Text style={styles.statLabel}>Daily Avg</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{transactions}</Text>
          <Text style={styles.statLabel}>Transactions</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
    header: {
      backgroundColor: '#10B981',
      paddingHorizontal: 20,
      paddingTop: 25,
      paddingBottom: 45,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      alignItems: 'center',
    },
    totalLabel: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.85)',
      fontWeight: '500',
      marginBottom: 4,
    },
    totalAmount: {
      fontSize: 38,
      fontWeight: '800',
      color: '#FFFFFF',
      letterSpacing: -1,
      marginBottom: 20,
    },
  
    /** ✅ Updated Remaining Balance + Total Expenses */
    subTotalsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    subTotalCard: {
      flex: 1,
      marginHorizontal: 4,
      paddingVertical: 14,
      paddingHorizontal: 12,
      borderRadius: 14,
      backgroundColor: 'rgba(255,255,255,0.25)', // soft translucent effect
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.3)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
      alignItems: 'center',
    },
    subTotalLabel: {
      fontSize: 13,
      color: '#FFFFFF',
      fontWeight: '500',
      marginBottom: 6,
    },
    subTotalAmount: {
      fontSize: 18,
      fontWeight: '700',
      color: '#FFFFFF',
      letterSpacing: -0.5,
    },
  
    /** ✅ Quick Stats (unchanged) */
    quickStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginTop: -20,
      marginBottom: 20,
    },
    statCard: {
      backgroundColor: '#FFFFFF',
      flex: 1,
      marginHorizontal: 4,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    statValue: {
      fontSize: 18,
      fontWeight: '700',
      color: '#111827',
      marginBottom: 2,
    },
    statLabel: {
      fontSize: 12,
      color: '#6B7280',
      fontWeight: '500',
    },
  });
  
