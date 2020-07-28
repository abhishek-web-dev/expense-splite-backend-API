const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('../libs/timeLib');
const response = require('../libs/responseLib');
const logger = require('../libs/loggerLib');
const check = require('../libs/checkLib');
const passwordLib = require('../libs/generateHasPasswordLib');
const sendEmail = require('./../libs/email');

/* Models */
const userModel = mongoose.model('userdetails');
const forgetPassModel = mongoose.model('forgetpassword');

// start generate forget password code function
let generateForgetPassCodeFunction = (req, res) => {
	let validateUserInput = () => {
		return new Promise((resolve, reject) => {
			if (check.isEmpty(req.body.email)) {
				let apiResponse = response.generate(
					true,
					'Field Missing During forget pass code generation.',
					400,
					null
				);
				reject(apiResponse);
			} else {
				userModel.findOne({ email: req.body.email }, (err, userResult) => {
					if (err) {
						let apiResponse = response.generate(
							true,
							'some error has occure.',
							400,
							null
						);
						reject(apiResponse);
					} else if (check.isEmpty(userResult)) {
						let apiResponse = response.generate(
							true,
							'Invalid Email Id!',
							400,
							null
						);
						reject(apiResponse);
					} else {
						resolve(userResult);
					}
				});
			}
		});
	}; // end validate user input

	let sendForgetPassCode = (userdetails) => {
		return new Promise((resolve, reject) => {
			let newPassCode = new forgetPassModel({
				codeId: shortid.generate(),
				userId: userdetails.userId,
				name: userdetails.name,
				email: userdetails.email,
				createdOn: time.getLocalTime(),
			});

			newPassCode.save((err, PassCodeResult) => {
				if (err) {
					logger.error(
						err.message,
						'forgetPasswordController: generateForgetPassCodeFunction()-->sendForgetPassCode()',
						5
					);
					console.log(err);
					let apiResponse = response.generate(
						true,
						'Failed to generate new forget pass code',
						500,
						null
					);
					reject(apiResponse);
				} else {
					let message = `<p>Hi ${PassCodeResult.name},</p> </br>
                                      <p>Your current username and verification code are given below:</p></br>
                                      <p>Username : ${PassCodeResult.email} </p></br>
                                      <p>Code : ${PassCodeResult.codeId} </p> </br>
                                      <p>Thanks,</p><br>
                                      <p>Expense Splitter Team!</p>`;
					sendEmail.sendEmailFunction(
						PassCodeResult.email,
						`Forgot password information for ${PassCodeResult.name}`,
						message
					);

					resolve(PassCodeResult);
				}
			});
		});
	}; // end create user function

	validateUserInput(req, res)
		.then(sendForgetPassCode)
		.then((result) => {
			let apiResponse = response.generate(
				false,
				'Please check your Email, verification code has sent.',
				200,
				result
			);
			res.send(apiResponse);
		})
		.catch((err) => {
			logger.error(
				err.message,
				'forgetPasswordController:generateForgetPassCodeFunction()',
				5
			);
			let apiResponse = response.generate(true, err.message, err.status, {});
			res.send(apiResponse);
		});
}; // end generate forget password code function

// update user password function
let updatePasswordFunction = (req, res) => {
	//let userDetails ;

	let validateUserInput = () => {
		return new Promise((resolve, reject) => {
			if (check.isEmpty(req.body.code) || check.isEmpty(req.body.password)) {
				let apiResponse = response.generate(true, 'Field Missing .', 400, null);
				reject(apiResponse);
			} else {
				forgetPassModel.findOne(
					{ codeId: req.body.code },
					(err, userResult) => {
						if (err) {
							let apiResponse = response.generate(
								true,
								'some error has occure.',
								400,
								null
							);
							reject(apiResponse);
						} else if (check.isEmpty(userResult)) {
							let apiResponse = response.generate(
								true,
								'Invalid Verification Code!',
								400,
								null
							);
							reject(apiResponse);
						} else {
							//userDetails = userResult;
							resolve(userResult);
						}
					}
				);
			}
		});
	}; // end validate user input

	let updatePassword = (userResult) => {
		return new Promise((resolve, reject) => {
			userModel.findOneAndUpdate(
				{ userId: userResult.userId },
				{ $set: { password: passwordLib.hashpassword(req.body.password) } },
				(err, result) => {
					if (err) {
						logger.error(
							err.message,
							'forgetPasswordController:updatePasswordFunction()-->updatePassword()',
							10
						);
						let apiResponse = response.generate(
							true,
							'Failed to update password.',
							500,
							null
						);
						reject(apiResponse);
					} else {
						let message = `<p>Hi ${userResult.name},</p> </br>
                                      <p>Your Password has updated successfully!</p></br>
                                      <p>Thanks,</p>
                                      <p>Expense Splitter Team!</p>`;
						sendEmail.sendEmailFunction(
							userResult.email,
							`password has updated successfully for ${userResult.name}`,
							message
						);
						resolve();
					}
				}
			);
		});
	};

	let deleteForgetCode = () => {
		return new Promise((resolve, reject) => {
			forgetPassModel.findOneAndRemove(
				{ codeId: req.body.code },
				(err, result) => {
					if (err) {
						logger.error(
							err.message,
							'forgetPasswordController:updatePasswordFunction()-->deleteForgetCode()',
							10
						);
						let apiResponse = response.generate(
							true,
							'Failed to detele code.',
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

	validateUserInput(req, res)
		.then(updatePassword)
		.then(deleteForgetCode)
		.then((resolve) => {
			let apiResponse = response.generate(
				false,
				'Password has updated successfully!',
				200,
				null
			);
			res.send(apiResponse);
		})
		.catch((err) => {
			logger.error(err.message, 'forgetPasswordController: catch()', 5);
			let apiResponse = response.generate(true, err.message, err.status, {});
			res.send(apiResponse);
		});
};
// end update user password function

module.exports = {
	generateForgetPassCodeFunction: generateForgetPassCodeFunction,
	updatePasswordFunction: updatePasswordFunction,
};
