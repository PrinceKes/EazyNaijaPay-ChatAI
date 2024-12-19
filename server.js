const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
const axios = require('axios');
const crypto = require('crypto');
const RegisteredUser = require('./models/RegisteredUsers');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
const client = new MongoClient("mongodb+srv://EazyNaijaPay:Adeboye2003@eazynaijapay.asnqh.mongodb.net/EazyNaijaPay-App?retryWrites=true&w=majority&appName=EazyNaijaPay", { useNewUrlParser: true, useUnifiedTopology: true });
let db, usersCollection;

client.connect()
  .then(() => {
    db = client.db('EazyNaijaPay');
    usersCollection = db.collection('RegisteredUsers');
    console.log('Connected to MongoDB');
  })
  .catch(err => console.log(err));

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files like your signup.html

// Route to check server health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Helper function to hash values
function hashValue(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

// Function to generate a virtual account (Paystack integration)
async function generateVirtualAccount(phoneNumber, username) {
    const PAYSTACK_API_KEY = "sk_live_b413933d1d3c91d10c6c3dfe5395bca5a86967f0";
    const url = "https://api.paystack.co/dedicated_account";
    const headers = { "Authorization": `Bearer ${PAYSTACK_API_KEY}` };
    const payload = {
      customer: { email: `${username}@eazynai.com`, phone: phoneNumber },
      preferred_bank: "wema-bank",
      country: "NG",
      account_name: username
    };
  
    try {
      const response = await axios.post(url, payload, { headers });
      console.log("Paystack response:", response.data);
  
      if (response.status === 200 && response.data.data.account_number) {
        return response.data.data.account_number;
      } else {
        console.error("Invalid Paystack response:", response.data);
        return null;
      }
    } catch (error) {
      console.error("Error generating account:", error.response?.data || error.message);
      return null;
    }
  }
  




// User signup route
app.post("/signup", async (req, res) => {
    try {
      const { email, phone, username, password } = req.body;
  
      if (!email || !phone || !username || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const accountNumber = await generateVirtualAccount(phone, username);
  
      if (!accountNumber) {
        return res.status(500).json({ message: "Failed to generate virtual account" });
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
        createdAt: new Date()
      };
  
      await usersCollection.insertOne(userData);
      return res.status(201).json({
        message: "Signup successful",
        accountNumber,
        redirect: "set-pin.html"
      });
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  




// Set pin route
app.post("/set-pin", async (req, res) => {
  const { email, pin } = req.body;

  if (!email || !pin || pin.length !== 4 || isNaN(pin)) {
    return res.status(400).json({ message: "PIN must be a 4-digit number" });
  }

  const hashedPin = hashValue(pin);
  await usersCollection.updateOne({ email }, { $set: { pin: hashedPin } });
  return res.status(200).json({ message: "PIN set successfully", redirect: "index.html" });
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await usersCollection.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    return res.status(200).json({ message: "Login successful", userId: user._id, redirect: "Dashboard.html" });
  }
  return res.status(401).json({ message: "Invalid credentials" });
});

// Paystack webhook route (for updating balance)
app.post("/paystack_webhook", async (req, res) => {
  const { account_number, amount } = req.body.data.customer;
  
  const user = await usersCollection.findOne({ accountNumber: account_number });
  if (user) {
    await usersCollection.updateOne(
      { _id: ObjectId(user._id) },
      {
        $inc: { accountBalance: amount / 100 }, // Converting amount to Naira
        $push: {
          transactions: {
            description: "Automatic payment update",
            amount: amount / 100,
            status: "Successful",
            date: new Date().toLocaleDateString()
          }
        }
      }
    );
  }

  return res.status(200).json({ message: "Webhook processed successfully" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});