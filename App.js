import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather'; // Feather icons

// Import screens
import HomeScreen from './screens/belowNav/HomeScreen';
import SearchScreen from './screens/belowNav/SearchScreen';
import LibraryScreen from './screens/belowNav/LibraryScreen';

// Create Bottom Tab Navigator
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Home') {
              return <Icon name="home" size={size} color={color} />;
            } else if (route.name === 'Search') {
              return <Icon name="search" size={size} color={color} />;
            } else if (route.name === 'Your Library') {
              return <Icon name="book" size={size} color={color} />; // Original Feather "book" icon
            }
          },
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: '#b3b3b3',
          tabBarStyle: {
            backgroundColor: '#000', // Black background
            borderTopWidth: 0, // Clean design
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: -4,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Your Library" component={LibraryScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
