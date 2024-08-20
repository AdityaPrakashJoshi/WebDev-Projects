const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/shortUrl', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});

const urlSchema = new mongoose.Schema({
    shortID: {
        type: String,
        required: true,
        unique: true
    },
    redirectUrl: {
        type: String,
        required: true
    },
    totalClicks: {
        type: Number,
        default: 0 // Initialize to 0
    }
});

const URL = mongoose.model('url', urlSchema);

module.exports = URL;

