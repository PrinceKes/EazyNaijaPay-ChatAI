import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application, CommandHandler, MessageHandler, ContextTypes, filters
)
from pymongo import MongoClient
import requests
import random
from telegram import WebAppInfo
from telegram import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo


logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

MONGO_URI = "mongodb+srv://EazyNaijaPay:Ade2003@eazynaijapay.asnqh.mongodb.net/EazyNaijaPay_Bot?retryWrites=true&w=majority"
client = MongoClient(MONGO_URI)
db = client['EazyNaijaPay_Bot']
verified_users_collection = db['Verified_Users']

FLUTTERWAVE_SECRET_KEY = "FLWSECK_TEST-de4dfccfc4b569fa4ea67c4f225247df-X"
FLUTTERWAVE_HEADERS = {"Authorization": f"Bearer {FLUTTERWAVE_SECRET_KEY}"}

def generate_account_number():
    return f"{random.randint(1000000000, 9999999999)}"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    user_id = user.id
    username = user.username

    verified_user = verified_users_collection.find_one({"User_id": user_id})
    if verified_user:
        balance = verified_user.get("Balance", 0)
        mini_app_url = f"https://eazynaijapay-app.onrender.com/?user_id={user_id}"

        await update.message.reply_text(
        f"Hi @{username}, welcome back! It's so nice to have you here again 😂.\n\n"
        f"Your balance is: ₦{balance:.2f}.\n"
        "Open EazyNaijaPay App to get to the mini app:",
        reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("Open EazyNaijaPay App", web_app=WebAppInfo(url=mini_app_url))]])
    )

    else:
        await update.message.reply_text(
            f"Hello {user.first_name}, welcome to EazyNaijaPay Bot! Use /register_an_account to create your account."
        )


async def register_an_account(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id

    verified_user = verified_users_collection.find_one({"User_id": user_id})
    if verified_user:
        account_number = verified_user["Account_number"]
        await update.message.reply_text(f"You already have an account. Your account number is: {account_number}")
    else:
        await update.message.reply_text("Okay, you are about to create your personal account with EazyNaijaPay Bot. Now send your email.")
        context.user_data['registration_step'] = 'email'

async def handle_registration(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    user_id = user.id
    text = update.message.text

    step = context.user_data.get('registration_step')

    if step == 'email':
        context.user_data['email'] = text
        context.user_data['registration_step'] = 'phone'
        await update.message.reply_text("Send your phone number.")
    elif step == 'phone':
        context.user_data['phone'] = text
        context.user_data['registration_step'] = 'username'
        await update.message.reply_text("Send your desired username.")
    elif step == 'username':
        context.user_data['username'] = text
        context.user_data['registration_step'] = 'pin'
        await update.message.reply_text("Send a 4-digit PIN for transactions.")
    elif step == 'pin':
        context.user_data['pin'] = text
        context.user_data['registration_step'] = 'bvn_or_nin'
        await update.message.reply_text("Send your BVN or NIN. Please state whether it's BVN or NIN (e.g., BVN: 12345678901 or NIN: 9876543210).")
    elif step == 'bvn_or_nin':
        bvn_or_nin = text.split(": ")
        if len(bvn_or_nin) != 2:
            await update.message.reply_text("Invalid format. Please use 'BVN: <value>' or 'NIN: <value>'.")
            return

        context.user_data['bvn_or_nin_type'] = bvn_or_nin[0].strip()
        context.user_data['bvn_or_nin_value'] = bvn_or_nin[1].strip()

        account_number = generate_account_number()
        context.user_data['account_number'] = account_number
        context.user_data['bank_name'] = "Mock Bank"

        verified_users_collection.insert_one({
            "User_id": user_id,
            "Email": context.user_data['email'],
            "Phone": context.user_data['phone'],
            "Username": context.user_data['username'],
            "User_pin": context.user_data['pin'],
            "Account_number": account_number,
            "Bank_name": "Mock Bank",
            context.user_data['bvn_or_nin_type']: context.user_data['bvn_or_nin_value'],
            "Balance": 0,
            "Transactions": []
        })

        await update.message.reply_text(
        f"Congratulations 🎉! Your account has been successfully created. Your account number is: {account_number} (Mock Bank).\n\n"
        "You can log in to your account using your email along with your PIN. Click the button below to open the app.",
        reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("Open EazyNaijaPay App", web_app=WebAppInfo(url=f"https://eazynaijapay-app.onrender.com/?user_id={user_id}"))]])
    )


        context.user_data.clear()

def main():
    TOKEN = "8136531029:AAHlArThifhrPiOQuQv5HYi_gBpt7_XZFjA"
    app = Application.builder().token(TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("register_an_account", register_an_account))

    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_registration))

    app.run_polling()

if __name__ == "__main__":
    main()


