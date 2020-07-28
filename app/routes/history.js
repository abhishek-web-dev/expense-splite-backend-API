const historyController = require('./../../app/controllers/historyController');
const appConfig = require('../../config/appConfig');
const tokenAuth = require('../middlewares/tokenAuth');

module.exports.setRouter = (app) => {
	let baseUrl = `${appConfig.apiVersion}/users`;

	// defining routes.

	//params: authToken, expenseId, skip
	app.post(
		`${baseUrl}/get/ten/history`,
		tokenAuth.isAuthorized,
		historyController.getTenHistoryFunction
	);
	/**
       * @apiGroup read
       * @apiVersion  1.0.0
       * @api {post} /api/v1/users/get/ten/history api to get ten user history
       *
       *@apiParam {String} authToken The token for authentication.(Send authToken as a body parameter)
       *@apiParam {String} expenseId expense id to get all history.(Send userId as a body parameter)
       *@apiParam {Number} skip to get next 10 history.(Send skip as a body parameter)
       *@apiSuccess {object} myResponse shows error status, message, http status code, result.
       * 
       *@apiSuccessExample {object} Success-Response:
             {
           "error": false,
           "message": "Ten History Found Successfully",
           "status": 200,
           "data": [{
               createdOn:2020-06-20T00:56:22.000+00:00
               historyId:"7GpzIZ5jc"
               expenseId:"7GpzIZ5zx"
               message:"edited helo welocmes."
           }]
         }
        @apiErrorExample {json} Error-Response:
     * {
        "error": true,
        "message": "Failed To Get Ten History.",
        "status": 500,
        "data": null
       }
      */
};
