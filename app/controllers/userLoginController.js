const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('../libs/timeLib');
const response = require('../libs/responseLib');
const logger = require('../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib');
const check = require('../libs/checkLib');
const passwordLib = require('../libs/generateHasPasswordLib');
const token = require('../libs/tokenLib');

/* Models */
const usersModel = mongoose.model('userdetails');
const loginModel = mongoose.model('login');

// start user signup function
let signUpFunction = (req, res) => {

	let validateUserInput = () => {
		return new Promise((resolve, reject) => {
			if (req.body.email) {
				if (!validateInput.Email(req.body.email)) {
					let apiResponse = response.generate(
						true,
						'Email Does not met the requirement',
						400,
						null
					);
					reject(apiResponse);
				} else if (
					check.isEmpty(req.body.password) ||
					check.isEmpty(req.body.name) ||
					check.isEmpty(req.body.mobile)
				) {
					let apiResponse = response.generate(
						true,
						'Field Missing During User Creation',
						400,
						null
					);
					reject(apiResponse);
				} else {
					resolve(req);
				}
			} else {
				logger.error(
					'Field Missing During User Creation',
					'userLoginController: signUpFunction()-->validateUserInput()',
					5
				);
				let apiResponse = response.generate(
					true,
					'One or More Parameter(s) is missing',
					400,
					null
				);
				reject(apiResponse);
			}
		});
	}; // end validate user input

	let createUser = () => {
		return new Promise((resolve, reject) => {
			usersModel
				.findOne({ email: req.body.email })
				.exec((err, retrievedUserDetails) => {
					if (err) {
						logger.error(
							err.message,
							'userLoginController: signUpFunction()-->createUser()',
							5
						);
						let apiResponse = response.generate(
							true,
							'Failed To Create User',
							500,
							null
						);
						reject(apiResponse);
					} else if (check.isEmpty(retrievedUserDetails)) {
						let newUser = new usersModel({
							userId: shortid.generate(),
							name: req.body.name,
							email: req.body.email.toLowerCase(),
							mobile: req.body.mobile,
							password: passwordLib.hashpassword(req.body.password),
							createdOn: time.getLocalTime(),
						});

						newUser.save((err, newUser) => {
							if (err) {
								logger.error(
									err.message,
									'userLoginController: signUpFunction()-->createUser()',
									5
								);
								let apiResponse = response.generate(
									true,
									'Failed to create new User',
									500,
									null
								);
								reject(apiResponse);
							} else {
								let newUserObj = newUser.toObject();
								resolve(newUserObj);
							}
						});
					} else {
						logger.error(
							'User Already Present With this Email',
							'userLoginController: signUpFunction()-->createUser()',
							4
						);
						let apiResponse = response.generate(
							true,
							'User Already Present With this Email',
							403,
							null
						);
						reject(apiResponse);
					}
				});
		});
	}; // end create user function

	validateUserInput(req, res)
		.then(createUser)
		.then((resolve) => {
			// delete resolve.password;
			resolve = {};
			let apiResponse = response.generate(false, 'User created', 200, resolve);
			res.send(apiResponse);
		})
		.catch((err) => {
			console.log(err);
			let apiResponse = response.generate(true, err.message, err.status, {});
			res.send(apiResponse);
		});
}; // end user signup function

