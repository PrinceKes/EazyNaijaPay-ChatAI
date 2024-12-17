from flask import Flask, request, jsonify, redirect, url_for
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

client = MongoClient("mongodb://localhost:27017/")
db = client['UserDatabase'] 
users_collection = db['RegisteredUsers'] 

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    phone = data.get('phone')
    username = data.get('username')
    password = data.get('password')

    if users_collection.find_one({"email": email}):
        return jsonify({"message": "User already exists"}), 400

    hashed_password = generate_password_hash(password)
    user_data = {
        "email": email,
        "phone": phone,
        "username": username,
        "password": hashed_password,
        "pin": None 
    }
    users_collection.insert_one(user_data)
    return jsonify({"message": "Signup successful", "redirect": "set-pin.html"}), 201


@app.route('/set-pin', methods=['POST'])
def set_pin():
    data = request.json
    email = data.get('email')
    pin = data.get('pin')

    if len(pin) != 4 or not pin.isdigit():
        return jsonify({"message": "PIN must be a 4-digit number"}), 400

    users_collection.update_one({"email": email}, {"$set": {"pin": pin}})
    return jsonify({"message": "PIN set successfully", "redirect": "index.html"}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = users_collection.find_one({"email": email})
    if user and check_password_hash(user['password'], password):
        return jsonify({"message": "Login successful", "redirect": "Dashboard.html"}), 200
    return jsonify({"message": "Invalid credentials"}), 401


if __name__ == '__main__':
    app.run(debug=True)
