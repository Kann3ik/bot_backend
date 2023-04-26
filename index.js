const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '6250482526:AAE78h917mtdqTGx6IWmV1k6FtuA69_s7AU';
const webAppUrl = 'https://ya.ru';
// приложение с локального хоста можно запускать через ngrok
const webAppUrl2 = 'https://aec1-46-183-179-54.ngrok-free.app';
const LiveCall = 'https://export.inxrm.ru:44382/dev/TestPages/LiveCall-v2.html?Data=123';
// https://export.inxrm.ru:44382/dev/TestPages/LiveCall-v2.html

// сделать форму на подобии liveCall с получением идентификатора пользователя из ТГ 

const bot = new TelegramBot(TOKEN, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    await bot.sendMessage(chatId, 'Добрый день! Пожалуйста, заполните форму обратной связи', {
      reply_markup: {
        keyboard: [
          [{ text: 'LiveCall', web_app: { url: LiveCall } }]
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