// start of login function
let loginFunction = (req, res) => {
	let findUser = () => {
		return new Promise((resolve, reject) => {
			if (validateInput.Email(req.body.email)) {
				usersModel.findOne({ email: req.body.email }, (err, userDetails) => {
					/* handle the error here if the User is not found */
					if (err) {
						logger.error(
							'Failed To Retrieve user Data',
							'userLoginController: loginFunction()-->findUser()',
							10
						);
						/* generate the error message and the api response message here */
						let apiResponse = response.generate(
							true,
							'Failed To Retrieve user Data',
							500,
							null
						);
						reject(apiResponse);
						/* if User Details is not found */
					} else if (check.isEmpty(userDetails)) {
						/* generate the response and the console error message here */
						logger.error(
							'No User Found',
							'userLoginController: loginFunction()-->findUser()',
							5
						);
						let apiResponse = response.generate(
							true,
							'Please enter valid user credentials!',
							404,
							null
						);
						reject(apiResponse);
					} else {
						/* prepare the message and the api response here */
						logger.info(
							'User Details Found',
							'userLoginController: loginFunction()-->findUser()',
							0
						);
						resolve(userDetails);
					}
				});
			}
		});
	};

	let validatePassword = (userDetails) => {
		return new Promise((resolve, reject) => {
			passwordLib.comparePassword(
				req.body.password,
				userDetails.password,
				(err, isMatch) => {
					if (err) {
						logger.error(
							err.message,
							'userLoginController:loginFunction()-->validatePassword()',
							10
						);
						let apiResponse = response.generate(
							true,
							'Please enter valid user credentials!',
							500,
							null
						);
						reject(apiResponse);
					} else if (isMatch) {
						let userDetailsObj = userDetails.toObject();
						delete userDetailsObj.password;
						delete userDetailsObj._id;
						delete userDetailsObj.__v;
						delete userDetailsObj.createdOn;

						resolve(userDetailsObj);
					} else {
						logger.info(
							'Login Failed Due To Invalid Password',
							'userLoginController:loginFunction()-->validatePassword()',
							5
						);
						let apiResponse = response.generate(
							true,
							'Please enter valid user credentials!',
							400,
							null
						);
						reject(apiResponse);
					}
				}
			);
		});
	};

	let generateToken = (userDetailsObj) => {
		return new Promise((resolve, reject) => {
			token.generateToken(userDetailsObj, (err, tokenDetails) => {
				if (err) {
					logger.info(
						'Login Failed Due To tocken generation',
						'userLoginController:loginFunction()-->generateToken()',
						10
					);
					let apiResponse = response.generate(
						true,
						'Failed To Generate Token',
						500,
						null
					);
					reject(apiResponse);
				} else {
					tokenDetails.userId = userDetailsObj.userId;
					tokenDetails.userDetails = userDetailsObj;
					resolve(tokenDetails);
				}
			});
		});
	};

	let saveToken = (tokenDetails) => {
		// console.log("save token");
		return new Promise((resolve, reject) => {
			loginModel.findOne(
				{ userId: tokenDetails.userId },
				(err, retrievedTokenDetails) => {
					if (err) {
						logger.info(
							err.message,
							'userLoginController:loginFunction()-->saveToken()',
							10
						);
						let apiResponse = response.generate(
							true,
							'Failed To save Token',
							500,
							null
						);
						reject(apiResponse);
					} else if (check.isEmpty(retrievedTokenDetails)) {
						let newAuthToken = new loginModel({
							userId: tokenDetails.userId,
							authToken: tokenDetails.token,
							tokenSecret: tokenDetails.tokenSecret,
							tokenGenerationTime: time.now(),
						});
						newAuthToken.save((err, newTokenDetails) => {
							if (err) {
								// console.log(err);
								logger.info(
									err.message,
									'userLoginController:loginFunction()-->saveToken()',
									10
								);
								let apiResponse = response.generate(
									true,
									'Failed To Save Token',
									500,
									null
								);
								reject(apiResponse);
							} else {
								let responseBody = {
									authToken: newTokenDetails.authToken,
									userDetails: tokenDetails.userDetails,
								};
								resolve(responseBody);
							}
						});
					} else {
						retrievedTokenDetails.authToken = tokenDetails.token;
						retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret;
						retrievedTokenDetails.tokenGenerationTime = time.now();
						retrievedTokenDetails.save((err, newTokenDetails) => {
							if (err) {
								// console.log(err);
								logger.info(
									err.message,
									'userLoginController:loginFunction()-->saveToken()',
									10
								);
								let apiResponse = response.generate(
									true,
									'Failed To Save Token',
									500,
									null
								);
								reject(apiResponse);
							} else {
								let responseBody = {
									authToken: newTokenDetails.authToken,
									userDetails: tokenDetails.userDetails,
								};
								resolve(responseBody);
							}
						});
					}
				}
			);
		});
	};

	findUser(req, res)
		.then(validatePassword)
		.then(generateToken)
		.then(saveToken)
		.then((resolve) => {
			let apiResponse = response.generate(
				false,
				'Login Successful',
				200,
				resolve
			);
			//res.status(200);
			res.send(apiResponse);
		})
		.catch((err) => {
			console.log(err);
			let apiResponse = response.generate(true, err.message, err.status, {});
			res.send(apiResponse);
		});
};
// end of the login function

// start logout function
let logout = (req, res) => {
	loginModel.findOneAndRemove({ userId: req.user.userId }, (err, result) => {
		if (err) {
			logger.error(err.message, 'userLoginController: logout()', 10);
			let apiResponse = response.generate(
				true,
				`error occurred: ${err.message}`,
				err.status,
				null
			);
			res.send(apiResponse);
		} else if (check.isEmpty(result)) {
			let apiResponse = response.generate(
				true,
				'Already Logged Out or Invalid UserId',
				404,
				null
			);
			res.send(apiResponse);
		} else {
			let apiResponse = response.generate(
				false,
				'Logged Out Successfully',
				200,
				{}
			);
			res.send(apiResponse);
		}
	});
}; // end of the logout function.

//function to get all Users Id
let getAllUsersFunction = (req, res) => {
	usersModel
		.find()
		.select('-__v -_id -password -email -mobile -createdOn')
		.lean()
		.exec((err, result) => {
			if (err) {
				logger.error(
					err.message,
					'userLoginController: getAllUsersFunction()',
					10
				);
				let apiResponse = response.generate(
					true,
					'Failed To Find All Users',
					500,
					null
				);
				res.send(apiResponse);
			} else if (check.isEmpty(result)) {
				logger.info(
					'No Users Id Found',
					'userLoginController: getAllUsersFunction()'
				);
				let apiResponse = response.generate(
					true,
					'No Users Id Found!',
					404,
					null
				);
				res.send(apiResponse);
			} else {
				let apiResponse = response.generate(
					false,
					'All Users Id Found!',
					200,
					result
				);
				res.send(apiResponse);
			}
		});
	// }
}; //End to get all Users Id

module.exports = {
	signUpFunction: signUpFunction,
	loginFunction: loginFunction,
	logout: logout,
	getAllUsersFunction: getAllUsersFunction,
}; // end exports
