require('dotenv').config(); 
const express = require("express");
const cors = require("cors");
const db = require("./database");
const bcrypt = require("bcrypt");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Using the model that worked for you
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 

// --- 🕵️‍♂️ SPY MIDDLEWARE ---
app.use((req, res, next) => {
  console.log(`\n📡 Request Received: [${req.method}] ${req.url}`);
  next();
});

// --- 🤖 GEMINI AI CHAT ROUTE ---
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  console.log("🤖 Asking Gemini:", message);

  try {
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    console.log("✅ Gemini Replied:", text);
    res.json({ reply: text });

  } catch (error) {
    console.error("❌ Gemini Error:", error.message);
    res.status(500).json({ error: "AI is currently unavailable." });
  }
});

// --- 👤 USER AUTHENTICATION ROUTES ---

// Register
app.post("/register", async (req, res) => {
  const { email, password, role } = req.body; 
  if (!email || !password || !role) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (email, password, role) VALUES (?, ?, ?)";
    
    db.run(sql, [email, hashedPassword, role], function (err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
            return res.status(409).json({ error: "Email already exists." });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, message: "User created" });
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";
  
  db.get(sql, [email], async (err, user) => {
    if (err || !user) return res.status(404).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.json({ 
        message: "Success", 
        user: { id: user.id, email: user.email, role: user.role } 
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });
});

// --- 🏥 PATIENT DATA ROUTES ---

// Add Patient
app.post("/patients", (req, res) => {
  const { name, phone, symptoms, userId } = req.body; 
  const sql = "INSERT INTO patients (name, phone, symptoms, user_id) VALUES (?, ?, ?, ?)";
  db.run(sql, [name, phone, symptoms, userId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name, phone, symptoms });
  });
});

// Get Patients
app.get("/patients", (req, res) => {
  const userId = req.headers['user-id'];
  const userRole = req.headers['user-role'];

  let sql;
  let params = [];

  if (userRole === 'doctor') {
    sql = "SELECT * FROM patients ORDER BY id DESC";
  } else {
    sql = "SELECT * FROM patients WHERE user_id = ? ORDER BY id DESC";
    params = [userId];
  }

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --- 🚀 START SERVER ---
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on http://localhost:${PORT}`));