import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatbotScreen from './screens/ChatbotScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Chatbot" component={ChatbotScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
