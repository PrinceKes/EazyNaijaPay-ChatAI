import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import (
    Application, CommandHandler, CallbackQueryHandler, MessageHandler, ContextTypes, filters
)
from pymongo import MongoClient
import requests
from datetime import datetime
import time

# Enable logging to track bot activities and errors
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB setup to store user and task information
MONGO_URI = "mongodb+srv://EazyNaijaPay:Ade2003@eazynaijapay.asnqh.mongodb.net/EazyNaijaPay_Bot?retryWrites=true&w=majority"
client = MongoClient(MONGO_URI)
db = client['EazyNaijaPay_Bot']
all_users_collection = db['AllUsers']
verified_users_collection = db['Verified_Users']
pending_registrations_collection = db['Pending_Registrations']
tasks_collection = db['Tasks']

# Flutterwave setup for handling virtual accounts and payments
FLUTTERWAVE_SECRET_KEY = "FLWSECK_TEST-de4dfccfc4b569fa4ea67c4f225247df-X"
FLUTTERWAVE_HEADERS = {"Authorization": f"Bearer {FLUTTERWAVE_SECRET_KEY}"}

# Helper function to retry API requests in case of failure
def retry_request(func, retries=3, delay=2, **kwargs):
    """
    Retry an API request a specified number of times with a delay between retries.
    """
    for i in range(retries):
        response = func(**kwargs)
        if response.status_code == 200:  # Successful response
            return response
        time.sleep(delay)  # Wait before retrying
    return response  # Return the final response (successful or not)

# /start command handler
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    Handle the /start command. Register new users or welcome back existing users.
    """
    user = update.effective_user
    user_id = user.id
    username = user.username or "User"  # Use "User" if no username is set
    user_ip = update.effective_chat.id

    # Check if the user is already registered
    user_exists = all_users_collection.find_one({"User_id": user_id})

    if not user_exists:
        # Add new user to the AllUsers collection
        all_users_collection.insert_one({
            "User_id": user_id,
            "Username": username,
            "Joineddate": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "User_IP": user_ip
        })

        # Prompt the user to register an account
        keyboard = [[InlineKeyboardButton("Register an Account", callback_data="register_my_account")]]
        reply_markup = InlineKeyboardMarkup(keyboard)
        await update.message.reply_text(f"Hi @{username}, it's nice to have you here. Press the button below to proceed.", reply_markup=reply_markup)
    else:
        # Welcome back message with app login option
        keyboard = [[InlineKeyboardButton("Log In to App", web_app=WebAppInfo(url="https://eazynaijapay-app.onrender.com/?user_id={user_id}"))]]
        reply_markup = InlineKeyboardMarkup(keyboard)
        await update.message.reply_text(f"Hey @{username}, welcome back! It's a nice warm weather today ☀️. Click the button below to proceed.", reply_markup=reply_markup)

# /register_an_account command handler
async def register_an_account(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    Guide the user through the registration process or inform them if they are already registered.
    """
    user_id = update.effective_user.id

    # Check if the user is already verified
    verified_user = verified_users_collection.find_one({"User_id": user_id})
    
    if verified_user:
        account_number = verified_user.get("Account_number")
        await update.message.reply_text(f"You already have an account. Your account number is: {account_number}")
    else:
        # Begin registration process
        await update.message.reply_text("You don't have an account yet. Please send your email to begin registration.")
        context.user_data['registration_step'] = 'email'  # Track registration steps

