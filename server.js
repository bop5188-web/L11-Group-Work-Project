// ============================================================================
// NODE.JS SERVER - Technical Objective: Node.js RESTful Services
// ============================================================================
// Requirement: Node.js – RESTful services handling CRUD operations
// Requirement: Database Integration – Connect Node.js app to database system

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectDatabase, initializeDatabase, insertSampleData } = require('./database');

const app = express();
const PORT = 3000;

// Middleware setup
app.use(cors()); // Allow frontend to access API
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(express.static('public')); // Serve static files (frontend)

let db; // Database connection

// ============================================================================
// DATABASE CONNECTION - Technical Objective: Database Integration
// ============================================================================
// Requirement: Set up a working database connection from Node.js
// This establishes the connection when server starts

async function startServer() {
    try {
        // Connect to database
        db = await connectDatabase();
        
        // Initialize schema (create tables)
        await initializeDatabase(db);
        
        // Insert sample data
        await insertSampleData(db);
        
        // Start server
        app.listen(PORT, () => {
            console.log(`\n✓ Server running on http://localhost:${PORT}`);
            console.log('✓ Database connection established successfully\n');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// ============================================================================
// CRUD OPERATIONS FOR ATTENDEES - Technical Objective: CRUD Implementation
// ============================================================================
// Requirement: CRUD operations implemented for at least two core entities
// Requirement: Node.js REST endpoints should insert, query, and update persistent data

// CREATE - Add new attendee
// Requirement: CRUD Implementation - Create operation
app.post('/api/attendees', (req, res) => {
    const { name, email, phone } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }
    
    db.run(
        'INSERT INTO attendees (name, email, phone) VALUES (?, ?, ?)',
        [name, email, phone || null],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint')) {
                    return res.status(400).json({ error: 'Email already exists' });
                }
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ 
                id: this.lastID, 
                name, 
                email, 
                phone,
                message: 'Attendee created successfully' 
            });
        }
    );
});

// READ - Get all attendees
// Requirement: CRUD Implementation - Read operation
app.get('/api/attendees', (req, res) => {
    db.all('SELECT * FROM attendees ORDER BY id DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// READ - Get single attendee by ID
// Requirement: CRUD Implementation - Read operation
app.get('/api/attendees/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM attendees WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Attendee not found' });
        }
        res.json(row);
    });
});

// UPDATE - Update attendee
// Requirement: CRUD Implementation - Update operation
app.put('/api/attendees/:id', (req, res) => {
    const id = req.params.id;
    const { name, email, phone } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }
    
    db.run(
        'UPDATE attendees SET name = ?, email = ?, phone = ? WHERE id = ?',
        [name, email, phone || null, id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Attendee not found' });
            }
            res.json({ 
                id: parseInt(id), 
                name, 
                email, 
                phone,
                message: 'Attendee updated successfully' 
            });
        }
    );
});

// DELETE - Delete attendee
// Requirement: CRUD Implementation - Delete operation
app.delete('/api/attendees/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM attendees WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Attendee not found' });
        }
        res.json({ message: 'Attendee deleted successfully' });
    });
});

// ============================================================================
// CRUD OPERATIONS FOR SESSIONS - Technical Objective: CRUD Implementation
// ============================================================================
// Requirement: CRUD operations implemented for at least two core entities
// This is the second entity with full CRUD operations

// CREATE - Add new session
// Requirement: CRUD Implementation - Create operation
app.post('/api/sessions', (req, res) => {
    const { title, speaker, time, location, description, capacity } = req.body;
    
    if (!title || !speaker || !time || !location) {
        return res.status(400).json({ error: 'Title, speaker, time, and location are required' });
    }
    
    db.run(
        'INSERT INTO sessions (title, speaker, time, location, description, capacity) VALUES (?, ?, ?, ?, ?, ?)',
        [title, speaker, time, location, description || null, capacity || 50],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ 
                id: this.lastID, 
                title, 
                speaker, 
                time, 
                location, 
                description,
                capacity: capacity || 50,
                message: 'Session created successfully' 
            });
        }
    );
});

// READ - Get all sessions
// Requirement: CRUD Implementation - Read operation
app.get('/api/sessions', (req, res) => {
    db.all('SELECT * FROM sessions ORDER BY id DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// READ - Get single session by ID
// Requirement: CRUD Implementation - Read operation
app.get('/api/sessions/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM sessions WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Session not found' });
        }
        res.json(row);
    });
});

