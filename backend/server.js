const express = require('express');
const cors = require('cors');
const connectDB = require('./database');
const Intern = require('./Intern');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// GET: Fetch all interns
app.get('/interns', async (req, res) => {
    try {
        const interns = await Intern.find();
        res.json(interns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST: Create a new intern
app.post('/interns', async (req, res) => {
    try {
        const newIntern = new Intern({
            name: req.body.name,
            email: req.body.email
        });
        const savedIntern = await newIntern.save();
        res.status(201).json(savedIntern);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ==========================================
// PUT: Update an existing intern  <-- PASTE THIS HERE
// ==========================================
app.put('/interns/:id', async (req, res) => {
    try {
        const updatedIntern = await Intern.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name, email: req.body.email },
            { new: true } // This tells Mongoose to return the updated document
        );
        res.json(updatedIntern);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE: Remove an intern
app.delete('/interns/:id', async (req, res) => {
    try {
        await Intern.findByIdAndDelete(req.params.id);
        res.json({ message: 'Intern deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
