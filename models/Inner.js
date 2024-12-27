const mongoose = require('mongoose');

const VerifiedUserSchema = new mongoose.Schema({
  User_id: { type: String, required: true, unique: true }, // User ID as a string
  Email: { type: String, required: true },
  Phone: { type: String, required: true },
  Username: { type: String, required: true },
  User_pin: { type: String, required: true }, // Can be encrypted if needed
  Account_number: { type: String, required: true },
  Bank_name: { type: String, required: true },
  BVN: { type: String, default: null },
  NIN: { type: String, default: null },
  Balance: { type: Number, required: true, default: 0 },
  Transaction: { type: [Object], default: [] } // Assuming transactions are stored as objects
});

// Use the exact collection name "Verified_Users" as needed
const VerifiedUser = mongoose.model('Verified_User', VerifiedUserSchema, 'Verified_Users');

module.exports = VerifiedUser;
