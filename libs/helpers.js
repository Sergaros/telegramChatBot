

const constants = require('./constants');
const moment = require('moment');
const axios = require('axios');

// Parse chatId from webhook request
const parseChatId = (data) => {
  return data.queryResult.outputContexts.length ?
    data.queryResult.outputContexts[data.queryResult.outputContexts.length - 1].parameters.telegram_chat_id : 0;
};

// Parse date from webhook request
const parseDate = (action, parameters) => {
  if (!parameters.date || typeof parameters.date === 'string') {
    return;
  }

  if (parameters.date.date_time) {
    parameters.date = parameters.date.date_time;

  } else if (parameters.date.startDate && parameters.date.endDate) {
    if (action === constants.ACTION_ADD) {
      parameters.date = parameters.date.startDate;
    } else if (action === constants.ACTION_GET || action === constants.ACTION_REMOVE) {
      parameters.startDate = parameters.date.startDate;
      parameters.endDate = parameters.date.endDate;
      delete parameters.date;
    }
  }
};

// Create query for db request
const prepareQuery = (chatId, parameters) => {

  const query = { chatId };

  if (parameters.name) {
    query.$text = { $search: parameters.name };
  }

  if (parameters.date) {
    query.date = {
      $gte: moment(parameters.date).startOf('day')
        .toDate(),
      $lt: moment(parameters.date).endOf('day')
        .toDate()
    };
  } else if (parameters.startDate && parameters.endDate) {
    query.date = {
      $gte: moment(parameters.startDate).startOf('day')
        .toDate(),
      $lt: moment(parameters.endDate).endOf('day')
        .toDate()
    };
  }

  return query;
};

// Create response object to Dialogflow webhook
const createResponseMessage = (text, quickReplies = []) => {
  const response = {
    source: 'webhook-reminder-bot'
  };

  if (quickReplies.length) {
    response.fulfillmentMessages = [];
    response.fulfillmentMessages.push({
      'quickReplies': {
        'title': text,
        'quickReplies': quickReplies
      },
      'platform': 'TELEGRAM'
    });
  } else {
    response.fulfillmentText = text;
  }

  return response;
};


// Get difference between dates in minutes
const minutesTo = (date) => {
  return Math.floor((date.getTime() - Date.now()) / 60000);
};

// Create quick replies data
const createQuickReplies = (data) => {
  const result = { inline_keyboard: []};

  const keys = [];

  for (const item of data) {
    keys.push({
      text: item.text,
      callback_data: item.data,
      hide: false
    });
  }

  result.inline_keyboard.push(keys);

  return result;
};

// Send message to telegram chat
const sendMessage = async (chatId, text, quickReplies) => {
  try {
    await axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      params: {
        chat_id: chatId,
        text,
        reply_markup: JSON.stringify(quickReplies)
      }
    });
  } catch (err) {
    console.log(`Error: ${err}`);
  };
};

module.exports = {
  parseChatId,
  parseDate,
  prepareQuery,
  createResponseMessage,
  minutesTo,
  createQuickReplies,
  sendMessage
};
