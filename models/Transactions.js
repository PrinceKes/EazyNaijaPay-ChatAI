const mongoose = require('mongoose');

const TransactionsSchema = new mongoose.Schema({
  User_id: { type: Number, required: true },
  Transaction_Type: { type: String, required: true },
  Amount: { type: Number, required: true },
  mobile_number: { type: String, required: true },
  Status: { type: String, required: true },
  Reference: { type: String, required: true },
  CreatedAt: { type: Date, default: Date.now },
}, { collection: 'Transactions' });

module.exports = mongoose.model('Transactions', TransactionsSchema);
