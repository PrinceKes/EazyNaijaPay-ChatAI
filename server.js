const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors'); // Import cors
const VerifiedUser = require('./models/Inner'); // Ensure this points to the correct schema
const User = require('./models/loging');

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const MONGO_URI = "mongodb+srv://EazyNaijaPay:Ade2003@eazynaijapay.asnqh.mongodb.net/EazyNaijaPay_Bot?retryWrites=true&w=majority";
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


  app.post('/login', async (req, res) => {
    console.log("Request received:", req.body);
    const { user_id, email, pin } = req.body;

    if (!user_id || !email || !pin) {
        console.log("Validation failed: Missing fields");
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        const user = await User.findOne({ User_id: user_id, Email: email, User_pin: pin });

        if (user) {
            console.log("Login successful for user:", user);
            return res.status(200).json({ success: true, message: 'Login successful' });
        } else {
            console.log("Invalid credentials");
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

  
  
// Endpoint: Fetch All Verified Users
app.get('/Verified_Users', async (req, res) => {
  try {
    const users = await VerifiedUser.find(); // Use VerifiedUser schema
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Endpoint: Fetch a Single Verified User by User_id
app.get('/Verified_Users/:User_id', async (req, res) => {
  const { User_id } = req.params; // Extract User_id from request parameters
  try {
    console.log('Fetching user with User_id:', User_id); // Debugging log
    const user = await VerifiedUser.findOne({ User_id: String(User_id) }); // Ensure User_id is treated as a string

    if (!user) {
      console.log('User not found for User_id:', User_id); // Debugging log
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log('User found:', user); // Debugging log
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Endpoint: Fetch User Balance
app.get('/Verified_Users/:User_id/Balance', async (req, res) => {
  const { User_id } = req.params;
  try {
    console.log('Fetching balance for User_id:', User_id); // Debugging log
    const user = await VerifiedUser.findOne({ User_id: String(User_id) });

    if (!user) {
      console.log('User not found for User_id:', User_id); // Debugging log
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, balance: user.Balance });
  } catch (error) {
    console.error('Error fetching balance:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

  // Endpoint to get user's account number
  app.get('/Verified_Users/:User_id/Account_number', async (req, res) => {
    const { User_id } = req.params;
    try {
      const user = await VerifiedUser.findOne({ User_id: String(User_id) });
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.status(200).json({ success: true, account_number: user.Account_number });
    } catch (error) {
      console.error('Error fetching account number:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  
  // Endpoint to get user's transaction history
  app.get('/Verified_Users/:User_id/Transaction', async (req, res) => {
    const { User_id } = req.params;
    try {
      const user = await VerifiedUser.findOne({ User_id: String(User_id) });
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.status(200).json({ success: true, transactions: user.Transaction });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  
  // Endpoint to get user's username
  app.get('/Verified_Users/:User_id/Username', async (req, res) => {
    const { User_id } = req.params;
    try {
      const user = await VerifiedUser.findOne({ User_id: String(User_id) });
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.status(200).json({ success: true, username: user.Username });
    } catch (error) {
      console.error('Error fetching username:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  });



// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


