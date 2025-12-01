import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView, Platform,
  SafeAreaView, StatusBar,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';

export default function AIChatPage() {
  const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/chat`; 

  const router = useRouter();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: '1', role: 'ai', text: 'Hello! I am your Healthline AI assistant. Describe your symptoms, and I can help check them.' }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    // 1. Immediately show user message in UI
    const userMsg = { id: Date.now().toString(), role: 'user', text: message };
    setChatHistory(prev => [...prev, userMsg]);
    
    const messageToSend = message; // Copy text before clearing
    setMessage('');
    setLoading(true);

    try {
        // 2. Send to Backend
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: messageToSend }),
        });

        const data = await response.json();

        // 3. Show AI response in UI
        const aiMsg = { 
            id: (Date.now() + 1).toString(), 
            role: 'ai', 
            text: data.reply || "I'm not sure how to respond to that."
        };
        setChatHistory(prev => [...prev, aiMsg]);

    } catch (error) {
        console.error(error);
        const errorMsg = { 
            id: Date.now().toString(), 
            role: 'ai', 
            text: "⚠️ Network Error: Could not reach the server." 
        };
        setChatHistory(prev => [...prev, errorMsg]);
    } finally {
        setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Symptom Checker</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Chat List */}
      <FlatList
        data={chatHistory}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatList}
        renderItem={({ item }) => (
          <View style={[
            styles.messageBubble, 
            item.role === 'user' ? styles.userBubble : styles.aiBubble
          ]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />

      {/* Input Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        keyboardVerticalOffset={10}
      >
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder="Type your symptoms..."
                placeholderTextColor="#777"
                value={message}
                onChangeText={setMessage}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={loading}>
                <Text style={styles.sendText}>{loading ? '...' : 'Send'}</Text>
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#333' },
  headerTitle: { color: '#EAEAEA', fontSize: 18, fontWeight: 'bold' },
  backButton: { padding: 5 },
  backText: { color: '#3498db', fontSize: 16 },
  
  chatList: { padding: 20 },
  messageBubble: { maxWidth: '80%', padding: 15, borderRadius: 15, marginBottom: 10 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#3498db', borderBottomRightRadius: 2 },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#2C2C2E', borderBottomLeftRadius: 2 },
  messageText: { color: '#fff', fontSize: 16 },

  inputContainer: { flexDirection: 'row', padding: 15, borderTopWidth: 1, borderTopColor: '#333', backgroundColor: '#1E1E1E' },
  input: { flex: 1, backgroundColor: '#2C2C2E', color: '#fff', borderRadius: 25, paddingHorizontal: 20, paddingVertical: 10, marginRight: 10 },
  sendButton: { backgroundColor: '#3498db', borderRadius: 25, width: 50, height: 50, justifyContent: 'center', alignItems: 'center' },
  sendText: { color: '#fff', fontWeight: 'bold' }
});