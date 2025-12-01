import { Link } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const API_URL = "http://192.168.0.106:5000"; 
  
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.user);
      } else {
        Alert.alert('Login Failed', data.error || 'Invalid credentials.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred. Please make sure your server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.formContainer}>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} placeholderTextColor="#777777" keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} placeholderTextColor="#777777" secureTextEntry />
        <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>
        <Link href="/register" asChild>
          <TouchableOpacity style={styles.linkContainer}>
            <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center' },
  formContainer: { paddingHorizontal: 20 },
  input: { backgroundColor: '#2C2C2E', color: '#EAEAEA', padding: 15, borderRadius: 8, marginVertical: 8, fontSize: 16, borderWidth: 1, borderColor: '#3A3A3C' },
  buttonContainer: { backgroundColor: '#3498db', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  linkContainer: { marginTop: 15, alignItems: 'center' },
  linkText: { color: '#3498db', fontSize: 14 },
});