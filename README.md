Conference Event Organizer - Database Project
What This Is

This is a Conference Event Organizer Website built with Node.js and a SQLite database. It lets you manage attendees and sessions, with full create, read, update, and delete (CRUD) features. Attendees can also register for sessions.

Project Features / Requirements
Node.js REST API ✅

File: server.js

Endpoints:

/api/attendees → GET, POST, PUT, DELETE

/api/sessions → GET, POST, PUT, DELETE

Database Integration ✅

Files: database.js & server.js

Tables:

attendees → id, name, email, phone, registration_date

sessions → id, title, speaker, time, location, description, capacity

registrations → id, attendee_id, session_id, registration_date

CRUD & Frontend ✅

CRUD: Full create, read, update, delete for attendees and sessions

Frontend: public/index.html (React via CDN)

AttendeesManager → Manage attendees

SessionsManager → Manage sessions

RegistrationManager → Register attendees to sessions



Setup / Installation


Install dependencies:

npm install


Start the server:

npm start


Open browser at http://localhost:3000

You should see:

✓ Connected to SQLite
✓ Tables created
✓ Sample data added
✓ Server running on http://localhost:3000

How It Works

Add attendee/session → Fill form → Submit → Data saved → List updates

Update → Click "Edit" → Change fields → Click "Update"

Delete → Click "Delete" → Confirm → Entry removed

Register for session → Select attendee & session → Register → Updates DB

Project Files
project/
├── package.json      # Dependencies
├── server.js         # API & CRUD endpoints
├── database.js       # DB connection & tables
├── view-db.js        # Helper script to check DB
├── public/
│   └── index.html    # Frontend React app
├── conference.db     # SQLite DB (auto-created)
└── README.md         # This file



Brielle Picard :

Database design & schema setup

Node.js CRUD endpoints for attendees

Frontend AttendeesManager component

Testing & documentation


Member 2 –

CRUD endpoints for sessions

Frontend SessionsManager component

Sample data creation


Member 3 –

Frontend RegistrationManager component

Testing registrations

Screenshots for submission


Member 4 –

Server setup & API integration

Database connection code

General debugging & support


