// Import required packages
const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

// Create Express app
const app = express();

// Enable CORS
app.use(cors());

// Create connection pool to MySQL database
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: '31/MAIOu/2004', // Replace with your MySQL password
    database: 'myDB' // Replace with your database name
});

// Parse application/json requests
app.use(bodyParser.json());

// Function to fetch the length of the "tokens" table
function fetchTokensLength(callback) {
    pool.query('SELECT COUNT(*) AS count FROM tokens', (error, results, fields) => {
        if (error) {
            console.error('Error fetching data from tokens table:', error);
            return callback(error, null);
        }
        const rowCount = results[0].count;
        console.log('Token count: ', rowCount); // Log the token count
        callback(null, rowCount);
    });
}

// GET route to fetch token count
app.get('/', (req, res) => {
    // Fetch the length of the "tokens" table
    fetchTokensLength((error, rowCount) => {
        if (error) {
            res.status(500).json({ error: 'Error fetching tokens length' });
        } else {
            res.json({ rowCount });
        }
    });
});

// POST route to redeem token
app.post('/redeem-token', (req, res) => {
    // Here you can implement logic to update the database

    // Assuming you have a function to remove the last token from the database
    removeLastTokenFromDatabase((error, result) => {
        if (error) {
            res.status(500).json({ error: 'Failed to update token count in the database' });
        } else {
            res.json({ message: 'Token count updated in the database' });
        }
    });
});

// Function to remove the last token from the database
function removeLastTokenFromDatabase(callback) {
    // Construct SQL query to delete the last token
    const sqlQuery = 'DELETE FROM tokens ORDER BY token_id DESC LIMIT 1';

    // Execute the SQL query
    pool.query(sqlQuery, (error, results, fields) => {
        if (error) {
            console.error('Error removing last token from the database:', error);
            callback(error, null);
        } else {
            console.log('A token have been redeemed from the database.');
            callback(null, results);
        }
    });
}

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});