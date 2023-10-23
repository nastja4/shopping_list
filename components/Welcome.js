import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { getAuth, signInAnonymously, getReactNativePersistence } from "firebase/auth";
import { initializeAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app"; 
import PropTypes from 'prop-types'; // Import PropTypes

import { firebaseConfig } from "./firebaseConfig";  // Replace with your configuration

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);


const Welcome = ({ navigation }) => {
  const auth = getAuth();

  const signInUser = () => {
    signInAnonymously(auth)
      .then(result => {
        navigation.navigate("ShoppingLists", { userID: result.user.uid });
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, try later again.", error);
      })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>Shopping Lists</Text>
      <TouchableOpacity
        style={styles.startButton}
        onPress={signInUser}>
        <Text style={styles.startButtonText}>Get started</Text>
      </TouchableOpacity>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  appTitle: {
    fontWeight: "600",
    fontSize: 45,
    marginBottom: 100
  },
  startButton: {
    backgroundColor: "#000",
    height: 50,
    width: "88%",
    justifyContent: "center",
    alignItems: "center"
  },
  startButtonText: {
    color: "#FFF",
  },

});

// Add prop validation
Welcome.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Welcome;