import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CategorySelectorProps {
  selectedValue: string;
  onSelect: (value: string) => void;
  categories: Category[];
}

export default function CategorySelector({ selectedValue, onSelect, categories }: CategorySelectorProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categorySelectorContainer}>
      {categories.map(category => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categorySelector,
            {
              backgroundColor: selectedValue === category.id ? category.color : '#F9FAFB',
              borderColor: selectedValue === category.id ? category.color : '#E5E7EB',
            },
          ]}
          onPress={() => onSelect(category.id)}
        >
          <Text style={styles.categorySelectorIcon}>{category.icon}</Text>
          <Text
            style={[
              styles.categorySelectorText,
              { color: selectedValue === category.id ? '#FFFFFF' : '#374151' },
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  categorySelectorContainer: {
    marginBottom: 24,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 130,
    borderWidth: 1,
  },
  categorySelectorIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  categorySelectorText: {
    fontSize: 13,
    fontWeight: '600',
  },
}); 