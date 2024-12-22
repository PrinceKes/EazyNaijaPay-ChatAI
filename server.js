const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const axios = require("axios");
const AllProfiles = require("./models/allprofiles");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
const MONGO_URI = "mongodb+srv://EazyNaijaPay:Adeboye2003@eazynaijapay.asnqh.mongodb.net/EazyNaijaPay-App?retryWrites=true&w=majority&appName=EazyNaijaPay";
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Paystack API Key
const PAYSTACK_API_KEY = "sk_live_b413933d1d3c91d10c6c3dfe5395bca5a86967f0";

// API to create user profile
app.post("/create-profile", async (req, res) => {
    try {
        const { email, phone, username, pin } = req.body;

        // Validate inputs
        if (!email || !phone || !username || !pin) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if the user already exists
        const existingUser = await AllProfiles.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Generate an account number using Paystack API
        const response = await axios.post(
            "https://api.paystack.co/dedicated_account",
            {
                customer: {
                    email: email,
                    phone: phone,
                },
                preferred_bank: "wema-bank",
            },
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const accountNumber = response.data.data.account_number;

        // Create new user profile
        const newUser = new AllProfiles({
            email,
            phone,
            username,
            pin,
            accountNumber,
            accountBalance: 0,
            transactions: [],
            UserIP: req.ip,
        });

        await newUser.save();

        return res.status(201).json({
            message: "User profile created successfully",
            accountNumber,
        });
    } catch (error) {
        console.error("Error creating profile:", error);
        return res.status(500).json({ error: "Server error occurred" });
    }
});

// Server startup
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
