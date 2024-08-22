const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Hardcoded credentials
const jwtSecret = "your_secret_key";
const validUsername = "user123";
const validPasswordHash = bcrypt.hashSync("pass123", 8);

// Authentication route
app.post('/api/login', (req, res) => {
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
