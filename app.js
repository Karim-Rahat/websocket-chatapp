// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const http = require('http');
const mysql = require('mysql2'); // Use mysql2 for better async support
const ejs = require('ejs');
const cors = require('cors');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Use the port specified in the environment variable or default to 4200
const PORT = process.env.PORT || 4200;

// Enable CORS for the specified domain
app.use(cors({ origin: process.env.CORS_ORIGIN }));

// MySQL database connection using environment variables
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to MySQL database
connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');

    // Create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS wp_chat_app (
            id INT AUTO_INCREMENT PRIMARY KEY,
            userId INT NOT NULL,
            pid INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    connection.query(createTableQuery, (err) => {
        if (err) {
            console.error('Error creating table:', err);
            return;
        }
        console.log('Table "wp_chat_app" is ready');
    });
});

// Serve static files from the "public" directory
app.use(express.static('public'));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Define the route for the homepage
app.get('/', (req, res) => {
    res.render('index');
});

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('A user connected');

    // Preload messages from the database and send to the connected client
    connection.query('SELECT * FROM wp_chat_app ORDER BY timestamp ASC', (err, results) => {
        if (err) {
            console.error('Error fetching messages:', err);
            return;
        }
        ws.send(JSON.stringify({ type: 'preload-messages', data: results }));
        console.log('Preloaded messages:', results);
    });

    // Log when a user disconnects
    ws.on('close', () => {
        console.log('User disconnected');
    });

    // Handle incoming messages from clients
    ws.on('message', (message) => {
        try {
            const msg = JSON.parse(message); // Parse the message as JSON

            // Validate message structure
            if (msg && msg.user_id !== undefined && msg.pid !== undefined && msg.name && msg.email && msg.message) {
                // Broadcast the message to all connected clients
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type: 'chat-message', data: msg }));
                    }
                });

                // Save the message to MySQL
                const query = 'INSERT INTO wp_chat_app SET ?';
                const messageData = {
                    userId: msg.user_id,
                    pid: msg.pid,
                    name: msg.name,
                    email: msg.email,
                    message: msg.message
                };

                connection.query(query, messageData, (err) => {
                    if (err) {
                        console.error('Error inserting message:', err);
                        return;
                    }
                    console.log('Data inserted successfully into MySQL');
                });
            } else {
                console.error('Invalid message format:', msg);
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });
});

// Start the server
server.listen(PORT, "127.0.0.1", () => {
    console.log(`Server listening on *:${PORT}`);
});
