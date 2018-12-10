'use strict'

const express = require('express');
const moment = require('moment');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');

// connect to db
const mongoose = require('./libs/mongoose');

const constants = require('./libs/constants');
const helpers = require('./libs/helpers');
const reminderService = require('./libs/reminderService');
const config = require('./config');

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

// routes
app.get("/", function(req, res) {
	res.send('Telegram reminder bot.');
});

app.post("/webhook", async function(req, res) {

  try{
	  let title = '';
	  let quickReplies = ['new reminder', 'show reminders', 'remove reminders'];

	  if(req.body.queryResult) {
		  const parameters = req.body.queryResult.parameters;
		  const action = req.body.queryResult.action;
		  const chat_id = helpers.parseChatId(req.body);

		  helpers.parseDate(action, parameters);

		  switch (action) {
		  	case constants.ACTION_ADD:
				title = await handlers.addReminder(chat_id, parameters);
		  		break;

			case constants.ACTION_GET:
				title = await handlers.getReminder(chat_id, parameters);
				break;

			case constants.ACTION_REMOVE:
				title = await handlers.removeReminder(chat_id, parameters);
				break;

			case constants.ACTION_RECIEVED:
				title = await handlers.confirmReminder(chat_id, parameters);
				break;
		  	default:
				title = constants.NOT_UNDERSTAND;
		  		console.log('Undefined action!');
		  }
	  }

	  return res.json(helpers.createResponseMessage(title, quickReplies));

  } catch (error) {
	  console.log('Error - ', error);
  }

});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server up and listening");
});
