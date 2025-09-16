const sqlite3 = require("sqlite3").verbose();

// Connects to a local database file
const db = new sqlite3.Database("./telemed.db", (err) => {
  if (err) console.error("DB Error:", err);
  else console.log("✅ Connected to SQLite database");
});

// Create tables if they don't already exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT,
    symptoms TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )`);
});

module.exports = db;