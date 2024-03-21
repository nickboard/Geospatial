const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

const url = 'mongodb://localhost:27017';
const dbName = 'mapLocations';
const client = new MongoClient(url);

app.use(express.json());
app.use(express.static('public'));

client.connect(err => {
    if (err) throw err;
    console.log("Connected successfully to MongoDB");
});

app.post('/add-location', async (req, res) => {
    const { name, type, amenities, dogFriendly, comments, lat, lng } = req.body;

    try {
        const db = client.db(dbName);
        const collection = db.collection("locations");
        await collection.insertOne({ name, type, amenities, dogFriendly, comments, lat, lng });
        res.json({ status: 'success', message: 'Location added successfully.' });
    } catch (err) {
        console.error('Error saving location:', err);
        res.status(500).json({ status: 'error', message: 'Error saving location' });
    }
});

app.get('/locations', async (req, res) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection("locations");
        const locations = await collection.find({}).toArray();
        res.json(locations);
    } catch (err) {
        console.error('Error fetching locations:', err);
        res.status(500).send("Error fetching locations");
    }
});


app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
