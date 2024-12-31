const mongoose = require('mongoose');

const VerifiedUsersSchema = new mongoose.Schema({
  User_id: { type: Number, required: true, unique: true },
  Email: { type: String, required: true },
  Phone: { type: String, required: true },
  Username: { type: String, required: true },
  User_pin: { type: String, required: true },
  Account_number: { type: String, required: true },
  Bank_name: { type: String, required: false },
  BVN: { type: String, required: false },
  NIN: { type: String, required: false },
  Balance: { type: Number, default: 0 },
  Transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transactions' }] // Reference to Transactions
});

module.exports = mongoose.model('Verified_Users', VerifiedUsersSchema);
