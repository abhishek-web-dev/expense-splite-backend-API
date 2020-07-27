const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('../libs/timeLib');
const response = require('../libs/responseLib');
const logger = require('../libs/loggerLib');
const check = require('../libs/checkLib');


/* Models */
const groupModel = mongoose.model('group');
const expenseModel = mongoose.model('expense');
const historyModel = mongoose.model('history');
const messageModel = mongoose.model('message');

// start create group function
let creatGroupFunction = (req, res) => {
	let validateUserInput = () => {
		return new Promise((resolve, reject) => {
			if (
				check.isEmpty(req.body.gname) ||
				check.isEmpty(req.body.creatorName) ||
				check.isEmpty(req.body.creatorId) ||
				check.isEmpty(req.body.groupMemberIds)
			) {
				let apiResponse = response.generate(
					true,
					'Field Missing During Query Creation',
					400,
					null
				);
				reject(apiResponse);
			} else {
				resolve(req);
			}
		});
	}; // end validate user input

	let createGroup = () => {
		return new Promise((resolve, reject) => {
			let newGroup = new groupModel({
				groupId: shortid.generate(),
				gname: req.body.gname,
				creatorId: req.body.creatorId,
				creatorName: req.body.creatorName,
				groupMemberIds: req.body.groupMemberIds,
				createdOn: time.getLocalTime(),
			});

			newGroup.save((err, result) => {
				if (err) {
					logger.error(
						err.message,
						'queryController: creatQueryFunction()-->createQuery()',
						5
					);
					let apiResponse = response.generate(
						true,
						'Failed to create new Group',
						500,
						null
					);
					reject(apiResponse);
				} else {
					resolve(result);
				}
			});
		});
	}; // end create user function

	validateUserInput(req, res)
		.then(createGroup)
		.then((result) => {
			let apiResponse = response.generate(false, 'Group created!', 200, result);
			res.send(apiResponse);
		})
		.catch((err) => {
			logger.error(err.message, 'queryController: creatQueryFunction()', 5);
			let apiResponse = response.generate(true, err.message, err.status, {});
			res.send(apiResponse);
		});
}; // end create group function

// start editGroupFunction
let editGroupFunction = (req, res) => {
	let updateGroup = (req) => {
		return new Promise((resolve, reject) => {
			groupModel.findOneAndUpdate(
				{ groupId: req.body.groupId },
				{ $set: req.body },
				{ new: true },
				(err, result) => {
					if (err) {
						logger.error(err.message, 'queryController: updateQuery()', 10);
						let apiResponse = response.generate(
							true,
							'Failed to update query',
							500,
							null
						);
						reject(apiResponse);
					} else {
						resolve(result);
					}
				}
			);
		});
	};

	updateGroup(req, res)
		.then((resolve) => {
			let apiResponse = response.generate(
				false,
				'Group has updated successfully!',
				200,
				resolve
			);
			res.send(apiResponse);
		})
		.catch((err) => {
			logger.error(err.message, 'queryController: updateQuery()', 5);
			let apiResponse = response.generate(true, err.message, err.status, {});
			res.send(apiResponse);
		});
};
// end edit Group Function

//function to get all querys.
let getTenGroupsFunction = (req, res) => {
	groupModel
		.find({ 'groupMemberIds.userId': req.body.userId })
		.select('-__v -_id -groupMemberIds -createdOn -creatorId')
		.sort({ gname: 1 })
		.skip(req.body.skip)
		.limit(10)
		.lean()
		.exec((err, result) => {
			if (err) {
				logger.error(err.message, 'queryController: getAllQueryFunction()', 10);
				let apiResponse = response.generate(
					true,
					'Failed To Find Ten Group',
					500,
					null
				);
				res.send(apiResponse);
			} else if (check.isEmpty(result)) {
				logger.info('No Query Found', 'queryController: getAllQueryFunction()');
				let apiResponse = response.generate(true, 'No Group Found!', 200, []);
				res.send(apiResponse);
			} else {
				let apiResponse = response.generate(
					false,
					'Ten Groups Found!',
					200,
					result
				);
				res.send(apiResponse);
			}
		});
}; // end get ten groups

