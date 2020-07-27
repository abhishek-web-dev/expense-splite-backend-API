const express = require('express');
const router = express.Router();
const messageController = require('./../../app/controllers/messageController');
const appConfig = require('./../../config/appConfig');
const tokenAuth = require('../middlewares/tokenAuth');

module.exports.setRouter = (app) => {
	let baseUrl = `${appConfig.apiVersion}/users`;

	// defining routes.

	//params: authToken, message, senderName, senderId, queryId
	app.post(
		`${baseUrl}/create/message`,
		tokenAuth.isAuthorized,
		messageController.createMessageFunction
	);
	/**
       * @apiGroup create
       * @apiVersion  1.0.0
       * @api {post} /api/v1/users/create/message api to create a new message
       *
       *@apiParam {String} authToken The token for authentication.(Send authToken as a body parameter)
       *@apiParam {String} senderId sender id to create a new mesage.(Send senderId as a body parameter)
       *@apiParam {String} message message to create a new mesage.(Send message as a body parameter)
       *@apiParam {String} senderName sender name to create a new mesage.(Send senderName as a body parameter)
       *@apiParam {String} queryId query Id to create a new mesage.(Send senderId as a body parameter)
       *@apiSuccess {object} myResponse shows error status, message, http status code, result.
       * 
       *@apiSuccessExample {object} Success-Response:
             {
           "error": false,
           "message": "Message created Successfully",
           "status": 200,
           "data": {
               createdOn:2020-06-20T00:56:22.000+00:00
               messageId:"7GpzIZ5jc"
               queryId:"7GpzIZpld"
               message:"edited"
               senderName:"abhishek"
               senderId:"Sw-vulMJ6"
           }
         }
        @apiErrorExample {json} Error-Response:
     * {
        "error": true,
        "message": "Failed To Create New Message.",
        "status": 500,
        "data": null
       }
      */

	//params: authToken, queryId, skip
	app.post(
		`${baseUrl}/get/ten/message`,
		tokenAuth.isAuthorized,
		messageController.getTenMessages
	);
	/**
       * @apiGroup read
       * @apiVersion  1.0.0
       * @api {post} /api/v1/users/get/ten/message api to get ten message
       *
       *@apiParam {String} authToken The token for authentication.(Send authToken as a body parameter)
       *@apiParam {String} queryId query id to get all message.(Send userId as a body parameter)
       *@apiParam {Number} skip to get next 10 message.(skip as a body parameter)
       *@apiSuccess {object} myResponse shows error status, message, http status code, result.
       * 
       *@apiSuccessExample {object} Success-Response:
             {
           "error": false,
           "message": "Ten notification Found Successfully",
           "status": 200,
           "data": [{
               createdOn:2020-06-20T00:56:22.000+00:00
               messageId:"7GpzIZ5jc"
               queryId:"7GpzIZpld"
               message:"edited"
               senderName:"abhishek"
               senderId:"Sw-vulMJ6"
           }]
         }
        @apiErrorExample {json} Error-Response:
     * {
        "error": true,
        "message": "Failed To Get Ten Messages.",
        "status": 500,
        "data": null
       }
      */


};
