const forgetPassController = require('./../../app/controllers/forgetPasswordController');
const appConfig = require('./../../config/appConfig');

module.exports.setRouter = (app) => {
	let baseUrl = `${appConfig.apiVersion}/users`;

	// defining routes.

	//params: authToken, message, senderName, senderId, queryId
	app.post(
		`${baseUrl}/generate/forget/password/code`,
		forgetPassController.generateForgetPassCodeFunction
	);
	/**
       * @apiGroup create
       * @apiVersion  1.0.0
       * @api {post} /api/v1/users/generate/forget/password/code api to create a new forget password code
       *
       *@apiParam {String} authToken The token for authentication.(Send authToken as a body parameter)(required)
       *@apiParam {String} userId user id .(Send userId as a body parameter)(required)
       *@apiParam {String} name user name to create a new passcode.(Send user name as a body parameter)(required)
       *@apiParam {String} email user email to create a new passcode.(Send user email as a body parameter)(required)
       * 
       *@apiSuccessExample {object} Success-Response:
             {
           "error": false,
           "message": "Passcode Generated Successfully",
           "status": 200,
           "data": {
               createdOn:2020-06-20T00:56:22.000+00:00
               userId:"7GpzIZ5jc"
               queryId:"7GpzIZpld"
               email:"testing@gmail.com"
               name:"abhishek"
           }
         }
        @apiErrorExample {json} Error-Response:
     * {
        "error": true,
        "message": "Failed To Generate New Passcode.",
        "status": 500,
        "data": null
       }
      */

	//params: authToken, userId
	app.post(
		`${baseUrl}/update/password`,
		forgetPassController.updatePasswordFunction
	);
	/**
       * @apiGroup update
       * @apiVersion  1.0.0
       * @api {post} /api/v1/users/update/password api to update user password
       *
       *@apiParam {String} authToken The token for authentication.(Send authToken as a body parameter)(required)
       *@apiParam {String} userId user id to update password.(Send userId as a body parameter)(required)
       * 
       *@apiSuccessExample {object} Success-Response:
             {
           "error": false,
           "message": "User Password Has Updated Successfully",
           "status": 200,
           "data": {}
         }
        @apiErrorExample {json} Error-Response:
     * {
        "error": true,
        "message": "Failed To Update User Password",
        "status": 500,
        "data": null
       }
      */


};
