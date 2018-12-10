const assert = require('assert');
const Remind = require('../libs/models/remind');

describe('Deleteing reminders out of database', () => {

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
    });

    it('Delete all reminders', (done) => {
        Remind.deleteMany({})
            .then(result => {
                assert(result.n === 2);

                Remind.find({})
                    .then(results => {
                        assert(results.length === 0);
                        done();
                    });

            })
            .catch(err => {
                console.log('error - ', error);
            });

    });

    it('Delete reminder by id', (done) => {
        Remind.deleteOne({ _id: remind2._id })
            .then(result => {
                assert(result.n === 1);
                Remind.findOne({ _id: remind2._id })
                    .then(result => {
                        assert(!result);
                        done();
                    });
            })
            .catch(err => {
                console.log('error - ', error);
            });

    });
});
