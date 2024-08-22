const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

app.use(cors());

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: "No token provided." });
    }
    
    jwt.verify(token, process.env.JWT_SECRET || "your_secret_key", (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: "Failed to authenticate token." });
        }
        req.username = decoded.username;
        next();
    });
};

// Protected endpoint
app.get('/api/protected', verifyToken, (req, res) => {
    res.json({ message: `This is a protected endpoint! Welcome ${req.username}.` });
});

// Export serverless function
module.exports = (req, res) => {
    app(req, res);
};
