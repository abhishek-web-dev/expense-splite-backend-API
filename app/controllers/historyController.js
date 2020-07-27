const mongoose = require('mongoose');
const response = require('../libs/responseLib');
const logger = require('../libs/loggerLib');
const check = require('../libs/checkLib');


/* Models */
//const queryModel = mongoose.model('query');
const historyModel = mongoose.model('history');

/**
 * function to get ten notification.
 */
let getTenHistoryFunction = (req, res) => {
	if (check.isEmpty(req.body.expenseId)) {
		logger.error(
			'userId Field is Missing ',
			'notificationController: getTenNotificationFunction()',
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
		historyModel
			.find({ expenseId: req.body.expenseId })
			.select('-__v -_id ')
			.sort({ createdOn: -1 })
			.skip(req.body.skip)
			.limit(10)
			.lean()
			.exec((err, result) => {
				if (err) {
					logger.error(
						err.message,
						'notificationController: getTenNotificationFunction()',
						10
					);
					let apiResponse = response.generate(
						true,
						'Failed To Find Ten History',
						500,
						null
					);
					res.send(apiResponse);
				} else if (check.isEmpty(result)) {
					logger.info(
						'No Notification Found!',
						'notificationController: getTenNotificationFunction()'
					);
					let apiResponse = response.generate(
						true,
						'No History Found!',
						404,
						[]
					);
					res.send(apiResponse);
				} else {
					let apiResponse = response.generate(
						false,
						'Ten History Found!',
						200,
						result
					);
					res.send(apiResponse);
				}
			});
	}
}; 
// end get ten notification


module.exports = {
	getTenHistoryFunction: getTenHistoryFunction
}; 
//end exports
