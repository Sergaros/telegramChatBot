

const moment = require('moment');

const Remind = require('./models/remind');
const constants = require('./constants');
const helpers = require('./helpers');
const reminderService = require('./reminderService');

// Add reminder
const saveReminder = async (chatId, parameters) => {
    const remind = new Remind({
        chatId,
        name: parameters.name,
        date: parameters.date
    });

    const reminder = await remind.save();

    /*if (helpers.minutesTo(reminder.date) <= 1) {
        reminderService.run(reminder);
    }*/
};


const addReminder = async (chatId, parameters) => {
    if (new Date(parameters.date).getTime() < Date.now()) {
        parameters.date = moment().add(1, 'hour')
            .toISOString();
    }

    await saveReminder(chatId, parameters);

    return `Reminder "${parameters.name}" - ${moment(parameters.date).add(2, 'hours')
        .format(constants.DATE_TIME_FORMAT)} was created!`;
};

const getReminder = async (chatId, parameters) => {

    let title = '';

    const reminders = await Remind.find(helpers.prepareQuery(chatId, parameters))
        .sort({ date: 1 })
        .exec();

    for (let i = 0; i < reminders.length; i++) {
        const item = reminders[i];

        title += `${i + 1}) "${item.name}" - ${moment(item.date).add(2, 'hours')
            .format(constants.DATE_TIME_FORMAT)} \n`;
    }

    if (reminders.length === 0) {
        title = 'You don\'t have any reminders!';
    }

    return title;
};

const removeReminder = async (chatId, parameters) => {
    const removeQuery = helpers.prepareQuery(chatId, parameters);
    const removeIds = await Remind.find(removeQuery).select({ _id: 1 })
        .exec();

    for (const item of removeIds) {
        const _id = item._id.toString();

        if (reminderService.tasksQueue.has(_id)) {
            const timerId = reminderService.tasksQueue.get(_id);

            clearTimeout(timerId);
            reminderService.tasksQueue.delete(timerId);
        }
    }
    await Remind.deleteMany(removeQuery);

    return constants.DONE;
};

const confirmReminder = async (chatId, parameters) => {
    let title = '';

    if (parameters.confirm === constants.CONFIRM) {
        title = constants.DONE;
    } else if (parameters.confirm === constants.SNOOZE) {
        parameters.name = reminderService.currentReminder.get(chatId);
        parameters.date = moment().add(10, 'minutes');
        await saveReminder(chatId, parameters);
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
};
