import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileBox}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.info}>Name: John Doe</Text>
        <Text style={styles.info}>Email: johndoe@example.com</Text>
        {/* Add more profile info here */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#10B981',
  },
  info: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
}); 