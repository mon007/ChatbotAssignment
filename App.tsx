import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatbotScreen from './screens/ChatbotScreen';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator  
        screenOptions={{
          headerShown: false,
          tabBarIcon: () => null,
          tabBarActiveTintColor:'blue',
          tabBarInactiveTintColor:'grey',
          tabBarLabelStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
          },
          tabBarStyle: {
            paddingBottom: 10,
            height: 60,
          },
      }}
      >
        <Tab.Screen  name="Chatbot" component={ChatbotScreen}  options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ textAlign: 'center', color }}>{'Chatbot'}</Text>
          ),
        }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
