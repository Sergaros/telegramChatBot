

const mongoose = require('mongoose');
const config = require('../config');

//Mongoose.Promise = Promise;

mongoose.connect(process.env.DB_URL,
    { useNewUrlParser: true });

mongoose.connection
    .once('open', () => {
        console.log('Connect to DB.');
    })
    .on('error', (error) => {
        console.warn('Error', error);
    });

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

module.exports = mongoose;
