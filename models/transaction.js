// ./models/transaction.js

const mongoose = require("mongoose");

// Define the transaction schema
const transactionSchema = new mongoose.Schema({
  User_id: { type: String, required: true, unique: true },
  transactions: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      date: { type: String, required: true },
      status: { type: String, enum: ["success", "failed"], required: true },
    },
  ],
});

// Create a method to add a new transaction for a user
transactionSchema.statics.addTransaction = async function (User_id, transaction) {
  try {
    let userTransaction = await this.findOne({ User_id });

    if (!userTransaction) {
      // If the user doesn't exist, create a new document
      userTransaction = await this.create({
        User_id,
        transactions: [transaction],
      });
    } else {
      // If the user exists, update the transactions array
      userTransaction.transactions.push(transaction);
      await userTransaction.save();
    }

    return userTransaction;
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
};

// Create a method to get all transactions for a user
transactionSchema.statics.getTransactions = async function (User_id) {
  try {
    const userTransaction = await this.findOne({ User_id });
    if (!userTransaction) {
      return { success: false, message: "User not found", transactions: [] };
    }
    return { success: true, transactions: userTransaction.transactions };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

// Create the model
const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
