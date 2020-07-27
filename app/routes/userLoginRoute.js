const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/userLoginController");
const appConfig = require("./../../config/appConfig");
const tokenAuth = require('../middlewares/tokenAuth');

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;

    // defining routes.


    // params: firstName, lastName, email, mobileNumber, password
    app.post(`${baseUrl}/signup`, userController.signUpFunction);

    /**
     * @apiGroup create
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/signup api for user signup.
     *
     * @apiParam {string} name name of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} mobileNumber mobile number of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Signup Successful",
            "status": 200,
            "data": {}

        }
       @apiErrorExample {json} Error-Response:
	 * {
	    "error": true,
	    "message": "Signup Failed",
	    "status": 500,
	    "data": null
	   }
	 */
    


    // params: userId, password.
    app.post(`${baseUrl}/login`, userController.loginFunction);

    /**
     * @apiGroup read
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/login api to login user
     *
     * @apiParam {string} userId userId of the user. (required)
     *@apiParam {string} password password of the user. (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Login Successfully",
            "status": 200,
            "data": {
                 userId:"X1_ad7a",
                 name:"anmit",
                 email:"abc@gmail.com",
                 mobileNumber:"703301289"
            }

        }
       @apiErrorExample {json} Error-Response:
	 * {
	    "error": true,
	    "message": "Login Failed",
	    "status": 500,
	    "data": null
	   }
    */


    // params: authToken, userId
    app.post(`${baseUrl}/logout`,tokenAuth.isAuthorized, userController.logout);
    /**
     * @apiGroup delete
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/logout api to logout user
     *
     * @apiParam {string} userId userId of the user in body parameter. (required)
     *  @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
           {
         "error": false,
         "message": "Logged Out Successfully",
         "status": 200,
         "data": null
       }
      @apiErrorExample {json} Error-Response:
	 * {
	    "error": true,
	    "message": "Logout Failed",
	    "status": 500,
	    "data": null
	   }
    */

      //params: authToken 
      app.post(`${baseUrl}/get/all/user`,tokenAuth.isAuthorized, userController.getAllUsersFunction);
      /**
       * @apiGroup read
       * @apiVersion  1.0.0
       * @api {post} /api/v1/users/get/all/user api to get all users id
       *
       *  @apiParam {String} authToken The token for authentication.(Send authToken as a body parameter)
       *
       * @apiSuccess {object} myResponse shows error status, message, http status code, result.
       * 
       * @apiSuccessExample {object} Success-Response:
             {
           "error": false,
           "message": "All users Id Found Successfully",
           "status": 200,
           "data": [{
             name:string,
             userId:string
           }]
         }
        @apiErrorExample {json} Error-Response:
     * {
        "error": true,
        "message": "Failed To Get All Users Id.",
        "status": 500,
        "data": null
       }
      */

};
