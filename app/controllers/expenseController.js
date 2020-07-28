const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('../libs/timeLib');
const response = require('../libs/responseLib');
const logger = require('../libs/loggerLib');
const check = require('../libs/checkLib');

/* Models */
const expenseModel = mongoose.model('expense');
const historyModel = mongoose.model('history');

// start create expense function
let createExpenseFunction = (req, res) => {
	let validateUserInput = () => {
		return new Promise((resolve, reject) => {
			if (
				check.isEmpty(req.body.name) ||
				check.isEmpty(req.body.creatorName) ||
				check.isEmpty(req.body.creatorId) ||
				check.isEmpty(req.body.contributer) ||
				check.isEmpty(req.body.distributer)
			) {
				let apiResponse = response.generate(
					true,
					'Field Missing During Expense Creation',
					400,
					null
				);
				reject(apiResponse);
			} else {
				resolve(req);
			}
		});
	}; // end validate user input

	let createExpense = () => {
		return new Promise((resolve, reject) => {
			let newExpense = new expenseModel({
				expenseId: shortid.generate(),
				groupId: req.body.groupId,
				ename: req.body.name,
				amount: parseInt(req.body.amount),
				creatorId: req.body.creatorId,
				creatorName: req.body.creatorName,
				updatedByName: req.body.updatedByName,
				updatedById: req.body.updatedById,
				contributer: req.body.contributer,
				distributer: req.body.distributer,
				createdOn: time.getLocalTime(),
				updatedOn: time.getLocalTime(),
			});

			newExpense.save((err, expenseresult) => {
				if (err) {
					logger.error(
						err.message,
						'expenseController: createExpenseFunction()-->createExpense()',
						5
					);
					console.log(err);
					let apiResponse = response.generate(
						true,
						'Failed to create new Expense',
						500,
						null
					);
					reject(apiResponse);
				} else {
					let message = req.body.creatorName + ' has created this Expense';
					let newHistory = new historyModel({
						historyId: shortid.generate(),
						expenseId: expenseresult.expenseId,
						message: message,
						creatorId: req.body.creatorId,
						creatorName: req.body.creatorName,
						createdOn: time.getLocalTime(),
					});

					newHistory.save((err, messageResult) => {
						if (err) {
							logger.error(
								err.message,
								'expenseController: createExpenseFunction()-->createExpense()',
								5
							);

							let apiResponse = response.generate(
								true,
								'Failed to create new History',
								500,
								null
							);
							reject(apiResponse);
						} else {
							resolve(expenseresult);
						}
					});
				}
			});
		});
	}; // end create user function

	validateUserInput(req, res)
		.then(createExpense)
		.then((result) => {
			let apiResponse = response.generate(
				false,
				'Expense created!',
				200,
				result
			);
			res.send(apiResponse);
		})
		.catch((err) => {
			logger.error(err.message, 'expenseController: catch()', 5);
			let apiResponse = response.generate(true, err.message, err.status, {});
			res.send(apiResponse);
		});
}; // end create expense function

//function to get ten expenses
let getTenExpensesFunction = (req, res) => {
	if (check.isEmpty(req.body.groupId) || check.isEmpty(req.body.skip)) {
		logger.error(
			'UserId Field is Missing ',
			'expenseController: getTenExpensesFunction()',
			5
		);
		let apiResponse = response.generate(
			true,
			'Some Faild is missing!',
			400,
			null
		);
		res.send(apiResponse);
	} else {
		expenseModel
			.find({ groupId: req.body.groupId })
			.select('-__v -_id    ')
			.sort({ createdOn: -1 })
			.skip(req.body.skip)
			.limit(10)
			.lean()
			.exec((err, result) => {
				if (err) {
					logger.error(err.message, 'expenseController: getTenExpensesFunction()', 10);
					let apiResponse = response.generate(
						true,
						'Failed to find ten expenses!',
						500,
						null
					);
					res.send(apiResponse);
				} else if (check.isEmpty(result)) {
					logger.info(
						'No Expense Found',
						'expenseController: getTenExpensesFunction()'
					);
					let apiResponse = response.generate(
						true,
						'No Expenses Found!',
						200,
						[]
					);
					res.send(apiResponse);
				} else {
					let apiResponse = response.generate(
						false,
						'Ten Expenses Found!',
						200,
						result
					);
					res.send(apiResponse);
				}
			});
	}
};
// end get ten expenses

//function to get all expenses
let getAllExpensesFunction = (req, res) => {
	if (check.isEmpty(req.body.groupId)) {
		logger.error(
			'groupId Field is Missing ',
			'expenseController: getAllExpensesFunction()',
			5
		);
		let apiResponse = response.generate(
			true,
			'Some Faild is missing!',
			400,
			null
		);
		res.send(apiResponse);
	} else {
		expenseModel
			.find({ groupId: req.body.groupId })
			.select('-__v -_id    ')
			.lean()
			.exec((err, result) => {
				if (err) {
					logger.error(err.message, 'expenseController: getAllExpensesFunction()', 10);
					let apiResponse = response.generate(
						true,
						'Failed to find all expenses!',
						500,
						null
					);
					res.send(apiResponse);
				} else if (check.isEmpty(result)) {
					logger.info(
						'No Expense Found',
						'expenseController: getAllExpensesFunction()'
					);
					let apiResponse = response.generate(
						true,
						'No Expenses Found!',
						404,
						[]
					);
					res.send(apiResponse);
				} else {
					let apiResponse = response.generate(
						false,
						'All Expenses Found!',
						200,
						result
					);
					res.send(apiResponse);
				}
			});
	}
};
// end function to get all expenses

// function to get one expense
let getOneExpenseDetailsFunction = (req, res) => {
	if (check.isEmpty(req.body.expenseId)) {
		logger.error(
			'expenseId Field is Missing ',
			'expenseController: getOneExpenseDetailsFunction()',
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
		expenseModel
			.find({ expenseId: req.body.expenseId })
			.select('-__v -_id ')
			.lean()
			.exec((err, result) => {
				if (err) {
					logger.error(
						err.message,
						'expenseController: getOneExpenseDetailsFunction()',
						10
					);
					let apiResponse = response.generate(
						true,
						'Failed To Find expense',
						500,
						null
					);
					res.send(apiResponse);
				} else if (check.isEmpty(result)) {
					logger.info(
						'No Expense Found',
						'expenseController: getOneExpenseDetailsFunction()'
					);
					let apiResponse = response.generate(
						true,
						'No Expense Found!',
						404,
						null
					);
					res.send(apiResponse);
				} else {
					let apiResponse = response.generate(
						false,
						'Expense Found!',
						200,
						result
					);
					res.send(apiResponse);
				}
			});
	}
};
// end get one expense

module.exports = {
	createExpenseFunction: createExpenseFunction,
	getTenExpensesFunction: getTenExpensesFunction,
	getOneExpenseDetailsFunction: getOneExpenseDetailsFunction,
	getAllExpensesFunction: getAllExpensesFunction,
};
