const groupController = require('../controllers/groupController');
const appConfig = require('../../config/appConfig');
const tokenAuth = require('../middlewares/tokenAuth');

// defining routes.
module.exports.setRouter = (app) => {
	let baseUrl = `${appConfig.apiVersion}/users`;

	// params: groupId, gname, creatorId, creatorName, groupMemberIds
	app.post(
		`${baseUrl}/create/group`,
		tokenAuth.isAuthorized,
		groupController.creatGroupFunction
	);

	/**
     * @apiGroup create
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/create/group api for group creation
     *
     * @apiParam {string} groupId group Id of the group. (body params) (required)
     * @apiParam {string} gname group name of the group. (body params) (required)
     * @apiParam {string} creatorName creator name . (body params) (required)
     * @apiParam {string} creatorId creator id . (body params) (required)
     * @apiParam {string} groupMemberIds group member ids of the group. (body params)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Group has created Successfully",
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

	// params: authToken , skip
	app.post(
		`${baseUrl}/get/ten/groups`,
		tokenAuth.isAuthorized,
		groupController.getTenGroupsFunction
	);

	/**
     * @apiGroup read
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/get/ten/groups api for get ten group details
     *
     * @apiParam {string} authToken send authToken. (body params) (required)
     * @apiParam {string} skip send skip to get ten groups. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Ten groups Found!",
            "status": 200,
            "data":[{  
               groupId: "Sw-vulMJ6"
               creatorName: "abhishek"
               gname: "Shoping group"
               creatorId: "Sw-vulMas"
               groupMemberIds: ["Q1qu_ngO3"]
               createdOn: "2020-06-17T06:18:13.000Z"
            }] 
        }
       @apiErrorExample {json} Error-Response:
	 * {
	    "error": true,
	    "message": "Failed To Find Ten Groups",
	    "status": 500,
	    "data": null
	   }
	 */

	//  get one group data
	app.post(
		`${baseUrl}/get/one/group`,
		tokenAuth.isAuthorized,
		groupController.getOneGroupDetailsFunction
	);

	/**
     * @apiGroup read
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/get/one/group api for get one group details
     *
     * @apiParam {string} authToken send authToken. (body params) (required)
	 * @apiParam {string} groupId send group id. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "One Group Details Found!",
            "status": 200,
            "data": {  
               groupId: "Sw-vulMJ6"
               creatorName: "abhishek"
               gname: "Shoping group"
               creatorId: "Sw-vulMas"
               groupMemberIds: ["Q1qu_ngO3"]
               createdOn: "2020-06-17T06:18:13.000Z"
            }
		
        }
       @apiErrorExample {json} Error-Response:
	 * {
	    "error": true,
	    "message": "Failed To Find One Group",
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
     * @api {post} /api/v1/users/edit/group api for edit group.
     *
     * @apiParam {string} groupId group Id of the group. (body params) (required)
     * @apiParam {string} gname group name of the group. (body params) 
     * @apiParam {string} creatorName creator name . (body params) 
     * @apiParam {string} creatorId creator id . (body params) 
     * @apiParam {string} groupMemberIds group member ids of the group. 
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Group Edited Successful",
            "status": 200,
            "data": {}

        }
       @apiErrorExample {json} Error-Response:
	 * {
	    "error": true,
	    "message": "Failed to edit group",
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
     * @api {post} /api/v1/users/delete/group api for delete a group.
     *
     * @apiParam {string} authToken send authToken. (body params) (required)
	  * @apiParam {string} groupId send group id. (body params) (required)
     * @apiParam {string} expenseId send expense id. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Group has deleted!",
            "status": 200,
            "data": {}
		
        }
       @apiErrorExample {json} Error-Response:
	 * {
	    "error": true,
	    "message": "Failed To Delete Group",
	    "status": 500,
	    "data": null
	   }
	 */
};
