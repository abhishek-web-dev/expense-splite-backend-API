'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historySchema = new Schema({
	historyId: {
		type: String,
		required: true,
		index: true,
	},
	expenseId: {
		type: String,
		required: true
	},
	message: {
		type: String,
	},
	
	createdOn: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model('history', historySchema);


