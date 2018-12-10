'use strict'

const cron = require('node-cron');
const moment = require('moment');
const mongoose = require('./mongoose');
const Remind = require('./models/remind');
const helpers = require('./helpers');

// started tasks queue
const tasksQueue = new Map();
const currentReminder = new Map();

// run reminder task
const run = async ({_id, chat_id, name, date}) => {
	const delay = date.getTime() - Date.now();

	if(delay < 0) {
		// remove expired reminder from db
		await Remind.deleteOne({_id});
		return;
	}

	const task = setTimeout(async () => {
		// save current reminder
		currentReminder.set(chat_id, name);

		// send message to telegram
		const quickReplies = helpers.createQuickReplies([{text: 'confirm', data: 'confirm'},
			{text: 'snooze', data: 'snooze'}]);
		await helpers.sendMessage(chat_id, `You have new reminder - \n "${name}"`, quickReplies);

		// remove reminder from db
		await Remind.deleteOne({_id});

		//remove timerId from queue
		clearTimeout(task);

	}, delay);

	tasksQueue.set(_id.toString(), task);
};

// run all reminders for current hour
const runHourReminders = async () => {
	const startTime = moment().startOf('hour');
	const endTime = moment().endOf('hour');

	const reminders = await Remind.find({
		date: {
			$gte: startTime,
			$lt: endTime
		}
	});

	// Run all reminders for current hour
	for(let reminder of reminders) {
		run(reminder);
	};
};

// run main reminder check task
const start = async () => {
	runHourReminders();
	// main task check reminders for every hour
	const mainTask = cron.schedule('0 * * * *', async () => {
		await runHourReminders();
	});
};

module.exports = {
	start,
	run,
	tasksQueue,
	currentReminder
};
