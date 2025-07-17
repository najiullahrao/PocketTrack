// AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './screens/HomeScreen';
import AddExpenseScreen from './screens/AddExpenseScreen';
import ProfileScreen from './screens/ProfileScreen';
import BudgetsScreen from './screens/BudgetsScreen';

export type RootDrawerParamList = {
  Home: undefined;
  AddExpense: undefined;
  Profile: undefined;
  Budgets: undefined;
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="AddExpense" component={AddExpenseScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name="Budgets" component={BudgetsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
