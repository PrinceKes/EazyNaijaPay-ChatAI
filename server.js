// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const MONGO_URI = "mongodb+srv://EazyNaijaPay:Ade2003@eazynaijapay.asnqh.mongodb.net/EazyNaijaPay_Bot?retryWrites=true&w=majority";
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  _id: String,
  User_id: String,
  Email: String,
  User_pin: String,
  // Other fields as needed...
});
const User = mongoose.model('Verified_Users', userSchema);

app.post('/login', async (req, res) => {
    const { user_id, email, pin } = req.body;
  
    if (!user_id || !email || !pin) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
  
    try {
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





// // server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const path = require('path');
// const app = express();

// // Middleware
// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public')));

// // MongoDB Connection
// const MONGO_URI = "mongodb+srv://EazyNaijaPay:Ade2003@eazynaijapay.asnqh.mongodb.net/EazyNaijaPay_Bot?retryWrites=true&w=majority";
// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB Connected'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// // Define User Schema and Model
// const userSchema = new mongoose.Schema({
//   _id: String,
//   User_id: String,
//   Email: String,
//   User_pin: String,
//   // other fields as needed...
// });
// const User = mongoose.model('Verified_Users', userSchema);

// // Login Route
// app.post('/login', async (req, res) => {
//   const { user_id, email, pin } = req.body;

//   try {
//     const user = await User.findOne({ User_id: user_id, Email: email, User_pin: pin });

//     if (user) {
//       return res.status(200).json({ success: true, message: 'Login successful' });
//     } else {
//       return res.status(401).json({ success: false, message: 'Invalid credentials' });
//     }
//   } catch (error) {
//     console.error('Error during login:', error);
//     return res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });




// git add .
// git commit -m "update all"
// git push origin main