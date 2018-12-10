const assert = require('assert');
const Remind = require('../libs/models/remind');

describe('Reading reminders out of database', () => {

	let remind1;
	let remind2;

	beforeEach((done) => {
		remind1 = new Remind({
			chat_id: 1,
			name: 'Yoga',
			date: new Date()
		});

		remind2 = new Remind({
			chat_id: 2,
			name: 'Shopping',
			date: new Date()
		});

		Promise.all([remind1.save(), remind2.save()])
			.then(() => {
				done();
			});
	})

	it('Get all reminders', (done) => {
		Remind.find()
			.then(results => {
				assert(results.length === 2);
				done();
			})
			.catch(err=> {
				console.log('error - ', error);
			});

	});

	it('Find reminder with specific name', (done) => {
		Remind.findOne({name: 'Yoga'})
			.then(({name, chat_id, _id}) => {
				assert(name === 'Yoga');
				assert(chat_id === 1);
				assert(remind1._id.toString() === _id.toString());
				done();
			})
			.catch(err=> {
				console.log('error - ', error);
			});

	});
})
