const express = require('express');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

// Connection URL
const url = process.env.MONGODB_URI;  // Use an environment variable for the MongoDB URI
const client = new MongoClient(url);

// Database Name
const dbName = 'passop';
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected successfully to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
}

connectToDatabase();

// Get all the passwords
app.get('/', async (req, res) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const findResult = await collection.find({}).toArray();
        res.json(findResult);
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error retrieving passwords', error: err.message });
    }
});

// Save a password
app.post('/', async (req, res) => {
    try {
        const password = req.body;
        if (!password || typeof password !== 'object') {
            return res.status(400).send({ success: false, message: 'Invalid input' });
        }

        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const findResult = await collection.insertOne(password);
        res.send({ success: true, result: findResult });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error saving password', error: err.message });
    }
});

// Delete a password
app.delete('/', async (req, res) => {
    try {
        const password = req.body;
        if (!password || typeof password !== 'object' || !password._id) {
            return res.status(400).send({ success: false, message: 'Invalid input' });
        }

        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const findResult = await collection.deleteOne({ _id: password._id });
        res.send({ success: true, result: findResult });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error deleting password', error: err.message });
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await client.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    } catch (err) {
        console.error('Error closing MongoDB connection', err);
        process.exit(1);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});
