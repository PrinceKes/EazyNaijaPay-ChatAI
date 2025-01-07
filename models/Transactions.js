const mongoose = require('mongoose');

const TransactionsSchema = new mongoose.Schema({
  User_id: { type: Number, required: true }, // Link to the user
  Transaction_Type: { type: String, required: true }, // e.g., "Deposit", "Withdrawal", "Payment"
  Amount: { type: Number, required: true },
  mobile_number: { type: String, required: true }, // Mobile number involved in the transaction
  Status: { type: String, required: true }, // e.g., "Pending", "Completed", "Failed"
  Reference: { type: String, required: true }, // Transaction reference or ID
  CreatedAt: { type: Date, default: Date.now }, // Automatically sets the creation timestamp
});

module.exports = mongoose.model('Transactions', TransactionsSchema);






// const mongoose = require('mongoose');

// const TransactionsSchema = new mongoose.Schema({
//   User_id: { type: Number, required: true }, // Link to the user
//   Transaction_Type: { type: String, required: true }, // e.g., "Deposit", "Withdrawal", "Payment"
//   Amount: { type: Number, required: true },
//   Status: { type: String, required: true }, // e.g, "Pending", "Completed", "Failed"
//   Reference: { type: String, required: true }, // Transaction reference or ID
//   CreatedAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Transactions', TransactionsSchema);
