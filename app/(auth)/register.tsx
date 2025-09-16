import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { useRouter, Link } from 'expo-router';

export default function RegisterPage() {
  // 👈 IMPORTANT: Replace <YOUR-IP> with your computer's IP address
  const API_URL = "http://192.168.0.107:5000"; 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Account created successfully! Please log in.');
        router.push('/login');
      } else {
        Alert.alert('Registration Failed', data.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred. Please try again.');
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
        <TouchableOpacity style={styles.buttonContainer} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Create Account</Text>}
        </TouchableOpacity>
        <Link href="/login" asChild>
          <TouchableOpacity style={styles.linkContainer}>
            <Text style={styles.linkText}>Already have an account? Login</Text>
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