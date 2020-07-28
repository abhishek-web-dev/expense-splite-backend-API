const expenseController = require('./../../app/controllers/expenseController');
const appConfig = require('./../../config/appConfig');
const tokenAuth = require('../middlewares/tokenAuth');

module.exports.setRouter = (app) => {
	let baseUrl = `${appConfig.apiVersion}/users`;

	// defining routes.

	//params: authToken, groupId, ename, amount, creatorId, creatorName, updatedById, updatedByName, contributer, distributer
	app.post(
		`${baseUrl}/create/expense`,
		tokenAuth.isAuthorized,
		expenseController.createExpenseFunction
	);
	/**
       * @apiGroup create
       * @apiVersion  1.0.0
       * @api {post} /api/v1/users/create/expense api to create a new expense
       *
       *@apiParam {String} authToken The token for authentication.(Send authToken as a body parameter)
       *@apiParam {String} groupId group id to create a new group.(Send groupId as a body parameter)
       *@apiParam {String} ename expense name to create a new expense.(Send message as a body parameter)
       *@apiParam {String} amount total expense amount .(Send amount as a body parameter)
       *@apiParam {String} creatorId creator Id to create a new expense.(Send creatorId as a body parameter)
       *@apiParam {String} creatorName creator name to create a new expense.(Send creatorName as a body parameter)
       *@apiParam {String} updatedById userId of last updated person.(Send updatedById as a body parameter)
       *@apiParam {String} updatedByName name of last updated person.(Send updatedByName as a body parameter)
       *@apiParam {String} contributer all user details who will contribute in expense.(Send contributer as a body parameter)
       *@apiParam {String} distributer all user name who will pay for expense.(Send distributer as a body parameter)
       *@apiSuccess {object} myResponse shows error status, message, http status code, result.
       * 
       *@apiSuccessExample {object} Success-Response:
             {
           "error": false,
           "message": "Expense created Successfully",
           "status": 200,
           "data": {
               createdOn:2020-06-20T00:56:22.000+00:00
               expenseId:"7GpzIZ5jc"
               groupId:"7GpzIZpld"
               amount:500
               creatorName:"abhishek"
               creatorId:"Sw-vulMJ6"
               ename:"Shoping"
               updatedById:"7GpzIZfht"
               updatedByName:"abhishek"
               contributer:["7GpzIZpld","7GpzIZpsc"]
               distributer:["7GpzIZkdn","7GpzIZpms"]
           }
         }
        @apiErrorExample {json} Error-Response:
     * {
        "error": true,
        "message": "Failed To Create New Expense.",
        "status": 500,
        "data": null
       }
      */

	//params: authToken, expenseId, skip
	app.post(
		`${baseUrl}/get/ten/expenses`,
		tokenAuth.isAuthorized,
		expenseController.getTenExpensesFunction
	);
	/**
       * @apiGroup read
       * @apiVersion  1.0.0
       * @api {post} /api/v1/users/get/ten/expenses api to get ten expense
       *
       *@apiParam {String} authToken The token for authentication.(Send authToken as a body parameter)
       *@apiParam {String} expenseId expense id to get ten expense.(Send expenseId as a body parameter)
       *@apiParam {Number} skip to get next 10 expense.(skip as a body parameter)
       *@apiSuccess {object} myResponse shows error status, message, http status code, result.
       * 
       *@apiSuccessExample {object} Success-Response:
             {
           "error": false,
           "message": "Ten Expense Found Successfully",
           "status": 200,
           "data": [{
               createdOn:2020-06-20T00:56:22.000+00:00
               expenseId:"7GpzIZ5jc"
               groupId:"7GpzIZpld"
               amount:500
               creatorName:"abhishek"
               creatorId:"Sw-vulMJ6"
               ename:"Shoping"
               updatedById:"7GpzIZfht"
               updatedByName:"abhishek"
               contributer:["7GpzIZpld","7GpzIZpsc"]
               distributer:["7GpzIZkdn","7GpzIZpms"]
           }]
         }
        @apiErrorExample {json} Error-Response:
     * {
        "error": true,
        "message": "Failed To Get Ten Expense.",
        "status": 500,
        "data": null
       }
      */

	//params: authToken, expenseId
	app.post(
		`${baseUrl}/get/all/expenses`,
		tokenAuth.isAuthorized,
		expenseController.getAllExpensesFunction
	);
	/**
       * @apiGroup read
       * @apiVersion  1.0.0
       * @api {post} /api/v1/users/get/all/expenses api to get all expense
       *
       *@apiParam {String} authToken The token for authentication.(Send authToken as a body parameter)
       *@apiParam {String} expenseId expense id to get all expense.(Send expenseId as a body parameter)
       *@apiSuccess {object} myResponse shows error status, message, http status code, result.
       * 
       *@apiSuccessExample {object} Success-Response:
             {
           "error": false,
           "message": "All Expense Found Successfully",
           "status": 200,
           "data": [{
               createdOn:2020-06-20T00:56:22.000+00:00
               expenseId:"7GpzIZ5jc"
               groupId:"7GpzIZpld"
               amount:500
               creatorName:"abhishek"
               creatorId:"Sw-vulMJ6"
               ename:"Shoping"
               updatedById:"7GpzIZfht"
               updatedByName:"abhishek"
               contributer:["7GpzIZpld","7GpzIZpsc"]
               distributer:["7GpzIZkdn","7GpzIZpms"]
           }]
         }
        @apiErrorExample {json} Error-Response:
     * {
        "error": true,
        "message": "Failed To Get All Expenses",
        "status": 500,
        "data": null
       }
      */

	//  get one expense data
	app.post(
		`${baseUrl}/get/one/expense`,
		tokenAuth.isAuthorized,
		expenseController.getOneExpenseDetailsFunction
	);

	/**
     * @apiGroup read
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/get/one/expense api for get one expense details
     *
     * @apiParam {string} authToken send authToken. (body params) (required)
	 * @apiParam {string} expenseId send expense id. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "One Expense Details Found!",
            "status": 200,
            "data": {  
               createdOn:2020-06-20T00:56:22.000+00:00
               expenseId:"7GpzIZ5jc"
               groupId:"7GpzIZpld"
               amount:500
               creatorName:"abhishek"
               creatorId:"Sw-vulMJ6"
               ename:"Shoping"
               updatedById:"7GpzIZfht"
               updatedByName:"abhishek"
               contributer:["7GpzIZpld","7GpzIZpsc"]
               distributer:["7GpzIZkdn","7GpzIZpms"]
            }
		
        }
       @apiErrorExample {json} Error-Response:
	 * {
	    "error": true,
	    "message": "Failed To Find One Expense",
	    "status": 500,
	    "data": null
	   }
	 */

};
