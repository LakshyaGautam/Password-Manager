const express = require('express');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

// Connection URL
const url = 'mongodb://GoFood:mern123@cluster0-shard-00-00.x0jtu.mongodb.net:27017,cluster0-shard-00-01.x0jtu.mongodb.net:27017,cluster0-shard-00-02.x0jtu.mongodb.net:27017/passop?ssl=true&replicaSet=atlas-alokjy-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0'

const client = new MongoClient(url);

// Database Name
const dbName = 'passop';
const app = express();

app.use(bodyParser.json());
app.use(cors(
    {
        origin: 'https://password-manager-frontend-peach.vercel.app', 
        methods: ['GET', 'POST', 'DELETE'],
        credentials: true
    }
));

client.connect().catch(err => console.error('MongoDB connection error:', err));

// Middleware to check for MongoDB connection
app.use((req, res, next) => {
    if (!client.isConnected()) {
        return res.status(503).send('Service Unavailable');
    }
    next();
});

// Get all the passwords
app.get('/', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult);
});

// Save a password
app.post('/', async (req, res) => {
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne(password);
    res.send({ success: true, result: findResult });
});

// Delete a password
app.delete('/', async (req, res) => {
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.deleteOne(password);
    res.send({ success: true, result: findResult });
});

// Export the API handler
module.exports = app;
