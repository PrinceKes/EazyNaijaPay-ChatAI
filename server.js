const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./models/loging'); // Import the User model from loging.js

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const MONGO_URI = "mongodb+srv://EazyNaijaPay:Ade2003@eazynaijapay.asnqh.mongodb.net/EazyNaijaPay_Bot?retryWrites=true&w=majority";
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Login Route
app.post('/login', async (req, res) => {
  const { user_id, email, pin } = req.body;

  if (!user_id || !email || !pin) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    // Query the Verified_Users collection
    const user = await User.findOne({ User_id: user_id, Email: email, User_pin: pin });

    if (user) {
      return res.status(200).json({ success: true, message: 'Login successful' });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
