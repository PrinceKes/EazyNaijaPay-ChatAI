const mongoose = require('mongoose');

const VerifiedUserSchema = new mongoose.Schema({
  User_id: { type: Number, required: true, unique: true }, // Changed to Number
  Email: { type: String, required: true },
  Phone: { type: String, required: true },
  Username: { type: String, required: true },
  User_pin: { type: String, required: true },
  Account_number: { type: String, required: true },
  Bank_name: { type: String, required: true },
  BVN: { type: String, default: null },
  NIN: { type: String, default: null },
  Balance: { type: Number, required: true, default: 0 },
  Transaction: { type: [Object], default: [] }
});

const VerifiedUser = mongoose.model('Verified_User', VerifiedUserSchema, 'Verified_Users');

module.exports = VerifiedUser;
