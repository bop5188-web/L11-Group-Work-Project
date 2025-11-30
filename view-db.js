// ============================================================================
// DATABASE VIEWER SCRIPT - For Screenshots
// ============================================================================
// This script helps view database contents for assignment screenshots
// Run with: node view-db.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'conference.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
    console.log('✓ Connected to database\n');
});

// Show all tables
console.log('=== DATABASE TABLES ===');
db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
    if (err) {
        console.error(err.message);
    } else {
        rows.forEach(row => console.log(`- ${row.name}`));
    }
    console.log('\n');
});

// Show Attendees table schema
console.log('=== ATTENDEES TABLE SCHEMA ===');
db.all("PRAGMA table_info(attendees)", [], (err, rows) => {
    if (err) {
        console.error(err.message);
    } else {
        rows.forEach(row => {
            console.log(`${row.name}: ${row.type}${row.notnull ? ' NOT NULL' : ''}${row.pk ? ' PRIMARY KEY' : ''}`);
        });
    }
    console.log('\n');
});

// Show Sessions table schema
console.log('=== SESSIONS TABLE SCHEMA ===');
db.all("PRAGMA table_info(sessions)", [], (err, rows) => {
    if (err) {
        console.error(err.message);
    } else {
        rows.forEach(row => {
            console.log(`${row.name}: ${row.type}${row.notnull ? ' NOT NULL' : ''}${row.pk ? ' PRIMARY KEY' : ''}`);
        });
    }
    console.log('\n');
});

// Show all attendees
console.log('=== ATTENDEES DATA ===');
db.all("SELECT * FROM attendees", [], (err, rows) => {
    if (err) {
        console.error(err.message);
    } else {
        if (rows.length === 0) {
            console.log('No attendees found.');
        } else {
            rows.forEach(row => {
                console.log(`ID: ${row.id}, Name: ${row.name}, Email: ${row.email}, Phone: ${row.phone || 'N/A'}, Registered: ${row.registration_date}`);
            });
        }
    }
    console.log('\n');
});

// Show all sessions
console.log('=== SESSIONS DATA ===');
db.all("SELECT * FROM sessions", [], (err, rows) => {
    if (err) {
        console.error(err.message);
    } else {
        if (rows.length === 0) {
            console.log('No sessions found.');
        } else {
            rows.forEach(row => {
                console.log(`ID: ${row.id}, Title: ${row.title}, Speaker: ${row.speaker}, Time: ${row.time}, Location: ${row.location}, Capacity: ${row.capacity}`);
            });
        }
    }
    console.log('\n');
});

// Show all registrations
console.log('=== REGISTRATIONS DATA ===');
db.all(`
    SELECT r.*, a.name as attendee_name, s.title as session_title 
    FROM registrations r
    JOIN attendees a ON r.attendee_id = a.id
    JOIN sessions s ON r.session_id = s.id
    ORDER BY r.registration_date DESC
`, [], (err, rows) => {
    if (err) {
        console.error(err.message);
    } else {
        if (rows.length === 0) {
            console.log('No registrations found.');
        } else {
            rows.forEach(row => {
                console.log(`ID: ${row.id}, Attendee: ${row.attendee_name} (ID: ${row.attendee_id}), Session: ${row.session_title} (ID: ${row.session_id}), Registered: ${row.registration_date}`);
            });
        }
    }
    
    // Close database
    db.close((err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('\n✓ Database connection closed');
        }
    });
});

