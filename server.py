from flask import Flask, request, jsonify
from pymongo import MongoClient
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import requests
import hashlib

app = Flask(__name__)

# MongoDB connection
client = MongoClient("mongodb+srv://EazyNaijaPay:Adeboye2003@eazynaijapay.asnqh.mongodb.net/EazyNaijaPay-App?retryWrites=true&w=majority&appName=EazyNaijaPay")
db = client["EazyNaijaPay"]
users_collection = db["RegisteredUsers"]

# Utility: Hash PIN
def hash_value(value):
    return hashlib.sha256(value.encode()).hexdigest()

# Function: Generate virtual account using Paystack
def generate_virtual_account(phone_number, username):
    PAYSTACK_API_KEY = "sk_live_b413933d1d3c91d10c6c3dfe5395bca5a86967f0"
    url = "https://api.paystack.co/dedicated_account"
    headers = {"Authorization": f"Bearer {PAYSTACK_API_KEY}"}
    payload = {
        "customer": {
            "email": f"{username}@eazynai.com",
            "phone": phone_number
        },
        "preferred_bank": "wema-bank",
        "country": "NG",
        "account_name": username
    }
    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 200:
        return response.json()["data"]["account_number"]
    return None

# Endpoint: User Signup
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email")
    phone = data.get("phone")
    username = data.get("username")
    password = data.get("password")

    if users_collection.find_one({"email": email}):
        return jsonify({"message": "User already exists"}), 400

    hashed_password = generate_password_hash(password)
    account_number = generate_virtual_account(phone, username)

    user_data = {
        "email": email,
        "phone": phone,
        "username": username,
        "password": hashed_password,
        "pin": None,
        "account_number": account_number,
        "account_balance": 0,
        "transactions": [],
        "created_at": datetime.now()
    }
    users_collection.insert_one(user_data)
    return jsonify({"message": "Signup successful", "account_number": account_number, "redirect": "set-pin.html"}), 201

# Endpoint: Set PIN
@app.route("/set-pin", methods=["POST"])
def set_pin():
    data = request.json
    email = data.get("email")
    pin = data.get("pin")

    if len(pin) != 4 or not pin.isdigit():
        return jsonify({"message": "PIN must be a 4-digit number"}), 400

    hashed_pin = hash_value(pin)
    users_collection.update_one({"email": email}, {"$set": {"pin": hashed_pin}})
    return jsonify({"message": "PIN set successfully", "redirect": "index.html"}), 200

# Endpoint: Login
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = users_collection.find_one({"email": email})
    if user and check_password_hash(user["password"], password):
        return jsonify({"message": "Login successful", "user_id": user["_id"], "redirect": "Dashboard.html"}), 200
    return jsonify({"message": "Invalid credentials"}), 401

# Endpoint: Update Balance (Manual)
@app.route("/update_balance", methods=["POST"])
def update_balance():
    data = request.json
    user_id = data.get("user_id")
    amount = data.get("amount")

    users_collection.update_one(
        {"_id": user_id},
        {"$inc": {"account_balance": amount},
         "$push": {"transactions": {"Account Credit": amount, "Description": "Money added successfully", "Date": datetime.now().strftime("%d/%m/%Y"), "Status": "Successful"}}}
    )
    return jsonify({"status": "success", "message": "Balance updated successfully"})

# Endpoint: Paystack Webhook (Automatic Balance Update)
@app.route("/paystack_webhook", methods=["POST"])
def paystack_webhook():
    payload = request.json
    account_number = payload["data"]["customer"]["account_number"]
    amount = payload["data"]["amount"] / 100  # Convert kobo to naira

    user = users_collection.find_one({"account_number": account_number})
    if user:
        users_collection.update_one(
            {"_id": user["_id"]},
            {"$inc": {"account_balance": amount},
             "$push": {"transactions": {"Account Credit": amount, "Description": "Automatic payment update", "Date": datetime.now().strftime("%d/%m/%Y"), "Status": "Successful"}}}
        )
    return jsonify({"status": "success", "message": "Webhook processed successfully"})

if __name__ == "__main__":
    app.run(debug=True)
