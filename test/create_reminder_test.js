const assert = require('assert');
const Remind = require('../libs/models/remind');

describe('Creating reminders', () => {
    it('saves a reminder', (done) => {
        const date = new Date();
        const remind1 = new Remind({
            chat_id: 1,
            name: 'Yoga',
		 	date
        });

        remind1.save()
            .then(({ _id }) => {
                // Has remind1 been saved
                assert(!remind1.isNew);

                Remind.findOne({ _id })
                    .then(({ name, date, chat_id }) => {
                        assert(name === 'Yoga');
                        assert(date.getTime() === date.getTime());
                        assert(chat_id === 1);
                        done();
                    });
            })
            .catch(err => {
                console.log('error - ', error);
            });

    });
});
