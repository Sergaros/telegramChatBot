

module.exports = {
  telegram: {
    token: process.env.BOT_TOKEN ? process.env.BOT_TOKEN : '796868255:AAHASnGAkr8IDFIwQ0PlJrSDEnvBw1PWOoI'
  },
  database: {
    url: process.env.DB_URL ? process.env.DB_URL : 'mongodb://reminder:newandbetter12345678@ds127634.mlab.com:27634/reminders'
  }
};
