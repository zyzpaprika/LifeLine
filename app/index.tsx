import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Link } from 'expo-router';

export default function HomePage() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* This view holds the title and subtitle */}
      <View style={styles.content}>
        <Text style={styles.title}>Healthline</Text>
        <Text style={styles.subtitle}>Your Health, Our Priority.</Text>
      </View>

      {/* This view holds the buttons at the bottom */}
      <View style={styles.buttonGroup}>
        {/* The "Login" button navigates to the /login route */}
        <Link href="/login" asChild>
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </Link>
        
        {/* The "Sign Up" link navigates to the /register route */}
        <Link href="/register" asChild>
          <TouchableOpacity style={styles.signupButton}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

// This is the stylesheet that creates the look and feel
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Black background
    justifyContent: 'space-between', // Pushes title up and buttons down
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
  },
  buttonGroup: {
    paddingHorizontal: 20,
    paddingBottom: 40, // Space from the bottom edge
  },
  loginButton: {
    backgroundColor: '#007AFF', // A standard blue color
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  signupButton: {
    // This is the text link, it has no background
    paddingVertical: 15,
    alignItems: 'center', // Center the text horizontally
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});