# Callback handler for the "Register an Account" button
async def register_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    Handle callback for account registration and start the email collection process.
    """
    query = update.callback_query
    await query.answer()  # Acknowledge the callback
    
    # Ask the user for their email to begin registration
    await query.message.reply_text("Okay, you are about to create your personal account with EazyNaijaPay Bot. Now send your email.")
    context.user_data['registration_step'] = 'email'  # Move to the email step


# Message handler for step-by-step registration
async def handle_registration(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    Guide the user through registration steps: email, phone, username, PIN, and BVN/NIN.
    """
    user = update.effective_user
    user_id = user.id
    text = update.message.text

    # Determine the current registration step
    step = context.user_data.get('registration_step')

    if step == 'email':
        # Save email and move to phone number step
        context.user_data['email'] = text
        context.user_data['registration_step'] = 'phone'
        await update.message.reply_text("Send your phone number.")
    elif step == 'phone':
        # Save phone number and move to username step
        context.user_data['phone'] = text
        context.user_data['registration_step'] = 'username'
        await update.message.reply_text("Send your desired username.")
    elif step == 'username':
        # Save username and move to PIN step
        context.user_data['username'] = text
        context.user_data['registration_step'] = 'pin'
        await update.message.reply_text("Send a 4-digit PIN for transactions.")
    elif step == 'pin':
        # Save PIN and move to BVN/NIN step
        context.user_data['pin'] = text
        context.user_data['registration_step'] = 'bvn_or_nin'
        await update.message.reply_text("Provide your NIN or BVN to complete your account creation. Specify the one you have, e.g., (BVN: 22555040319 or NIN: 65460091981).")
    elif step == 'bvn_or_nin':
        # Save BVN or NIN and complete registration process
        if text.startswith("BVN:"):
            context.user_data['bvn'] = text.split("BVN:")[1].strip()
        elif text.startswith("NIN:"):
            context.user_data['nin'] = text.split("NIN:")[1].strip()
        else:
            await update.message.reply_text("Invalid format. Please provide your BVN or NIN in the format: BVN: 12345678901 or NIN: 65460091981.")
            return

        context.user_data['registration_step'] = None  # Reset step tracker

        # Extract collected details
        email = context.user_data['email']
        phone = context.user_data['phone']
        username = context.user_data['username']
        user_pin = context.user_data['pin']
        bvn = context.user_data.get('bvn')
        nin = context.user_data.get('nin')

        # Generate virtual account number using Flutterwave API
        payload = {"email": email, "is_permanent": True}
        if bvn:
            payload["bvn"] = bvn
        elif nin:
            payload["nin"] = nin

        response = retry_request(
            func=requests.post,
            retries=3,
            delay=2,
            url="https://api.flutterwave.com/v3/virtual-account-numbers",
            headers=FLUTTERWAVE_HEADERS,
            json=payload
        )

        if response.status_code == 200:
            # Successfully created virtual account
            account_data = response.json()['data']
            account_number = account_data['account_number']
            bank_name = account_data['bank_name']

            # Save user data in Verified_Users collection
            verified_users_collection.insert_one({
                "User_id": user_id,
                "Email": email,
                "Phone": phone,
                "Username": username,
                "User_pin": user_pin,
                "Account_number": account_number,
                "Bank_name": bank_name,
                "BVN": bvn,
                "NIN": nin,
                "Balance": 0,
                "Transaction": []
            })

            # Notify the user of successful registration
            keyboard = [[InlineKeyboardButton("Log In to App", web_app=WebAppInfo(url="https://eazynaijapay-app.onrender.com/?user_id={user_id}"))]]
            reply_markup = InlineKeyboardMarkup(keyboard)
            await update.message.reply_text(
                f"Congratulations 🎉! Your account has been successfully created. Your account number is: {account_number} ({bank_name}).\n\nYou can log in to your account using your email along with your PIN. Click the button below to open the app.", 
                reply_markup=reply_markup
            )
        else:
            # Handle API failure and save details in Pending_Registrations
            error_message = response.json().get('message', 'Unknown error')
            logger.error(f"Flutterwave API failed: {response.status_code} - {error_message}")
            
            pending_registrations_collection.insert_one({
                "User_id": user_id,
                "Email": email,
                "Phone": phone,
                "Username": username,
                "User_pin": user_pin,
                "Attempted_date": datetime.now().strftime('%Y-%-%m-%d %H:%M:%S'),
                "Error_message": error_message
            })
            await update.message.reply_text(
                "Oops! Something went wrong while creating your account. Don't worry, our team is looking into it. We'll notify you once your account is ready. Thank you for your patience."
            )



# /check_balance command handler
async def check_balance(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    Check and display the user's account balance.
    """
    user_id = update.effective_user.id

    # Fetch user details from Verified_Users collection
    user_data = verified_users_collection.find_one({"User_id": user_id})

    if user_data:
        balance = user_data.get("Balance", 0)
        await update.message.reply_text(f"Your current balance is: NGN {balance}")
    else:
        await update.message.reply_text("You don't have a registered account yet. Use /register_an_account to get started.")

# Callback handler for inline buttons
async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    Handle button callbacks for various actions like registering or logging in.
    """
    query = update.callback_query
    action = query.data

    if action == "register_my_account":
        await register_callback(update, context)

# Error handler
async def error_handler(update: object, context: ContextTypes.DEFAULT_TYPE):
    """
    Log the error and notify the user.
    """
    logger.error(msg="Exception while handling an update:", exc_info=context.error)

    if isinstance(update, Update):
        await update.message.reply_text("An unexpected error occurred. Please try again later.")

# Main function to start the bot
def main():
    # Create the application
    application = Application.builder().token("8136531029:AAHlArThifhrPiOQuQv5HYi_gBpt7_XZFjA").build()

    # Add handlers for different commands and callbacks
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("register_an_account", register_an_account))
    application.add_handler(CommandHandler("check_balance", check_balance))
    application.add_handler(CallbackQueryHandler(button_callback))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_registration))

    # Log all errors
    application.add_error_handler(error_handler)

    # Start polling
    application.run_polling()

# Run the bot if the script is executed directly
if __name__ == "__main__":
    main()