const mongoose = require('../mongoose');
const Schema = mongoose.Schema;

const remindSchema = new Schema({
	chat_id: {
		type: Schema.Types.Number,
		require: true
	},
    name:{
        type: Schema.Types.String,
        require: true
    },
	date:{
		type: Schema.Types.Date,
		require: true
	}
});
remindSchema.index({name: 'text', 'name': 'text'});

module.exports = mongoose.model('remind', remindSchema);
