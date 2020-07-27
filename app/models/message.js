'use strict';
/**
 * Module Dependencies
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let messageSchema = new Schema({
	messageId: {
		type: String,
		required: true,
		unique: true,
	},
	groupId: {
		type: String,
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
	senderName: {
		type: String,
		required: true,
	},
	senderId: {
		type: String,
		required: true,
	},
	createdOn: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model('message', messageSchema);
