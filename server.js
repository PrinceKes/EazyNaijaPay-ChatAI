const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const VerifiedUser = require('./models/Inner');
const User = require('./models/loging');
const axios = require('axios');
const fs = require('fs');
const Transaction = require("./models/Transactions");
const VerifiedUsers = require('./models/Verified_Users');
const crypto = require('crypto');
const fetch = require("node-fetch");
const router = express.Router();

const BOT_TOKEN = '8136531029:AAHlArThifhrPiOQuQv5HYi_gBpt7_XZFjA';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const MONGO_URI = "mongodb+srv://EazyNaijaPay:Ade2003@eazynaijapay.asnqh.mongodb.net/EazyNaijaPay_Bot?retryWrites=true&w=majority";
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Constants for Husmodata API
const AIRTIME_API_URL = "https://www.husmodata.com/api/topup/";
const DATA_API_URL = "https://www.husmodata.com/api/data/";
const AUTH_TOKEN = "1b4b2afd4ef0f22d082ebaf6c327de30ea1b6bcf";

// All your previous routes stay here...
// Example Login Route
app.post('/login', async (req, res) => {
  const { User_id, Email, User_pin } = req.body;
  if (!User_id || !Email || !User_pin) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    const user = await VerifiedUser.findOne({ User_id: parseInt(User_id), Email: Email, User_pin: User_pin });
    if (user) {
      return res.status(200).json({ success: true, message: 'Login successful' });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Adding the new Husmodata Proxy Routes
// Airtime Top-Up Proxy
app.post("/proxy/topup", async (req, res) => {
  try {
    const response = await fetch(AIRTIME_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Token ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    console.log("Husmodata API Response (Top-Up):", data);
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Error in Top-Up Proxy:", error);
    res.status(500).json({ error: "Failed to fetch data from API." });
  }
});

// Data Purchase Proxy
app.post("/proxy/data", async (req, res) => {
  try {
    const response = await fetch(DATA_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Token ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    console.log("Husmodata API Response (Data Purchase):", data);
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Error in Data Purchase Proxy:", error);
    res.status(500).json({ error: "Failed to fetch data from API." });
  }
});




// All your other routes (e.g., Verified_Users, profile_picture, etc.) stay here...

app.get('/Verified_Users', async (req, res) => {
    try {
      const users = await VerifiedUser.find();
      return res.status(200).json({ success: true, data: users });
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  
  
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
  
  
    app.get('/Verified_Users/:User_id/Account_number', async (req, res) => {
      const { User_id } = req.params;
      console.log(`Received request for User ID: ${User_id}`);
    
      try {
        const user = await VerifiedUser.findOne({ User_id: String(User_id).toLowerCase() });
        if (!user) {
          console.log('User not found in database');
          return res.status(404).json({ success: false, message: 'User not found' });
        }
    
        console.log(`Account number retrieved: ${user.Account_number}`);
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
  
  // profile_pictures endpoint 
  const profilePicturesDir = path.join(__dirname, 'profile_pictures');
  if (!fs.existsSync(profilePicturesDir)) {
    fs.mkdirSync(profilePicturesDir, { recursive: true });
  }
  
  app.get('/Verified_Users/:User_id/profile_picture', async (req, res) => {
    const { User_id } = req.params;
  
    try {
      const localFilePath = path.join(profilePicturesDir, `${User_id}.jpg`);
      if (fs.existsSync(localFilePath)) {
        return res.sendFile(localFilePath);
      }
  
      const response = await axios.get(
        `https://api.telegram.org/bot${BOT_TOKEN}/getUserProfilePhotos?user_id=${User_id}`
      );
  
      const photos = response.data.result.photos;
      if (!photos || photos.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No profile picture found',
          placeholder: '/assets/default-profile-icon.png',
        });
      }
  
      const fileId = photos[0][0].file_id;
  
      const fileResponse = await axios.get(
        `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
      );
      const filePath = fileResponse.data.result.file_path;
  
      const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
  
      const writer = fs.createWriteStream(localFilePath);
      const imageResponse = await axios({
        url: fileUrl,
        method: 'GET',
        responseType: 'stream',
      });
      imageResponse.data.pipe(writer);
  
      writer.on('finish', () => res.sendFile(localFilePath));
      writer.on('error', (err) => {
        console.error('Error writing file:', err);
        res.status(500).json({ success: false, message: 'Error saving profile picture' });
      });
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  
  
  
  
  
  
  
  
  
  
  
  
  
  // webhook code for transaction detection and notifying
  // Webhook to detect payments and update user transactions and balance
  app.post('/webhook/flutterwave', async (req, res) => {
    try {
        const { event, data } = req.body;
  
        if (event === 'transfer.completed') {
            const { account_number, amount, transaction_reference, status } = data;
  
            if (status === 'successful') {
                const user = await VerifiedUser.findOne({ Account_number: account_number });
  
                if (!user) {
                    return res.status(404).json({ success: false, message: 'User not found' });
                }
  
                const newTransaction = new Transaction({
                    User_id: user.User_id,
                    Transaction_Type: 'Deposit',
                    Amount: amount,
                    Status: 'Completed',
                    Reference: transaction_reference,
                });
  
                await newTransaction.save();
  
                user.Transactions.push(newTransaction._id);
  
                user.Balance += amount;
  
                await user.save();
  
                return res.status(200).json({ success: true, message: 'Transaction and balance updated' });
            } else {
                return res.status(400).json({ success: false, message: 'Transaction not successful' });
            }
        } else {
            return res.status(400).json({ success: false, message: 'Unhandled event type' });
        }
    } catch (error) {
        console.error('Error handling webhook:', error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  });
  
  
  
  
  
  
  app.post('/webhook/flutterwave', async (req, res) => {
      const flutterwaveSecret = 'your-flutterwave-secret-key';
      const signature = req.headers['verif-hash'];
  
      const payload = JSON.stringify(req.body);
      const expectedSignature = crypto.createHmac('sha256', flutterwaveSecret).update(payload).digest('hex');
  
      if (signature !== expectedSignature) {
          return res.status(401).json({ success: false, message: 'Invalid signature' });
      }
  
  });
  


















// Route to update user balance
app.put('/Verified_Users/:User_id/Balance', async (req, res) => {
  const { User_id } = req.params;
  const { Balance: deductionAmount } = req.body;

  try {
      const user = await VerifiedUsers.findOne({ User_id });
      if (!user) return res.status(404).json({ success: false, message: "User not found." });

      const newBalance = user.Balance - deductionAmount;
      if (newBalance < 0) return res.status(400).json({ success: false, message: "Insufficient balance." });

      user.Balance = newBalance;
      await user.save();

      res.status(200).json({ success: true, message: "Balance updated successfully.", user });
  } catch (error) {
      console.error("Error updating balance:", error);
      res.status(500).json({ success: false, message: "Failed to update balance." });
  }
});

// Route to save transaction
app.post('/Verified_Users/:User_id/transactions', async (req, res) => {
  const { User_id } = req.params;
  const { Transaction_Type, Amount, mobile_number, Status, Reference } = req.body;

  try {
      const transaction = new Transaction({
          User_id,
          Transaction_Type,
          Amount,
          mobile_number,
          Status,
          Reference,
      });

      await transaction.save();

      await VerifiedUsers.findOneAndUpdate(
          { User_id },
          { $push: { Transactions: transaction._id } }
      );

      res.status(200).json({ success: true, message: "Transaction saved successfully." });
  } catch (error) {
      console.error("Error saving transaction:", error);
      res.status(500).json({ success: false, message: "Failed to save transaction." });
  }
});




//   // Route to update user balance
// router.put('/Verified_Users/:User_id/Balance', async (req, res) => {
//   const { User_id } = req.params;
//   const { Balance } = req.body;

//   try {
//       const user = await VerifiedUsers.findOneAndUpdate(
//           { User_id: userId },
//           { Balance },
//           { new: true }
//       );

//       if (!user) return res.status(404).json({ success: false, message: "User not found." });

//       res.status(200).json({ success: true, message: "Balance updated successfully.", user });
//   } catch (error) {
//       console.error("Error updating balance:", error);
//       res.status(500).json({ success: false, message: "Failed to update balance." });
//   }
// });






// // Updating the transaction
// // Route to save transaction
// router.post('/Verified_Users/:User_id/transactions', async (req, res) => {
//   const { User_id } = req.params;
//   const { Transaction_Type, Amount, mobile_number, Status, Reference, CreatedAt } = req.body;

//   try {
//       // Create and save transaction
//       const transaction = new Transactions({
//           User_id: userId,
//           Transaction_Type,
//           Amount,
//           mobile_number,
//           Status,
//           Reference,
//           CreatedAt,
//       });

//       await transaction.save();

//       // Update user's transaction history
//       await VerifiedUsers.findOneAndUpdate(
//           { User_id: userId },
//           { $push: { Transactions: transaction._id } }
//       );

//       res.status(200).json({ success: true, message: "Transaction saved successfully." });
//   } catch (error) {
//       console.error("Error saving transaction:", error);
//       res.status(500).json({ success: false, message: "Failed to save transaction." });
//   }
// });

// module.exports = router;



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
