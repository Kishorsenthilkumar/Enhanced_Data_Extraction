const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios'); // For making HTTP requests
const jwt = require('jsonwebtoken'); // For token handling
const morgan = require('morgan'); // For logging
const { parse } = require('node-html-parser'); // For parsing HTML

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'your_secret_key'; // Use a strong secret key

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // Parse JSON bodies
app.use(morgan('combined')); // Use morgan to log requests

// Middleware for authentication
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Data validation function
const validateData = (data) => {
    if (!data.url) {
        throw new Error('Invalid data: Missing required field "url"');
    }
};

// Scraping function
const scrapeData = async (url) => {
    try {
        const response = await axios.get(url);
        const root = parse(response.data);
        // Example: Extracting all <h1> tags
        const data = root.querySelectorAll('h1').map(h1 => h1.text);
        return data;
    } catch (error) {
        throw new Error('Error scraping data: ' + error.message);
    }
};

// Define a route for data scraping
app.post('/scrape', authenticateToken, async (req, res) => {
    try {
        validateData(req.body);
        const scrapedData = await scrapeData(req.body.url);
        res.status(200).json({ data: scrapedData });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Define a route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Define a route to fetch data from an external API
app.get('/fetch-data', async (req, res) => {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

// Define a login route to get a token
app.post('/login', (req, res) => {
    const user = { name: 'user' }; // Hardcoded user for demonstration
    const token = jwt.sign(user, SECRET_KEY);
    res.json({ token });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});  
