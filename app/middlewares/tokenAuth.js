const mongoose = require('mongoose');
const logger = require('./../libs/loggerLib');
const responseLib = require('./../libs/responseLib');
const token = require('./../libs/tokenLib');
const check = require('./../libs/checkLib');

// model
const loginModel = mongoose.model('login');

let isAuthorized = (req, res, next) => {
	if (req.body.authToken) {
		loginModel.findOne(
			{
				authToken: req.body.authToken,
			},
			(err, authDetails) => {
				if (err) {
					logger.error(err.message, 'AuthorizationMiddleware', 10);
					let apiResponse = responseLib.generate(
						true,
						'Failed To Authorized',
						500,
						null
					);
					res.send(apiResponse);
				} else if (check.isEmpty(authDetails)) {
					logger.error(
						'No AuthorizationKey Is Present',
						'AuthorizationMiddleware',
						10
					);
					let apiResponse = responseLib.generate(
						true,
						'Invalid Or Expired AuthorizationKey Login again!',
						404,
						null
					);
					res.send(apiResponse);
				} else {
					token.verifyToken(
						authDetails.authToken,
						authDetails.tokenSecret,
						(err, decoded) => {
							if (err) {
								logger.error(err.message, 'Authorization Middleware', 10);
								let apiResponse = responseLib.generate(
									true,
									'Failed To Authorized',
									500,
									null
								);
								res.send(apiResponse);
							} else {
								req.user = {
									userId: decoded.data.userId || decoded.data.teamName,
								};
								next();
							}
						}
					); // end verify token
				}
			}
		);
	} else {
		logger.error('AuthorizationToken Missing', 'AuthorizationMiddleware', 5);
		let apiResponse = responseLib.generate(
			true,
			'AuthorizationToken Is Missing In Request',
			400,
			null
		);
		res.send(apiResponse);
	}
};

module.exports = {
	isAuthorized: isAuthorized,
};
