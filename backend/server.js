const express = require("express");
const cors = require("cors");
const db = require("./database");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json()); // Modern Express JSON parser

// --- USER AUTHENTICATION ROUTES ---

// Register a new user
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
    db.run(sql, [email, hashedPassword], function (err) {
      if (err) {
        return res.status(409).json({ error: "Email already exists." });
      }
      res.status(201).json({ id: this.lastID, message: "User created successfully" });
    });
  } catch (err) {
    res.status(500).json({ error: "Server error during registration." });
  }
});

// Login a user
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  db.get(sql, [email], async (err, user) => {
    if (err) return res.status(500).json({ error: "Server error during login." });
    if (!user) return res.status(404).json({ error: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.json({ message: "Login successful", user: { id: user.id, email: user.email } });
    } else {
      res.status(401).json({ error: "Invalid credentials." });
    }
  });
});


// --- PATIENT ROUTES ---

// Add a patient
app.post("/patients", (req, res) => {
  const { name, phone, symptoms } = req.body;
  const sql = "INSERT INTO patients (name, phone, symptoms) VALUES (?, ?, ?)";
  
  db.run(sql, [name, phone, symptoms], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    
    res.status(201).json({
      id: this.lastID,
      name,
      phone,
      symptoms,
    });
  });
});

// Get all patients
app.get("/patients", (req, res) => {
  db.all("SELECT * FROM patients ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));