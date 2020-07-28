// modules dependencies.
const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const logger = require('./loggerLib.js');
const events = require('events');
const time = require('./timeLib.js');
const sendEmail = require('./email');

// event emmiter
const updateEventEmitter = new events.EventEmitter();
const deleteEventEmitter = new events.EventEmitter();

/* Models */
const expenseModel = mongoose.model('expense');
const historyModel = mongoose.model('history');
const usersModel = mongoose.model('userdetails');

let setServer = (server) => {
	let io = socketio.listen(server);

	let myIo = io.of('/expense');

	myIo.on('connection', (socket) => {
		// update expense event
		socket.on('expense-update', (data) => {
			let onecopydata = { message: data.message };

			temp1 = [...data.contributer, ...data.distributer];
			for (let i = 0; i < temp1.length; i++) {
				for (let j = i + 1; j < temp1.length; j++) {
					if (temp1[i].userId == temp1[j].userId) {
						temp1.splice(j, 1);
						break;
					}
				}
			}
			// call event emitter to update expense
			updateEventEmitter.emit('update-expense', data);

			// emit notification to all person
			if (temp1.length) {
				temp1.map((item) => {
					myIo.emit(item.userId, onecopydata);

					// send email notification
					// repeat with the interval of 2 seconds
					setTimeout(() => {
						usersModel.findOne({ userId: item.userId }, (err, result) => {
							if (err) {
								console.log(err);
							} else {
								// send email notification
								let message = `<p>Hi ${result.name},</p> </br>
                                              <p> ${onecopydata.message}.</p></br>
                                              <p>Thanks,</p><br>
                                              <p>Expense Splitter Team!</p>`;
								sendEmail.sendEmailFunction(
									result.email,
									`${data.ename} Expense has updated by ${data.updatedByName}`,
									message
								);
							}
						});
					}, 2000);
				});
			}
		});

		// delete expense
		socket.on('expense-delete', (data) => {
			let onecopydata = { message: data.message };

			// call event emitter to delete expense
			deleteEventEmitter.emit('delete-expense', data);

			// emit notification to all person
			if (data.userGetNotificationIds.length) {
				data.userGetNotificationIds.map((userId) => {
					// send email notification
					// repeat with the interval of 2 seconds
					setTimeout(() => {
						usersModel.findOne({ userId: userId }, (err, result) => {
							if (err) {
								console.log(err);
							} else {
								// send email notification
								let message = `<p>Hi ${result.name},</p> </br>
                                              <p> ${onecopydata.message}.</p></br>
                                              <p>Thanks,</p><br>
                                              <p>Expense Splitter Team!</p>`;
								sendEmail.sendEmailFunction(
									result.email,
									`${data.ename} Expense has deleted by ${data.updatedByName}`,
									message
								);
							}
						});
					}, 2000);
					// emit real-time notification
					myIo.emit(userId, onecopydata);
				});
			}
		});
	});
};

// database operations are kept outside of socket.io code.
// updating expense to database.
updateEventEmitter.on('update-expense', (data) => {
	let message = data.message;
	delete data.message;
	data.updatedOn = time.getLocalTime();

	expenseModel.findOneAndUpdate(
		{ expenseId: data.expenseId },
		{ $set: data },
		(err, result) => {
			if (err) {
				logger.error(err.message, 'queryController: updateQuery()', 10);
			} else {
				let newhistory = new historyModel({
					historyId: shortid.generate(),
					expenseId: data.expenseId,
					message: message,
					createdOn: time.getLocalTime(),
				});

				newhistory.save((err, result) => {
					if (err) {
						logger.error(err.message, 'queryController: updateQuery()', 5);
					}
				});
			}
		}
	);
}); // end of updating expense.

// updating expense to database.
deleteEventEmitter.on('delete-expense', (data) => {
	// delete all expense history
	historyModel.deleteMany({ expenseId: data.expenseId }, (err, result) => {
		if (err) {
			console.log(err);
		}
	});

	// delete one expense
	expenseModel.deleteOne({ expenseId: data.expenseId }, (err, result) => {
		if (err) {
			console.log(err);
		}
	});
}); // end of updating expense.

module.exports = {
	setServer: setServer,
};
