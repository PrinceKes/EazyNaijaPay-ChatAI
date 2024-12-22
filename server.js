const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const crypto = require('crypto');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
const client = new MongoClient('mongodb+srv://<username>:<password>@eazynaijapay.mongodb.net/EazyNaijaPay-App', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let usersCollection;

client.connect()
  .then(() => {
    const db = client.db('EazyNaijaPay');
    usersCollection = db.collection('RegisteredUsers');
    console.log('Connected to MongoDB');
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Helper function to hash values
function hashValue(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

// Generate a virtual account using Paystack
async function generateVirtualAccount(phone, username) {
  const PAYSTACK_API_KEY = 'sk_live_your_paystack_key';
  const url = 'https://api.paystack.co/dedicated_account';
  const headers = { Authorization: `Bearer ${PAYSTACK_API_KEY}` };
  const payload = {
    customer: { email: `${username}@eazynai.com`, phone },
    preferred_bank: 'wema-bank',
    country: 'NG',
    account_name: username,
  };

  try {
    const response = await axios.post(url, payload, { headers });
    if (response.data.status && response.data.data.account_number) {
      return response.data.data.account_number;
    }
    console.error('Invalid Paystack response:', response.data);
    return null;
  } catch (error) {
    console.error('Error generating virtual account:', error.response?.data || error.message);
    return null;
  }
}

// Signup route



app.post('/signup', async (req, res) => {
  const { email, phone, username, password } = req.body;

  if (!email || !phone || !username || !password) {
    console.error('Missing fields in request:', req.body);
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    console.log('Checking if user exists...');
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      console.error('User already exists:', email);
      return res.status(400).json({ message: 'User already exists.' });
    }

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Generating virtual account...');
    const accountNumber = await generateVirtualAccount(phone, username);

    if (!accountNumber) {
      console.error('Failed to generate virtual account.');
      return res.status(500).json({ message: 'Failed to generate virtual account.' });
    }

    const userData = {
      email,
      phone,
      username,
      password: hashedPassword,
      pin: null,
      accountNumber,
      accountBalance: 0,
      transactions: [],
      createdAt: new Date(),
    };

    console.log('Inserting user into database...');
    await usersCollection.insertOne(userData);

    console.log('Signup successful:', email);
    res.status(201).json({ message: 'Signup successful', redirect: 'set-pin.html' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});



// Set PIN route
app.post('/set-pin', async (req, res) => {
  const { pin } = req.body;

  if (!pin || pin.length !== 4) {
    return res.status(400).json({ message: 'Invalid PIN.' });
  }

  try {
    const hashedPin = hashValue(pin);

    // Example user session handling
    const userId = req.headers['x-user-id']; // Replace with proper authentication
    if (!userId) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }

    const result = await usersCollection.updateOne(
      { _id: new MongoClient.ObjectId(userId) },
      { $set: { pin: hashedPin } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'PIN set successfully.' });
  } catch (error) {
    console.error('Set PIN error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
