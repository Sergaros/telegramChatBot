const assert = require('assert');
const Remind = require('../libs/models/remind');

describe('Updating reminders', () => {

	let remind1;

	beforeEach((done) => {
		remind1 = new Remind({
			chat_id: 1,
			name: 'Yoga',
			date: new Date()
		});

		remind1.save()
			.then(() => {
				done();
			});
	})

	it('Update reminder by id', (done) => {
		Remind.updateOne({ _id: remind1._id }, { name: 'new_name'})
			.then(result => {
				Remind.findOne({ _id:remind1._id })
					.then(result => {
						assert(result.name === 'new_name');
						done();
					});
			})
			.catch(err=> {
				console.log('error - ', error);
			});

	});
})
