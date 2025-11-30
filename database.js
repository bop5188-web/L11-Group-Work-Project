// ============================================================================
// DATABASE SETUP - Technical Objective: Database Integration
// ============================================================================
// This file handles SQLite database connection and schema creation
// Requirement: Database Integration - Connect Node.js app to database system
// Requirement: Schema Creation - Design and create database tables

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'conference.db');

// Create and connect to database
// Requirement: Database Integration - Connect Node.js app to database system
function connectDatabase() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error connecting to database:', err.message);
                reject(err);
            } else {
                console.log('✓ Connected to SQLite database');
                resolve(db);
            }
        });
    });
}

// ============================================================================
// SCHEMA CREATION - Technical Objective: Schema or Collection Creation
// ============================================================================
// Requirement: Schema Creation - Design and create database tables/collections
// Requirement: Thematic Data Modeling - Collections/tables reflect project theme
// Creating two main entities: Attendees and Sessions for Conference Event theme

function initializeDatabase(db) {
    return new Promise((resolve, reject) => {
        // Create Attendees table - First main entity
        // Requirement: At least two main entities in the database
        db.run(`
            CREATE TABLE IF NOT EXISTS attendees (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                phone TEXT,
                registration_date TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Error creating attendees table:', err.message);
                reject(err);
            } else {
                console.log('✓ Attendees table created/verified');
            }
        });

        // Create Sessions table - Second main entity
        // Requirement: At least two main entities in the database
        db.run(`
            CREATE TABLE IF NOT EXISTS sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                speaker TEXT NOT NULL,
                time TEXT NOT NULL,
                location TEXT NOT NULL,
                description TEXT,
                capacity INTEGER DEFAULT 50
            )
        `, (err) => {
            if (err) {
                console.error('Error creating sessions table:', err.message);
                reject(err);
            } else {
                console.log('✓ Sessions table created/verified');
            }
        });

        // Create Registrations table - Links attendees to sessions
        // This enables attendees to register for sessions
        db.run(`
            CREATE TABLE IF NOT EXISTS registrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                attendee_id INTEGER NOT NULL,
                session_id INTEGER NOT NULL,
                registration_date TEXT DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(attendee_id, session_id),
                FOREIGN KEY (attendee_id) REFERENCES attendees(id) ON DELETE CASCADE,
                FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
            )
        `, (err) => {
            if (err) {
                console.error('Error creating registrations table:', err.message);
                reject(err);
            } else {
                console.log('✓ Registrations table created/verified');
                resolve();
            }
        });
    });
}

// Insert sample data for demonstration
function insertSampleData(db) {
    return new Promise((resolve) => {
        // Sample attendees
        const attendees = [
            ['John Doe', 'john@example.com', '555-0101'],
            ['Jane Smith', 'jane@example.com', '555-0102'],
            ['Bob Johnson', 'bob@example.com', '555-0103']
        ];

        // Sample sessions
        const sessions = [
            ['Introduction to Web Development', 'Dr. Sarah Williams', '10:00 AM', 'Room A', 'Learn the basics of modern web development', 30],
            ['Database Design Best Practices', 'Prof. Michael Chen', '2:00 PM', 'Room B', 'Explore database design patterns and optimization', 25],
            ['Node.js Advanced Topics', 'Alex Rodriguez', '4:00 PM', 'Room C', 'Deep dive into Node.js performance and scalability', 40]
        ];

        // Insert sample attendees
        attendees.forEach((attendee) => {
            db.run('INSERT OR IGNORE INTO attendees (name, email, phone) VALUES (?, ?, ?)', attendee);
        });

        // Insert sample sessions
        sessions.forEach((session) => {
            db.run('INSERT OR IGNORE INTO sessions (title, speaker, time, location, description, capacity) VALUES (?, ?, ?, ?, ?, ?)', session);
        });

        console.log('✓ Sample data inserted');
        resolve();
    });
}

module.exports = {
    connectDatabase,
    initializeDatabase,
    insertSampleData
};

