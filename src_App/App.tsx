import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './untils/firebase';
import LoginScreen from './LoginScreen';
import MainContainer from './MainContainer';
import LevelsScreen from './screens/LevelsScreen';
import SignUpScreen from './SignUpScreen';

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();
const LoginStack = createNativeStackNavigator();

function InsideLayout(){
  return(
    <InsideStack.Navigator>
      <InsideStack.Screen name="Main" component={MainContainer} options={{headerShown: false}}/>
    </InsideStack.Navigator>
  )
}
function LoginLayout(){
  return(
    <LoginStack.Navigator>
      <LoginStack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
      <LoginStack.Screen name="SignUp" component={SignUpScreen} options={{headerShown: false}}/>
    </LoginStack.Navigator>
  )
}

export default function App() {
const [user, setUser] = useState<User | null>(null);

useEffect(() => {
  onAuthStateChanged(FIREBASE_AUTH, (user) => {
    console.log('user', user);
    setUser(user);
  });

}, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
      {user ? (
                    <Stack.Screen name="Inside" component={InsideLayout} options={{headerShown: false}}/>
                ) : (
                    <Stack.Screen name="Login" component={LoginLayout} options={{headerShown: false}}/> 
                )}
            </Stack.Navigator> 
    </NavigationContainer>
  );
}