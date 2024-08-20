const express = require('express');
const path = require('path');
const shortid = require('shortid');
const URL = require('./models/urls');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', async (req, res) => {
    const urls = await URL.find({});
    res.render('index', { urls });
});

// Route to handle redirection
app.get("/:shortID", async (req, res) => {
    try {
        // Find the URL entry by shortID
        let urlEntry = await URL.findOne({ shortID: req.params.shortID });

        if (!urlEntry) {
            return res.status(404).send({ error: "Short URL not found" });
        }

        // Increment the total clicks
        urlEntry.totalClicks += 1;
        await urlEntry.save();

        // Redirect to the original URL
        res.redirect(urlEntry.redirectUrl);
    } catch (error) {
        res.status(500).send({ error: "Failed to redirect" });
    }
});

app.post("/shorten", async (req, res) => {
    try {
        let { url } = req.body;

        if (!url) {
            return res.status(400).send({ error: 'URL is required' });
        }

        // Create a new short URL entry
        let createdUrl = await URL.create({
            shortID: shortid.generate(),     // Generate a short ID using shortid
            redirectUrl: url                // Store the URL from the request
        });

        res.send(createdUrl);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to create short URL' });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
