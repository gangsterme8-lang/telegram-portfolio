require("dotenv").config();

const express = require("express");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL;

if (!BOT_TOKEN) {
  console.error("BOT_TOKEN topilmadi. .env faylni tekshir.");
  process.exit(1);
}

if (!WEBAPP_URL) {
  console.error("WEBAPP_URL topilmadi. .env faylni tekshir.");
  process.exit(1);
}

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    await bot.sendMessage(
      chatId,
      "Portfolio sahifasini ochish uchun tugmani bosing:",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Open Portfolio",
                web_app: {
                  url: WEBAPP_URL
                }
              }
            ]
          ]
        }
      }
    );
  } catch (error) {
    console.error("Start komandada xato:", error.message);
  }
});

bot.on("message", async (msg) => {
  if (msg.web_app_data?.data) {
    try {
      const data = JSON.parse(msg.web_app_data.data);

      await bot.sendMessage(
        msg.chat.id,
        `Web App dan ma'lumot keldi:\n${JSON.stringify(data, null, 2)}`
      );
    } catch (error) {
      await bot.sendMessage(
        msg.chat.id,
        `Web App dan text keldi:\n${msg.web_app_data.data}`
      );
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server ishga tushdi: http://localhost:${PORT}`);
  console.log("Telegram bot polling rejimida ishlayapti.");
});
