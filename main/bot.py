from telegram import Update, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, Filters, ContextTypes
from pymongo import MongoClient
import requests
from datetime import datetime

MONGO_URI = "mongodb+srv://EazyNaijaPay:Adeboye2003@eazynaijapay.asnqh.mongodb.net/EazyNaijaPay-App?retryWrites=true&w=majority&appName=EazyNaijaPay"
client = MongoClient(MONGO_URI)
db = client["EazyNaijaPay-App"]
joined_users_collection = db["JoinedUsers"]

USER_REGISTRATION = {}

def add_user_to_db(user_id, username, first_name, last_name):
    user_data = {
        "user_id": user_id,
        "username": username,
        "first_name": first_name,
        "last_name": last_name,
        "joined_at": datetime.now(),
    }

    if not joined_users_collection.find_one({"user_id": user_id}):
        joined_users_collection.insert_one(user_data)
        print(f"New user added: {username}")
    else:
        print(f"User {username} already exists in the database.")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    add_user_to_db(user.id, user.username, user.first_name, user.last_name)

    message = (
        f"Welcome to EazyNaijaPay, @{user.username}! "
        "You can click the button below to register your account with us."
    )

    keyboard = [
        [InlineKeyboardButton("Register an Account", callback_data="register_account")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(message, reply_markup=reply_markup)

async def handle_button_click(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    if query.data == "register_account":
        await query.answer()
        await query.edit_message_text(
            "You've done well! Now send your details in this format:\n\n"
            "Email Address: (e.g. michael@gmail.com),\n"
            "Phone Number: (e.g. 07086597523),\n"
            "Username: (e.g. michealleo),\n"
            "4 Digit PIN: (e.g. 8909)"
        )

async def handle_user_details(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    details = update.message.text.strip().split(",")
    
    if len(details) != 4:
        await update.message.reply_text(
            "Invalid format! Please send your details in this format:\n"
            "Email Address: (e.g. michael@gmail.com),\n"
            "Phone Number: (e.g. 07086597523),\n"
            "Username: (e.g. michealleo),\n"
            "4 Digit PIN: (e.g. 8909)"
        )
        return

    email, phone, username, pin = [item.split(":")[1].strip() for item in details]

    if not pin.isdigit() or len(pin) != 4:
        await update.message.reply_text("Your PIN must be a 4-digit number. Please try again.")
        return

    # Inform the user about account creation
    await update.message.reply_text("Wait while we create your account for you...")

    # Send data to the server.js for MongoDB insertion and Paystack integration
    server_response = requests.post(
        "http://localhost:5000/create_account",  # Your server endpoint
        json={
            "telegram_id": user.id,
            "email": email,
            "phone": phone,
            "username": username,
            "pin": pin,
        },
    )

    if server_response.status_code == 200:
        account_data = server_response.json()
        await update.message.reply_text(
            f"Hey @{username}, congratulations! Your account has been successfully created.\n\n"
            f"Here is your Account Number: {account_data['accountNumber']}\n"
            "You can fund your account using this number, and you can use your username/email "
            "with your PIN to log in to your account on the mini app page.",
            reply_markup=InlineKeyboardMarkup([
                [InlineKeyboardButton("Open Mini App", web_app=WebAppInfo(url="https://eazynaijapay-app.onrender.com/"))]
            ])
        )
    else:
        await update.message.reply_text("Failed to create your account. Please try again later.")

def main():
    TOKEN = "8136531029:AAHlArThifhrPiOQuQv5HYi_gBpt7_XZFjA"  # Replace with your bot token
    application = ApplicationBuilder().token(TOKEN).build()

    application.add_handler(CommandHandler("start", start))
    application.add_handler(MessageHandler(Filters.text & ~Filters.command, handle_user_details))
    application.add_handler(CallbackQueryHandler(handle_button_click))

    print("Bot is running...")
    application.run_polling()

if __name__ == "__main__":
    main()









# from telegram import Update, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
# from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
# from pymongo import MongoClient
# from datetime import datetime

# MONGO_URI = "mongodb+srv://EazyNaijaPay:Adeboye2003@eazynaijapay.asnqh.mongodb.net/EazyNaijaPay-App?retryWrites=true&w=majority&appName=EazyNaijaPay"
# client = MongoClient(MONGO_URI)
# db = client["EazyNaijaPay-App"]
# joined_users_collection = db["JoinedUsers"]


# def add_user_to_db(user_id, username, first_name, last_name):
#     user_data = {
#         "user_id": user_id,
#         "username": username,
#         "first_name": first_name,
#         "last_name": last_name,
#         "joined_at": datetime.now(),
#     }

#     if not joined_users_collection.find_one({"user_id": user_id}):
#         joined_users_collection.insert_one(user_data)
#         print(f"New user added: {username}")
#     else:
#         print(f"User {username} already exists in the database.")


# async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
#     user = update.effective_user

#     add_user_to_db(user.id, user.username, user.first_name, user.last_name)

#     message = "You are on the test mode for now. Click the button to view the EazyNaijaApp."

#     web_app_url = "https://eazynaijapay-app.onrender.com/"
#     keyboard = [
#         [InlineKeyboardButton("Open EazyNaijaApp", web_app=WebAppInfo(url=web_app_url))]
#     ]
#     reply_markup = InlineKeyboardMarkup(keyboard)

#     await update.message.reply_text(message, reply_markup=reply_markup)

# def main():
#     TOKEN = "8136531029:AAHlArThifhrPiOQuQv5HYi_gBpt7_XZFjA"  # Replace with your bot token

#     application = ApplicationBuilder().token(TOKEN).build()

#     application.add_handler(CommandHandler("start", start))

#     print("Bot is running...")
#     application.run_polling()


# if __name__ == "__main__":
#     main()