// function to get one querys.
let getOneGroupDetailsFunction = (req, res) => {
	if (check.isEmpty(req.body.groupId)) {
		logger.error(
			'QueryId Field is Missing ',
			'queryController: getOneQueryFunction()',
			5
		);
		let apiResponse = response.generate(
			true,
			'some parameter is missing!',
			400,
			null
		);
		res.send(apiResponse);
	} else {
		groupModel
			.find({ groupId: req.body.groupId })
			.select('-__v -_id ')
			.lean()
			.exec((err, result) => {
				if (err) {
					logger.error(
						err.message,
						'queryController: getOneQueryFunction()',
						10
					);
					let apiResponse = response.generate(
						true,
						'Failed To Find query',
						500,
						null
					);
					res.send(apiResponse);
				} else if (check.isEmpty(result)) {
					logger.info(
						'No Query Found',
						'queryController: getOneQueryFunction()'
					);
					let apiResponse = response.generate(true, 'No Group Found!', 404, []);
					res.send(apiResponse);
				} else {
					let apiResponse = response.generate(
						false,
						'Group Found!',
						200,
						result
					);
					res.send(apiResponse);
				}
			});
	}
};
// end get one group

// function to delete group.
let deleteGroupFunction = (req, res) => {
	let allExpenseIds = [];
	let groupId = req.body.groupId;

	let validateUserInput = (req) => {
		return new Promise((resolve, reject) => {
			if (check.isEmpty(req.body.groupId)) {
				let apiResponse = response.generate(
					true,
					'Field Missing During Group deletion',
					400,
					null
				);
				reject(apiResponse);
			} else {
				expenseModel
					.find({ groupId: req.body.groupId })
					.select('-__v -_id   ')
					.lean()
					.exec((err, result) => {
						if (err) {
							logger.error(
								err.message,
								'queryController: validateUserInput()',
								10
							);
							let apiResponse = response.generate(
								true,
								'Invalid parameter!',
								500,
								null
							);
							res.send(apiResponse);
						} else {
							if (check.isEmpty(result)) {
								resolve(req);
							} else {
								result.map((item) => {
									allExpenseIds.push(item.expenseId);
								});
								//allExpensesDetails = result;
								console.log('all exp id--', allExpenseIds);
								resolve(allExpenseIds);
							}
						}
					});
			}
		});
	}; // end validate user input

	let deleteAllHistory = (req) => {
		return new Promise((resolve, reject) => {
			historyModel.deleteMany(
				{ expenseId: { $in: allExpenseIds } },
				(err, result) => {
					if (err) {
						logger.error(err.message, 'queryController: deleteQuery()', 10);
						let apiResponse = response.generate(
							true,
							'Failed To Delete History',
							500,
							null
						);
						res.send(apiResponse);
					} else {
						resolve(req);
					}
				}
			);
		});
	};

	let deleteAllExpense = (req) => {
		return new Promise((resolve, reject) => {
			expenseModel.deleteMany(
				{ expenseId: { $in: allExpenseIds } },
				(err, result) => {
					if (err) {
						logger.error(
							err.message,
							'queryController: deleteAllMessage()',
							10
						);
						let apiResponse = response.generate(
							true,
							'Failed To Delete Expense',
							500,
							null
						);
						reject(apiResponse);
					} else {
						resolve(req);
					}
				}
			);
		});
	};

	let deleteAllGroupMessage = (req) => {
		return new Promise((resolve, reject) => {
			messageModel.deleteMany({ groupId: groupId }, (err, result) => {
				if (err) {
					logger.error(err.message, 'queryController: deleteAllMessage()', 10);
					let apiResponse = response.generate(
						true,
						'Failed To Delete all Group Message.',
						500,
						null
					);
					reject(apiResponse);
				} else {
					resolve(req);
				}
			});
		});
	};

	let deleteGroup = (req) => {
		return new Promise((resolve, reject) => {
			groupModel.deleteOne({ groupId: groupId }, (err, result) => {
				if (err) {
					logger.error(err.message, 'queryController: deleteAllMessage()', 10);
					let apiResponse = response.generate(
						true,
						'Failed To Delete Group.',
						500,
						null
					);
					reject(apiResponse);
				} else {
					resolve(req);
				}
			});
		});
	};

	validateUserInput(req, res)
		.then(deleteAllHistory)
		.then(deleteAllExpense)
		.then(deleteAllGroupMessage)
		.then(deleteGroup)
		.then((resolve) => {
			let apiResponse = response.generate(
				false,
				'Group has deleted successfully!',
				200,
				{}
			);
			res.send(apiResponse);
		})
		.catch((err) => {
			console.log(err);
			let apiResponse = response.generate(true, err.message, err.status, {});
			res.send(apiResponse);
		});
};
// end delete  group

module.exports = {
	creatGroupFunction: creatGroupFunction,
	getTenGroupsFunction: getTenGroupsFunction,
	getOneGroupDetailsFunction: getOneGroupDetailsFunction,
	editGroupFunction: editGroupFunction,
	deleteGroupFunction: deleteGroupFunction,
}; // end exports
