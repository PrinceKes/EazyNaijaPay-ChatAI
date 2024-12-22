const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true, enum: ["pending", "completed", "failed"] },
    date: { type: Date, default: Date.now },
});

const AllProfilesSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    pin: { type: String, required: true },
    accountNumber: { type: String, required: true, unique: true },
    accountBalance: { type: Number, default: 0 },
    transactions: [TransactionSchema],
    UserIP: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("AllProfiles", AllProfilesSchema);
