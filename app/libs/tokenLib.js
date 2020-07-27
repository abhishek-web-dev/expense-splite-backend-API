const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const secretKey = process.env.serverKey;

let generateToken = (retrievedUserDetailsObj, cb) => {
	try {
		let claims = {
			jwtid: shortid.generate(),
			iat: Date.now(),
			exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
			sub: 'authToken',
			iss: 'projectMonitoringSystem',
			data: retrievedUserDetailsObj
		};
		let tokenDetails = {
			token: jwt.sign(claims, secretKey),
			tokenSecret: secretKey
		};
		cb(null, tokenDetails);
	} catch (err) {
		// console.log(err);
		cb(err, null);
	}
}; // end generate token


let verifyClaim = (token, secretKey, cb) => {
	// verify a token symmetric
	jwt.verify(token, secretKey, function(err, decoded) {
		if (err) {
			cb(err, null);
		} else {
			cb(null, decoded);
		}
	});
}; // end verify claim

let verifyClaimWithoutSecret = (token, cb) => {
	// verify a token symmetric
	jwt.verify(token, secretKey, function(err, decoded) {
		if (err) {
			cb(err, data);
		} else {
			cb(null, decoded);
		}
	});
}; // end verify claim

module.exports = {
	generateToken: generateToken,
	verifyToken: verifyClaim,
	verifyClaimWithoutSecret: verifyClaimWithoutSecret
};
