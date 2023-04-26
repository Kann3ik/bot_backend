const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '6250482526:AAE78h917mtdqTGx6IWmV1k6FtuA69_s7AU';
const webAppUrl = 'https://ya.ru';

const bot = new TelegramBot(TOKEN, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    await bot.sendMessage(chatId, 'Добрый день! Пожалуйста, заполните форму обратной связи', {
      reply_markup: {
        keyboard: [
          [{ text: 'Оставить заявку', web_app: { url: webAppUrl } }]
        ]
      }
    });

    await bot.sendMessage(chatId, 'Добрый день! Пожалуйста, заполните форму обратной связи', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Оставить заявку', web_app: { url: webAppUrl } }]
        ]
      }
    });
  }

});