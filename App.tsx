import React, { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { TamaguiProvider } from 'tamagui'
import config from './tamagui.config'
import Home from './src/Home';
import auth from '@react-native-firebase/auth';
import SignUpScreen from './src/auth/SignUp';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from './src/auth/SignIn';
import ChatScreen from './src/ChatScreen';
import messaging from '@react-native-firebase/messaging';
import { notificationListener, requestUserPermission, getToken } from './src/utils/CommonUtils';
import AfterSignUp from './src/AfterSignUp';

const Stack = createNativeStackNavigator();



function App(): React.JSX.Element {

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //   });

  //   return unsubscribe;
  // }, []);

  useEffect(() => {
    requestUserPermission()
    notificationListener()
    getToken()
  })

  if (initializing) return null;

  if (!user) {
    return (
      <TamaguiProvider config={config}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </TamaguiProvider>
    );
  }

  return (
    <TamaguiProvider config={config}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AfterSignUp" component={AfterSignUp} />
          <Stack.Screen name="Home">
            {(props) => <Home {...props} user={user} />}
          </Stack.Screen>
          <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </TamaguiProvider>
  );
}

const styles = StyleSheet.create({

});

export default App;
