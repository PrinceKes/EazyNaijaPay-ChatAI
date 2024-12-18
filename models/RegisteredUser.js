const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  date: { type: String, required: true },
});

const registeredUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  pin: { type: String, default: null }, // Hashed PIN
  accountNumber: { type: String, unique: true, required: true },
  accountBalance: { type: Number, default: 0 },
  transactions: [transactionSchema], // Array of transactions
  createdAt: { type: Date, default: Date.now }, // Timestamp for user creation
});

// Compile the schema into a model
const RegisteredUser = mongoose.model('RegisteredUser', registeredUserSchema);

module.exports = RegisteredUser;
  
