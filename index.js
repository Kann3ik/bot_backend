const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const PORT = 8000;
const TOKEN = '6250482526:AAE78h917mtdqTGx6IWmV1k6FtuA69_s7AU';
const LiveCall = 'https://307b-46-183-179-54.ngrok-free.app';

const bot = new TelegramBot(TOKEN, { polling: true });
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    await bot.sendMessage(chatId, 'Добрый день! Пожалуйста, заполните форму обратной связи', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Оставить заявку', web_app: { url: LiveCall } }]
        ]
      }
    });
  }
});

app.post('/submit', async (req, res) => {
  const { queryId, formData, userId } = req.body;

  try {
    const link = await generateUrl(formData);

    if (link?.error) {
      await answerWebApp(queryId, 'article', 'Произошла ошибка при формировании ссылки!', link.error?.message)
      return res.status(500).send({ message: 'Ссылка не была сформирована', status: 200, error: link.error });
    } else {
      await answerWebApp(queryId, 'article', 'Ссылка на звонок была сформирована успешно!', link?.data?.url)
      return res.status(200).send({ message: 'Заявка успешно сформирована', status: 200 });
    }
  } catch (e) {
    return res.status(500).send({ message: 'Произошла непредвиденная ошибка', status: 500 });
  }
})

app.listen(PORT, () => {
  console.log('Server started on PORT ' + PORT);
})

const generateUrl = async (data) => {
  const link = 'https://prod-71.westeurope.logic.azure.com:443/workflows/5971f12a34fa4e679a8fd0ca6cd43a48/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ceepn_ABgMz6qpoIwZ_IKXaqRFoshzJUHaC_N8yGtOQ';
  const sendData = {
    name: data.name,
    phone: data.phone,
    email: data.email,
    message: data.text,
  };

  try {
    const response = await fetch(link, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'dataType': 'json'
      },
      body: JSON.stringify(sendData)
    });
    const data = await response.json();
    return data;
  } catch (err) {
    return err;
  }
}

/**
* Отвечает на запрос веб-приложения.
* @param {string} type - Тип ответа.
* @param {string} title - Заголовок ответа.
* @param {string} message_text - Текст ответа.
*/
const answerWebApp = async (queryId, type, title, message_text) => {
  if (!type || !title || !message_text) return;

  await bot.answerWebAppQuery(queryId, {
    type: type,
    id: queryId,
    title: title,
    input_message_content: {
      message_text: message_text
    }
  });
}