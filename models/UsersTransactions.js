const mongoose = require("mongoose");

// Define the schema for a user's transactions
const UserTransactionSchema = new mongoose.Schema({
  User_id: {
    type: String,
    required: true,
    unique: true,
  },
  transactions: [
    {
      networkId: { type: String, required: true },
      planId: { type: String }, // Optional for airtime transactions
      amount: { type: Number, required: true },
      phone: { type: String, required: true },
      status: { type: String, required: true },
      type: { type: String, enum: ["data", "airtime"], required: true }, // To differentiate transaction types
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

// Create the model
const UserTransaction = mongoose.model("UserTransaction", UserTransactionSchema);

module.exports = UserTransaction;
