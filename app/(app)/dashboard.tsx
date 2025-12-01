import { Link } from 'expo-router';
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView, StatusBar,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from "react-native";
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../../context/AuthContext';

export default function DashboardPage() {
  const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/patients`;
  const { user, logout } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [patients, setPatients] = useState([]);
  
  // QR Modal State
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchPatients = async () => {
    try {
      const res = await fetch(API_URL, {
        method: 'GET',
        headers: {
          // 👇 Send user info so backend knows how to filter data
          'user-id': user?.id.toString(),
          'user-role': user?.role
        }
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setPatients(data);
    } catch (err) {
      console.error(err);
      // Fail silently or show alert depending on preference
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
        body: JSON.stringify({ 
            name, 
            phone, 
            symptoms,
            userId: user?.id 
        }),
      });
       if (!res.ok) throw new Error('Failed to add patient');
      setName("");
      setPhone("");
      setSymptoms("");
      fetchPatients(); 
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not add record.');
    }
  };

  const handlePatientPress = (patient) => {
    setSelectedPatient(patient);
    setModalVisible(true);
  };

  useEffect(() => {
    if (user) {
        fetchPatients();
    }
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
            <Text style={styles.headerTitle}>Healthline</Text>
            <Text style={styles.subHeader}>
                {user?.role === 'doctor' ? '👨‍⚕️ Doctor View' : '🤒 Patient View'}
            </Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={patients}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePatientPress(item)}>
            <View style={styles.itemContainer}>
                <View>
                    <Text style={styles.itemTextName}>{item.name}</Text>
                    <Text style={styles.itemTextSymptoms}>{item.symptoms}</Text>
                </View>
                <Text style={styles.qrHint}>QR 📱</Text>
            </View>
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <>
            {/* AI Button - Visible to Everyone */}
            <View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
                <Link href="/ai_chat" asChild>
                    <TouchableOpacity style={styles.aiButton}>
                        <Text style={styles.aiButtonText}>🤖 AI Symptom Checker</Text>
                    </TouchableOpacity>
                </Link>
            </View>

            {/* Add Patient Form */}
            {/* We allow both to add (Doctors add patients, Patients add self-reports) */}
            <Text style={styles.formTitle}>
                {user?.role === 'doctor' ? 'Add New Patient' : 'Report New Symptoms'}
            </Text>
            
            <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} placeholderTextColor="#777777" />
            <TextInput style={styles.input} placeholder="Phone (Optional)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholderTextColor="#777777" />
            <TextInput style={styles.input} placeholder="Symptoms" value={symptoms} onChangeText={setSymptoms} placeholderTextColor="#777777" />
            
            <TouchableOpacity style={styles.buttonContainer} onPress={addPatient}>
              <Text style={styles.buttonText}>
                {user?.role === 'doctor' ? 'Add Record' : 'Submit Report'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.listTitle}>
                {user?.role === 'doctor' ? 'All Registered Patients' : 'My Medical Records'}
            </Text>
          </>
        }
      />

      {/* QR Code Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalCenteredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Health Record QR</Text>
                {selectedPatient && (
                    <>
                        <View style={styles.qrContainer}>
                            <QRCode
                                value={JSON.stringify(selectedPatient)}
                                size={200}
                            />
                        </View>
                        <Text style={styles.patientName}>{selectedPatient.name}</Text>
                        <Text style={styles.patientDetails}>Symptoms: {selectedPatient.symptoms}</Text>
                        <Text style={styles.patientDetails}>Phone: {selectedPatient.phone}</Text>
                    </>
                )}
                <TouchableOpacity
                    style={[styles.buttonContainer, styles.closeButton]}
                    onPress={() => setModalVisible(false)}
                >
                    <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#333' },
  headerTitle: { color: '#EAEAEA', fontSize: 20, fontWeight: 'bold' },
  subHeader: { color: '#777', fontSize: 14 },
  logoutText: { color: '#e74c3c', fontSize: 16, fontWeight: 'bold' },
  
  formTitle: { color: '#EAEAEA', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 10, paddingHorizontal: 20 },
  input: { backgroundColor: '#2C2C2E', color: '#EAEAEA', padding: 15, borderRadius: 8, marginVertical: 8, fontSize: 16, borderWidth: 1, borderColor: '#3A3A3C', marginHorizontal: 20 },
  buttonContainer: { backgroundColor: '#3498db', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 10, marginBottom: 20, marginHorizontal: 20 },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  
  listTitle: { color: '#EAEAEA', fontSize: 20, fontWeight: 'bold', marginBottom: 10, marginTop: 10, paddingHorizontal: 20 },
  itemContainer: { backgroundColor: '#1E1E1E', padding: 15, borderRadius: 8, marginVertical: 5, marginHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTextName: { color: '#EAEAEA', fontSize: 18, fontWeight: 'bold' },
  itemTextSymptoms: { color: '#EAEAEA', fontSize: 14, marginTop: 4 },
  qrHint: { color: '#3498db', fontSize: 12, fontWeight: 'bold' },
  
  // AI Button
  aiButton: { backgroundColor: '#27ae60', padding: 15, borderRadius: 10, alignItems: 'center' },
  aiButtonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },

  // Modal Styles
  modalCenteredView: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.8)' },
  modalView: { width: '85%', backgroundColor: "#1E1E1E", borderRadius: 20, padding: 35, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#EAEAEA', marginBottom: 20 },
  qrContainer: { padding: 20, backgroundColor: 'white', borderRadius: 10, marginBottom: 20 },
  patientName: { fontSize: 22, fontWeight: 'bold', color: '#EAEAEA', marginBottom: 10 },
  patientDetails: { fontSize: 16, color: '#AAAAAA', marginBottom: 5 },
  closeButton: { marginTop: 20, width: '100%', backgroundColor: '#e74c3c', marginHorizontal: 0 }
});