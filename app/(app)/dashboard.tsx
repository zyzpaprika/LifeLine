import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, StatusBar, Alert } from "react-native";
import { useAuth } from '../../context/AuthContext';

export default function DashboardPage() {
  // 👈 IMPORTANT: Replace <YOUR-IP> with your computer's IP address
  const API_URL = "http://<YOUR-IP>:5000/patients"; 
  const { user, logout } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [patients, setPatients] = useState([]);

  const fetchPatients = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setPatients(data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not fetch patient data.');
    }
  };

  const addPatient = async () => {
     if (!name || !symptoms) {
      Alert.alert("Error", "Please enter a name and symptoms.");
      return;
    }
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, symptoms }),
      });
       if (!res.ok) throw new Error('Failed to add patient');
      setName("");
      setPhone("");
      setSymptoms("");
      fetchPatients();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not add patient.');
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome, {user?.email}</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={patients}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemTextName}>{item.name}</Text>
            <Text style={styles.itemTextSymptoms}>{item.symptoms}</Text>
          </View>
        )}
        ListHeaderComponent={
          <>
            <Text style={styles.formTitle}>Add New Patient</Text>
            <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} placeholderTextColor="#777777" />
            <TextInput style={styles.input} placeholder="Phone (Optional)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholderTextColor="#777777" />
            <TextInput style={styles.input} placeholder="Symptoms" value={symptoms} onChangeText={setSymptoms} placeholderTextColor="#777777" />
            <TouchableOpacity style={styles.buttonContainer} onPress={addPatient}>
              <Text style={styles.buttonText}>Add Patient</Text>
            </TouchableOpacity>
            <Text style={styles.listTitle}>Registered Patients</Text>
          </>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  headerTitle: { color: '#EAEAEA', fontSize: 20, fontWeight: 'bold' },
  logoutText: { color: '#3498db', fontSize: 16 },
  formTitle: { color: '#EAEAEA', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 10, paddingHorizontal: 20 },
  input: { backgroundColor: '#2C2C2E', color: '#EAEAEA', padding: 15, borderRadius: 8, marginVertical: 8, fontSize: 16, borderWidth: 1, borderColor: '#3A3A3C', marginHorizontal: 20 },
  buttonContainer: { backgroundColor: '#3498db', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 10, marginBottom: 20, marginHorizontal: 20 },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  listTitle: { color: '#EAEAEA', fontSize: 20, fontWeight: 'bold', marginBottom: 10, marginTop: 10, paddingHorizontal: 20 },
  itemContainer: { backgroundColor: '#1E1E1E', padding: 15, borderRadius: 8, marginVertical: 5, marginHorizontal: 20 },
  itemTextName: { color: '#EAEAEA', fontSize: 18, fontWeight: 'bold' },
  itemTextSymptoms: { color: '#EAEAEA', fontSize: 14, marginTop: 4 },
});