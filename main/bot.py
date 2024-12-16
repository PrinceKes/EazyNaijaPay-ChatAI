from telegram import Update, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    message = "You are on the test mode for now, click the button to view the EazyNaijaApp"

    web_app_url = "https://eazynaijapay-app.onrender.com/"
    keyboard = [[InlineKeyboardButton("Open EazyNaijaApp", web_app=WebAppInfo(url=web_app_url))]]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(message, reply_markup=reply_markup)

def main():
    application = ApplicationBuilder().token("8136531029:AAHlArThifhrPiOQuQv5HYi_gBpt7_XZFjA").build()

    application.add_handler(CommandHandler("start", start))

    application.run_polling()

if __name__ == "__main__":
    main()
