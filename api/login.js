const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Hardcoded credentials
const jwtSecret = process.env.JWT_SECRET || "default_secret_key"; // Use the environment variable, fallback to default if not set
const validUsername = "user123";
const validPasswordHash = bcrypt.hashSync("pass123", 8);

app.get('/', (req, res) => {
    res.send("Please log in by sending a POST request to /login with your username and password.");
});

// Authentication route
app.get('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === validUsername && bcrypt.compareSync(password, validPasswordHash)) {
        const token = jwt.sign({ username }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({ message: "Access Granted. Welcome!", token });
    } else {
        res.status(401).json({ message: "Access Denied. Invalid username or password." });
    }
});

// Export serverless function
module.exports = (req, res) => {
    app(req, res);
};
