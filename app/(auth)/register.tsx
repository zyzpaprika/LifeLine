import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterPage() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient'); // 👈 Default to patient
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password) return Alert.alert('Error', 'Fill all fields');
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }), // 👈 Send role
      });
      // ... (Rest of logic is the same)
      if (response.ok) {
        Alert.alert('Success', 'Account created! Please log in.');
        router.push('/login');
      } else {
         Alert.alert('Error', 'Registration failed');
      }
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        
        {/* Role Selection Buttons */}
        <View style={styles.roleContainer}>
            <TouchableOpacity 
                style={[styles.roleButton, role === 'doctor' && styles.roleActive]} 
                onPress={() => setRole('doctor')}
            >
                <Text style={styles.roleText}>Doctor 👨‍⚕️</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.roleButton, role === 'patient' && styles.roleActive]} 
                onPress={() => setRole('patient')}
            >
                <Text style={styles.roleText}>Patient 🤒</Text>
            </TouchableOpacity>
        </View>

        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} placeholderTextColor="#777" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} placeholderTextColor="#777" secureTextEntry />
        
        <TouchableOpacity style={styles.buttonContainer} onPress={handleRegister}>
             {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.buttonText}>Register</Text>}
        </TouchableOpacity>
        
        <Link href="/login" asChild>
            <TouchableOpacity style={{marginTop: 15}}><Text style={{color:'#3498db'}}>Login instead</Text></TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center' },
  formContainer: { paddingHorizontal: 20 },
  input: { backgroundColor: '#2C2C2E', color: '#fff', padding: 15, borderRadius: 8, marginVertical: 8 },
  buttonContainer: { backgroundColor: '#3498db', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  
  // New Styles for Role Buttons
  roleContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  roleButton: { flex: 1, padding: 15, backgroundColor: '#2C2C2E', alignItems: 'center', borderRadius: 8, marginHorizontal: 5 },
  roleActive: { backgroundColor: '#27ae60', borderWidth: 1, borderColor: '#fff' },
  roleText: { color: '#fff', fontWeight: 'bold' }
});