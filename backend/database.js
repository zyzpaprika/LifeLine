const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./telemed.db", (err) => {
  if (err) console.error("DB Error:", err);
  else console.log("✅ Connected to SQLite database");
});

db.serialize(() => {
  // Added 'user_id' to link a record to a specific account
  db.run(`CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER, 
    name TEXT,
    phone TEXT,
    symptoms TEXT
  )`);

  // Added 'role' to distinguish Doctors vs Patients
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'patient'
  )`);
});

module.exports = db;