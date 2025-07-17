import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

interface QuickActionsProps {
  onSetBudget: () => void;
  onFilter: () => void;
  onAnalytics: () => void;
}

export default function QuickActions({ onSetBudget, onFilter, onAnalytics }: QuickActionsProps) {
  return (
    <View style={styles.quickActions}>
      <TouchableOpacity style={styles.quickAction} onPress={onSetBudget}>
        <View style={styles.quickActionIcon}>
          <Text style={styles.quickActionEmoji}>🎯</Text>
        </View>
        <Text style={styles.quickActionText}>Set Budget</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.quickAction} onPress={onFilter}>
        <View style={styles.quickActionIcon}>
          <Text style={styles.quickActionEmoji}>🔍</Text>
        </View>
        <Text style={styles.quickActionText}>Filter</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.quickAction} onPress={onAnalytics}>
        <View style={styles.quickActionIcon}>
          <Text style={styles.quickActionEmoji}>📈</Text>
        </View>
        <Text style={styles.quickActionText}>Analytics</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickAction: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    minWidth: 90,
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
  quickActionIcon: {
    marginBottom: 8,
  },
  quickActionEmoji: {
    fontSize: 24,
  },
  quickActionText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
}); 