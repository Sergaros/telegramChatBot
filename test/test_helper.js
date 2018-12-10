const mongoose = require('../libs/mongoose');

beforeEach((done) => {
    // Drop collection
    mongoose.connection.collections.reminds.drop(() => {
        done();
    });
});
