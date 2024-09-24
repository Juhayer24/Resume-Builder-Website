// server.js

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const uri = "mongodb+srv://nhnihal100200:HQgvsP4dSTaaK1Bx@cluster0.7sals.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const app = express();
app.use(cors());
app.use(express.json()); // To parse incoming JSON payloads

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));
// Define the User schema
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String
});

// Create a User model
const User = mongoose.model('User', userSchema);

// check if it is working
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Register a new user
app.post('/api/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).send('User already exists');

    // Hash the password before storing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword
    });

    await user.save();
    res.send({ success: true, message: 'User registered successfully' });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
