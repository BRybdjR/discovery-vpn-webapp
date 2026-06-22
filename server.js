const express = require('express');
const { Telegraf } = require('telegraf');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up Telegraf bot if token is provided
if (process.env.BOT_TOKEN) {
  const bot = new Telegraf(process.env.BOT_TOKEN);

  bot.start((ctx) => {
    // Replace WEB_APP_URL with your actual web app URL or a ngrok url for local testing
    const webAppUrl = process.env.WEB_APP_URL || `https://example.com`;

    ctx.reply('Welcome to the Premium VPN Service!', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Open VPN App', web_app: { url: webAppUrl } }]
        ]
      }
    });
  });

  bot.launch();

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  console.log('Telegraf bot is running...');
} else {
  console.log('BOT_TOKEN not found in environment. Telegraf bot is not running.');
}

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
