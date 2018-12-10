

const cron = require('node-cron');
const moment = require('moment');
const Remind = require('./models/remind');
const helpers = require('./helpers');

// Started tasks queue
const tasksQueue = new Map();
const currentReminder = new Map();

// Run reminder task
const run = async ({ _id, chatId, name, date }) => {
    const delay = date.getTime() - Date.now();

    if (delay < 0) {
        // Remove expired reminder from db
        await Remind.deleteOne({ _id });

        return;
    }

    const task = setTimeout(async () => {
        // Save current reminder
        currentReminder.set(chatId, name);

        // Send message to telegram
        const quickReplies = helpers.createQuickReplies([{ text: 'confirm',
            data: 'confirm' },
        { text: 'snooze',
            data: 'snooze' }]);

        await helpers.sendMessage(chatId, `You have new reminder - \n "${name}"`, quickReplies);

        // Remove reminder from db
        await Remind.deleteOne({ _id });

        //Remove timerId from queue
        clearTimeout(task);

    }, delay);

    tasksQueue.set(_id.toString(), task);
};

// Run all reminders for current hour
const runHourReminders = async () => {
    const startTime = moment();
    const endTime = moment().add(1, 'minute');

    const reminders = await Remind.find({
        date: {
            $gte: startTime,
            $lt: endTime
        }
    });

    // Run all reminders for current hour
    for (const reminder of reminders) {
        run(reminder);
    }
};

// Run main reminder check task
const start = async () => {
    runHourReminders();
    // Check available tasks every minute
    cron.schedule('* * * * *', async () => {
        await runHourReminders();
    });
};

module.exports = {
    start,
    run,
    tasksQueue,
    currentReminder
};
