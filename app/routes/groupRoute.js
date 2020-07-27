const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const appConfig = require('../../config/appConfig');
const tokenAuth = require('../middlewares/tokenAuth');
const multer = require('multer');
const path = require('path');

// defining routes.
module.exports.setRouter = (app) => {
	let baseUrl = `${appConfig.apiVersion}/users`;

	// params: title, status, description, recieverName, recieverId, creatorName, creatorId, image
	app.post(
		`${baseUrl}/create/group`,
		tokenAuth.isAuthorized,
		groupController.creatGroupFunction
	);

	/**
     * @apiGroup create
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/create/group api for query creation
     *
     * @apiParam {string} title title of the query. (body params) (required)
     * @apiParam {string} status status of the query. (body params) (required)
     * @apiParam {string} description description of the query. (body params) (required)
     * @apiParam {string} recieverName reciever name . (body params) (required)
     * @apiParam {string} recieverId reciever id . (body params) (required)
     * @apiParam {string} creatorName creator name . (body params) (required)
     * @apiParam {string} creatorId creator id . (body params) (required)
     * @apiParam {string} image image of the query. (body params)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Query has created Successfully",
            "status": 200,
            "data": {}

        }
       @apiErrorExample {json} Error-Response:
	 * {
	    "error": true,
	    "message": "Failed to create query",
	    "status": 500,
	    "data": null
	   }
	 */

	// params: authToken
	app.post(
		`${baseUrl}/get/ten/groups`,
		tokenAuth.isAuthorized,
		groupController.getTenGroupsFunction
	);

	/**
     * @apiGroup read
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/get/all/query api for get all query details
     *
     * @apiParam {string} authToken send authToken. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "All Messages Found!",
            "status": 200,
            "data":[{  
               creatorId: "Sw-vulMJ6"
               creatorName: "abhishek"
               description: "s<font face="Arial">sdf</font>"
               image: "http://localhost:3000/images/checksum_cn_3rd_unit.png"
               queryId: "Q1qu_ngO3"
               recieverId: "12345"
               recieverName: "abhi"
               status: "In-Progress"
               title: "testing 1"
               userWatchlistIds: ["Q1qu_ngO3"]
               createdOn: "2020-06-17T06:18:13.000Z"
            }] 
        }
       @apiErrorExample {json} Error-Response:
	 * {
	    "error": true,
	    "message": "Failed To Find All Message",
	    "status": 500,
	    "data": null
	   }
	 */

	//  get one query data
	app.post(
		`${baseUrl}/get/one/group`,
		tokenAuth.isAuthorized,
		groupController.getOneGroupDetailsFunction
	);

	/**
     * @apiGroup read
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/get/one/query api for get one query details
     *
     * @apiParam {string} authToken send authToken. (body params) (required)
	 * @apiParam {string} queryId send query id. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "All Messages Found!",
            "status": 200,
            "data": {  
               creatorId: "Sw-vulMJ6"
               creatorName: "abhishek"
               description: "s<font face="Arial">sdf</font>"
               image: "http://localhost:3000/images/checksum_cn_3rd_unit.png"
               queryId: "Q1qu_ngO3"
               recieverId: "12345"
               recieverName: "abhi"
               status: "In-Progress"
               title: "testing 1"
               userWatchlistIds: ["Q1qu_ngO3"]
               createdOn: "2020-06-17T06:18:13.000Z"
            }
		
        }
       @apiErrorExample {json} Error-Response:
	 * {
	    "error": true,
	    "message": "Failed To Find All Message",
	    "status": 500,
	    "data": null
	   }
	 */

	// params:
	app.post(
		`${baseUrl}/edit/group`,
		tokenAuth.isAuthorized,
		groupController.editGroupFunction
	);

	/**
     * @apiGroup update
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/edit/query api for edit query.
     *
     * @apiParam {string} title title of the query. (body params) 
     * @apiParam {string} status status of the query. (body params) 
     * @apiParam {string} description description of the query. (body params) 
     * @apiParam {string} recieverName reciever name . (body params) (required)
     * @apiParam {string} recieverId reciever id . (body params) (required)
     * @apiParam {string} image image of the query. (body params)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Query Edited Successful",
            "status": 200,
            "data": {}

        }
       @apiErrorExample {json} Error-Response:
	 * {
	    "error": true,
	    "message": "Failed to edit query",
	    "status": 500,
	    "data": null
	   }
	 */

	//  delete group
	app.post(
		`${baseUrl}/delete/group`,
		tokenAuth.isAuthorized,
		groupController.deleteGroupFunction
	);

	/**
     * @apiGroup delete
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/delete/query api for delete a query
     *
     * @apiParam {string} authToken send authToken. (body params) (required)
	  * @apiParam {string} queryId send query id. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "query has deleted!",
            "status": 200,
            "data": {}
		
        }
       @apiErrorExample {json} Error-Response:
	 * {
	    "error": true,
	    "message": "Failed To Delete Query",
	    "status": 500,
	    "data": null
	   }
	 */
};
