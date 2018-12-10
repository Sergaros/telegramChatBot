'use strict'

const moment = require('moment');

const Remind = require('./models/remind');
const constants = require('./constants');
const helpers = require('./helpers');
const reminderService = require('./reminderService');

// Add reminder
const saveReminder = async(chat_id, parameters) => {
	const remind = new Remind({
		chat_id,
		name: parameters.name,
		date: parameters.date
	});

	const reminder = await remind.save();

	if( helpers.minutesTo(reminder.date) < 60 ) {
		reminderService.run(reminder);
	}
};


const addReminder = async (chat_id, parameters) => {
	if(new Date(parameters.date).getTime() < Date.now()) {
		parameters.date = moment().add(1, 'hour').toISOString();
	}

	await saveReminder(chat_id, parameters);

	return `Reminder "${parameters.name}" - ${moment(parameters.date).format(constants.DATE_TIME_FORMAT)} was created!`;
};

const getReminder = async (chat_id, parameters) => {

	let title = '';

	const reminders = await Remind.find(helpers.prepareQuery(chat_id, parameters))
	.sort({date: 1}).exec();

	for(let i = 0; i < reminders.length; i++) {
		const item = reminders[i];
		const date = item.date;
		title+= `${i+1}) "${item.name}" - ${moment(item.date).format(constants.DATE_TIME_FORMAT)} \n`;
	}

	if(reminders.length === 0) {
		title='You don\'t have any reminders!';
	}

	return title;
};

const removeReminder = async (chat_id, parameters) => {
	const removeQuery = helpers.prepareQuery(chat_id, parameters);
	const removeIds = await Remind.find(removeQuery).select({_id: 1}).exec();

	for(let item of removeIds) {
		const _id = item._id.toString();

		if(reminderService.tasksQueue.has(_id)) {
			const timerId = reminderService.tasksQueue.get(_id);
			clearTimeout(timerId);
			reminderService.tasksQueue.delete(timerId);
		}
	}
	const removedReminders = await Remind.deleteMany(removeQuery);

	return constants.DONE;
};

const confirmReminder = async (chat_id, parameters) => {
	let title = '';

	if(parameters.confirm === constants.CONFIRM) {
		title = constants.DONE;
	} else if(parameters.confirm === constants.SNOOZE) {
		parameters.name = reminderService.currentReminder.get(chat_id);
		parameters.date = moment().add(10, 'minutes');
		await saveReminder(chat_id, parameters);
		title = constants.DONE;
	} else {
		title = constants.NOT_UNDERSTAND;
	}

	return title;
};

module.exports = {
	addReminder,
	getReminder,
	removeReminder,
	confirmReminder
}