// UPDATE - Update session
// Requirement: CRUD Implementation - Update operation
app.put('/api/sessions/:id', (req, res) => {
    const id = req.params.id;
    const { title, speaker, time, location, description, capacity } = req.body;
    
    if (!title || !speaker || !time || !location) {
        return res.status(400).json({ error: 'Title, speaker, time, and location are required' });
    }
    
    db.run(
        'UPDATE sessions SET title = ?, speaker = ?, time = ?, location = ?, description = ?, capacity = ? WHERE id = ?',
        [title, speaker, time, location, description || null, capacity || 50, id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Session not found' });
            }
            res.json({ 
                id: parseInt(id), 
                title, 
                speaker, 
                time, 
                location, 
                description,
                capacity: capacity || 50,
                message: 'Session updated successfully' 
            });
        }
    );
});

// DELETE - Delete session
// Requirement: CRUD Implementation - Delete operation
app.delete('/api/sessions/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM sessions WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Session not found' });
        }
        res.json({ message: 'Session deleted successfully' });
    });
});

// ============================================================================
// SESSION REGISTRATION - Additional Feature
// ============================================================================
// Allows attendees to register for sessions

// Register attendee for a session
app.post('/api/registrations', (req, res) => {
    const { attendee_id, session_id } = req.body;
    
    if (!attendee_id || !session_id) {
        return res.status(400).json({ error: 'Attendee ID and Session ID are required' });
    }
    
    // Check if session exists and has capacity
    db.get('SELECT * FROM sessions WHERE id = ?', [session_id], (err, session) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        // Count current registrations
        db.get('SELECT COUNT(*) as count FROM registrations WHERE session_id = ?', [session_id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            if (result.count >= session.capacity) {
                return res.status(400).json({ error: 'Session is full' });
            }
            
            // Check if already registered
            db.get('SELECT * FROM registrations WHERE attendee_id = ? AND session_id = ?', 
                [attendee_id, session_id], (err, existing) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                if (existing) {
                    return res.status(400).json({ error: 'Already registered for this session' });
                }
                
                // Register attendee
                db.run(
                    'INSERT INTO registrations (attendee_id, session_id) VALUES (?, ?)',
                    [attendee_id, session_id],
                    function(err) {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }
                        res.status(201).json({ 
                            id: this.lastID,
                            attendee_id,
                            session_id,
                            message: 'Successfully registered for session' 
                        });
                    }
                );
            });
        });
    });
});

// Get all registrations for a session
app.get('/api/sessions/:id/registrations', (req, res) => {
    const sessionId = req.params.id;
    db.all(`
        SELECT r.*, a.name as attendee_name, a.email as attendee_email 
        FROM registrations r
        JOIN attendees a ON r.attendee_id = a.id
        WHERE r.session_id = ?
        ORDER BY r.registration_date DESC
    `, [sessionId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Get all sessions an attendee is registered for
app.get('/api/attendees/:id/registrations', (req, res) => {
    const attendeeId = req.params.id;
    db.all(`
        SELECT r.*, s.title as session_title, s.speaker, s.time, s.location 
        FROM registrations r
        JOIN sessions s ON r.session_id = s.id
        WHERE r.attendee_id = ?
        ORDER BY s.time ASC
    `, [attendeeId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Unregister attendee from a session
app.delete('/api/registrations/:attendee_id/:session_id', (req, res) => {
    const { attendee_id, session_id } = req.params;
    db.run('DELETE FROM registrations WHERE attendee_id = ? AND session_id = ?', 
        [attendee_id, session_id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Registration not found' });
        }
        res.json({ message: 'Successfully unregistered from session' });
    });
});

// Get session with registration count
app.get('/api/sessions/:id/details', (req, res) => {
    const sessionId = req.params.id;
    db.get('SELECT * FROM sessions WHERE id = ?', [sessionId], (err, session) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        db.get('SELECT COUNT(*) as registered FROM registrations WHERE session_id = ?', 
            [sessionId], (err, count) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({
                ...session,
                registered: count.registered,
                available: session.capacity - count.registered
            });
        });
    });
});

// Start the server
startServer();

