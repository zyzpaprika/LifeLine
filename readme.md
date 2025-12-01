# Healthline App 🏥

Healthline is a full-stack telemedicine application designed to bridge the gap in rural healthcare. It features role-based access for doctors and patients, an AI-powered symptom checker, digital health records via QR codes, and integrated video consultations.

Built with **React Native (Expo)** and **Node.js**.

## ✨ Features

- **🔐 Role-Based Authentication:**
  - Secure Login/Signup for **Doctors** and **Patients**.
  - Doctors can access all patient records; Patients can only access their own history.
- **🤖 AI Symptom Checker:**
  - Integrated with **Google Gemini 2.5 Flash**.
  - Smart chat interface for preliminary symptom triage.
- **📱 Digital Health Records:**
  - Generates instant **QR Codes** for patient data for easy sharing.
- **📹 Video Telemedicine:**
  - Integrated video calling using **VideoSDK** (Requires Development Build).
- **🛡️ Secure Backend:**
  - SQLite database with encrypted passwords (bcrypt).
  - REST API with role-based data filtering.

## 🛠️ Tech Stack

- **Frontend:** React Native, Expo Router, TypeScript
- **Backend:** Node.js, Express.js, SQLite
- **AI:** Google Gemini API (`@google/generative-ai`)
- **Video:** VideoSDK (`@videosdk.live/react-native-sdk`)

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### 1. Backend Setup

The backend manages the database, authentication, and AI connection.

1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    Create a file named `.env` in the `backend` folder and add your Gemini API Key:
    ```env
    GEMINI_API_KEY=Your_Google_Gemini_Key_Here
    ```
4.  Start the Server:
    ```bash
    node server.js
    ```
    *You should see: `🚀 Server running on http://localhost:5000`*

### 2. Frontend Setup

The frontend is the mobile application.

1.  Navigate to the project root (where `app` folder is):
    ```bash
    cd ..
    # or cd frontend/frontend depending on your structure
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Configure IP Address:**
    You must update the `API_URL` in the following files to match your computer's Local IP Address (find it using `ipconfig` or `ifconfig`):
    - `app/(auth)/login.tsx`
    - `app/(auth)/register.tsx`
    - `app/(app)/dashboard.tsx`
    - `app/(app)/ai_chat.tsx`

    *Example:*
    ```javascript
    const API_URL = "[http://192.168.1.5:5000](http://192.168.1.5:5000)"; // Use your actual IP, not localhost!
    ```

4.  Start the App:
    ```bash
    npx expo start -c
    ```
5.  Scan the QR code with the **Expo Go** app on your phone (Android/iOS).

---

## ⚠️ Important Troubleshooting

If you see **"Network Request Failed"** or **"Unreachable"** on your phone:

1.  **Check Wi-Fi:** Ensure your phone and computer are on the **exact same Wi-Fi network**.
2.  **Windows Firewall:**
    - You may need to create an **Inbound Rule** in Windows Firewall to allow traffic on Port `5000`.
    - Alternatively, ensure your Network Profile is set to **Private**, not Public.
3.  **Server Address:**
    - The server must listen on `0.0.0.0`, NOT `localhost`.
    - *Note: The provided `server.js` is already configured correctly for this.*

## 📹 Note on Video Calling

The Video Calling feature uses native WebRTC modules. It **will not work** in the standard Expo Go client.

To test video calling, you must create a **Development Build**:
```bash
npx expo run:android
# OR
eas build --profile development --platform android