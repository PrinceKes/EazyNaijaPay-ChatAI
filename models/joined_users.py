# models/joined_users.py
from pymongo import MongoClient
from datetime import datetime

client = MongoClient("mongodb://localhost:27017")  # Replace with your MongoDB URI
db = client["EazyNaijaPay"]

# JoinedUsers Schema
joined_users_schema = {
    "user_id": "Unique Telegram ID",
    "username": "Telegram Username",
    "ip_address": "User's IP Address (Optional, fetched via a request)",
    "phone_number": None,  # Initially None; updated upon signup
    "joined_at": datetime.now()
}
