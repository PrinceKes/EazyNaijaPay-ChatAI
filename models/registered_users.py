# models/registered_users.py
registered_users_schema = {
    "user_id": "Unique Telegram ID",  # Tied to the JoinedUsers table
    "email": "User Email",
    "phone_number": "User Phone Number",
    "username": "Username",
    "password": "Hashed Password",
    "pin": "4-digit Transaction Pin (hashed)",
    "account_number": "Auto-generated Account Number (via Flutterwave/Paystack API)",
    "account_balance": 0,  # Default balance
    "transactions": [],  # List to store transaction history
    "created_at": datetime.now()
}
