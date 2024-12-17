from telegram import Update, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
from pymongo import MongoClient
from datetime import datetime

MONGO_URI = "mongodb+srv://EazyNaijaPay:Adeboye2003@eazynaijapay.asnqh.mongodb.net/EazyNaijaPay-App?retryWrites=true&w=majority&appName=EazyNaijaPay"
client = MongoClient(MONGO_URI)
db = client["EazyNaijaPay-App"]
joined_users_collection = db["JoinedUsers"]


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

    message = "You are on the test mode for now. Click the button to view the EazyNaijaApp."

    web_app_url = "https://eazynaijapay-app.onrender.com/"
    keyboard = [
        [InlineKeyboardButton("Open EazyNaijaApp", web_app=WebAppInfo(url=web_app_url))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(message, reply_markup=reply_markup)

def main():
    TOKEN = "8136531029:AAHlArThifhrPiOQuQv5HYi_gBpt7_XZFjA"  # Replace with your bot token

    application = ApplicationBuilder().token(TOKEN).build()

    application.add_handler(CommandHandler("start", start))

    print("Bot is running...")
    application.run_polling()


if __name__ == "__main__":
    main()
