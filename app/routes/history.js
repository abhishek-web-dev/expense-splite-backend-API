const express = require('express');
const router = express.Router();
const historyController = require('./../../app/controllers/historyController');
const appConfig = require('../../config/appConfig');
const tokenAuth = require('../middlewares/tokenAuth');

module.exports.setRouter = (app) => {
	let baseUrl = `${appConfig.apiVersion}/users`;

	// defining routes.

	//params: authToken, userId, skip
	app.post(
		`${baseUrl}/get/ten/history`,
		tokenAuth.isAuthorized,
		historyController.getTenHistoryFunction
	);
	/**
       * @apiGroup read
       * @apiVersion  1.0.0
       * @api {post} /api/v1/users/get/ten/notification api to get ten user notification
       *
       *@apiParam {String} authToken The token for authentication.(Send authToken as a body parameter)
       *@apiParam {String} userId user id to get all notifications.(Send userId as a body parameter)
       *@apiParam {Number} skip to get next 10 notifications.(Send skip as a body parameter)
       *@apiSuccess {object} myResponse shows error status, message, http status code, result.
       * 
       *@apiSuccessExample {object} Success-Response:
             {
           "error": false,
           "message": "Ten notification Found Successfully",
           "status": 200,
           "data": [{
               createdOn:2020-06-20T00:56:22.000+00:00
               notificationId:"7GpzIZ5jc"
               title:"edited testing 6"
               message:"edited"
               modifiedPersonName:"abhishek"
               modifiedPersonId:"Sw-vulMJ6"
               userWatchlistIds:Array
           }]
         }
        @apiErrorExample {json} Error-Response:
     * {
        "error": true,
        "message": "Failed To Get Ten Notification.",
        "status": 500,
        "data": null
       }
      */

};
