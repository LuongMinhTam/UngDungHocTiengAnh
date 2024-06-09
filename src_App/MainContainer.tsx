import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/FontAwesome6';

import HomeScreen from './screens/HomeScreen';
import MyAccountScreen from './screens/MyAccountScreen';
import BSXScreen from './screens/BXHScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Levels from './screens/LevelsScreen';
import LevelsScreen from './screens/LevelsScreen';
import QuizzsScreen from './screens/QuizzsScreen';
import EditProfile from './screens/EditProfile';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function MainContainer() {
    return (
        
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: 'red',
            }}
        >
            <Tab.Screen
                name='home'
                component={HomeScreen}
                options={{
                    tabBarLabel: 'home',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name='home' size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name='BXH'
                component={BSXScreen}
                options={{
                    tabBarLabel: 'BXH',
                    tabBarIcon: ({ color, size }) => (
                        <Icon2 name='ranking-star' size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name='account'
                component={MyAccountScreen}
                options={{
                    tabBarLabel: 'account',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name='user' size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name='Levels'
                component={LevelsScreen}
                options={{
                    tabBarButton: () => null, // Ẩn nút trong Tab Bar
                }}
            />
            <Tab.Screen
                name='Quizzs'
                component={QuizzsScreen}
                options={{
                    tabBarButton: () => null, // Ẩn nút trong Tab Bar
                }}
            />
            <Tab.Screen
                name='editAccount'
                component={EditProfile}
                options={{
                    tabBarButton: () => null, // Ẩn nút trong Tab Bar
                }}
            />
        </Tab.Navigator>
    );
}
