import React, { useEffect } from 'react';

import { initializeApp, getApp } from "firebase/app";
// import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
// import { setPersistence, inMemoryPersistence } from 'firebase/auth';
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

import { getFirestore, disableNetwork, enableNetwork  } from "firebase/firestore";
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useNetInfo }from '@react-native-community/netinfo';

// import the screens
import ShoppingLists from './components/ShoppingLists';
import Welcome from './components/Welcome';

import { LogBox, Alert } from 'react-native';
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);



// Create the navigator
const Stack = createNativeStackNavigator();


const App = () => {
  const connectionStatus = useNetInfo();

  // firebaseConfig
  const firebaseConfig = {
    apiKey: "AIzaSyBMndAPW_Qu8YQHXGjN3fK_-2ZoWIqAc6Q",
    authDomain: "shopping-list-demo-d538e.firebaseapp.com",
    projectId: "shopping-list-demo-d538e",
    storageBucket: "shopping-list-demo-d538e.appspot.com",
    messagingSenderId: "280446695152",
    appId: "1:280446695152:web:3d01d0ae1db98f6f77f435"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app); 


  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection lost");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);   


  return (
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Welcome'
      >
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen 
          name='ShoppingLists'
          // component={ShoppingLists}
        >
          {props => <ShoppingLists isConnected={connectionStatus.isConnected} db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });


export default App;