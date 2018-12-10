'use strict'

const mongoose = require('mongoose');
const config = require('../config');

//mongoose.Promise = Promise;

mongoose.connect(config.database.url,
	{ useNewUrlParser: true });

mongoose.connection
	.once('open', () => {
		console.log('Connect to DB.');
	})
	.on('error', (error) => {
		console.warn('Error', error);
	});

process.on('SIGINT', function() {
	mongoose.connection.close(function () {
		console.log('Mongoose disconnected through app termination');
		process.exit(0);
	});
});

module.exports = mongoose;
