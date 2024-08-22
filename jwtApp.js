const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();

app.use(cors())

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Secret key for JWT
const jwtSecret = "your_secret_key";

// Hardcoded credentials (password is hashed)
const validUsername = "user123";
const validPasswordHash = bcrypt.hashSync("pass123", 8);  // Hashed password

// Home route (could be a login page)
app.get('/', (req, res) => {
    res.send("Please log in by sending a POST request to /login with your username and password.");
});

// Authentication route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check username and password
    if (username === validUsername && bcrypt.compareSync(password, validPasswordHash)) {
        // Generate JWT token
        const token = jwt.sign({ username }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({ message: "Access Granted. Welcome!", token });
    } else {
        res.status(401).json({ message: "Access Denied. Invalid username or password." });
    }
});

// Middleware to verify the JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: "No token provided." });
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: "Failed to authenticate token." });
        }

        req.username = decoded.username;
        next();
    });
};

// Protected endpoint
app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: `This is a protected endpoint! Welcome ${req.username}.` });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
