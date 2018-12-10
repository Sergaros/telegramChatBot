'use strict'

const ACTION_ADD = 'reminder.add';
const ACTION_GET = 'reminder.get';
const ACTION_REMOVE = 'reminder.remove';
const ACTION_RECIEVED = 'reminder.recieved';

const CONFIRM = 'confirm';
const SNOOZE = 'snooze';

const DONE = 'finished!';
const NOT_UNDERSTAND = 'Sorry, I didn\'t get that. Can you rephrase?';

const DATE_TIME_FORMAT = 'YYYY/MM/DD HH:mm';

module.exports = {
	ACTION_ADD,
	ACTION_GET,
	ACTION_REMOVE,
	ACTION_RECIEVED,
	CONFIRM,
	SNOOZE,
	NOT_UNDERSTAND,
	DONE,
	DATE_TIME_FORMAT
};
