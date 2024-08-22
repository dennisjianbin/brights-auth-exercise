const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const validUsername = "user123";
const validPassword = "pass123";

// Home route (could be a login page)
app.get('/', (req, res) => {
    res.send("Please log in by sending a POST request to /login with your username and password.");
});

// Authentication route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === validUsername && password === validPassword) {
        res.status(200).json({ message: "Access Granted. Welcome!" });
    } else {
        res.status(401).json({ message: "Access Denied. Invalid username or password." });
    }
});

app.get('/protected', (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No credentials sent!" });
    }

    // Decode the authorization header (Basic auth)
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (username === validUsername && password === validPassword) {
        res.json({ message: "This is a protected endpoint!" });
    } else {
        res.status(401).json({ message: "Access Denied. Invalid credentials." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
