

const express = require('express');
const bodyParser = require('body-parser');

// Connect to db
require('./libs/mongoose');

const constants = require('./libs/constants');
const helpers = require('./libs/helpers');
const reminderService = require('./libs/reminderService');

const handlers = require('./libs/handlers');

reminderService.start();

const app = express();

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
  res.send('Telegram reminder bot.');
});

app.post('/webhook', async (req, res) => {

  let title = '';
  const quickReplies = ['new reminder', 'show reminders', 'remove reminders'];

  try {

    if (req.body.queryResult) {
      const parameters = req.body.queryResult.parameters;
      const action = req.body.queryResult.action;
      const chatId = helpers.parseChatId(req.body);

      helpers.parseDate(action, parameters);

      switch (action) {
      case constants.ACTION_ADD:
        title = await handlers.addReminder(chatId, parameters);
        break;

      case constants.ACTION_GET:
        title = await handlers.getReminder(chatId, parameters);
        break;

      case constants.ACTION_REMOVE:
        title = await handlers.removeReminder(chatId, parameters);
        break;

      case constants.ACTION_RECIEVED:
        title = await handlers.confirmReminder(chatId, parameters);
        break;
      default:
        title = constants.NOT_UNDERSTAND;
        console.log('Undefined action!');
      }
    }

  } catch (error) {
    console.log(`Error: ${err}`);
  }

  return res.json(helpers.createResponseMessage(title, quickReplies));

});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server up and listening');
});
