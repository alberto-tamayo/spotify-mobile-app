import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { Provider } from 'react-redux';
import { store } from './store/store';

// screens
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import LibraryScreen from './screens/LibraryScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              if (route.name === 'Home') return <Icon name="home" size={size} color={color} />;
              if (route.name === 'Search') return <Icon name="search" size={size} color={color} />;
              if (route.name === 'Your Library') return <Icon name="book" size={size} color={color} />;
            },
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: '#b3b3b3',
            tabBarStyle: { backgroundColor: '#000', borderTopWidth: 0 },
            tabBarLabelStyle: { fontSize: 12, marginTop: -4 },
            headerShown: false,
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Search" component={SearchScreen} />
          <Tab.Screen name="Your Library" component={LibraryScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
