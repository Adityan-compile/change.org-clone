var emailCheck = require("email-check");
var db = require("../config/connection");
var collections = require("../config/collections");


module.exports = {

	// validate: (email) => {
	// 	return new Promise(async (resolve, reject) => {
	// 		let response = {};
	// 		await emailCheck(email)
	// 			.then((res) => {
	// 				response.status = true;
	// 				resolve(response);
	// 			})
	// 			.catch((err) => {
	// 				response.status = true;
	// 				response.err = err;
	// 				resolve(response);
	// 			});
	// 	});	
	// }

	findUser: (id) =>{
		return new Promise(async (resolve, reject)=>{
               let user = await db
                          .get()
                          .collection(collections.USER_COLLECTION)
                          .findOne({"_id":objectId(id)});
                if(user){
                	resolve("user exists");
                }else{
                	resolve("user does not exist");
                }
		});
	},

	insertUser:(data)=>{
		return new Promise(async (resolve, reject) => {

			db.get().collection(collections.USER_COLLECTION).insertOne(data).then((response)=>{
				resolve(response.ops[0]);
			})
		});
	}

};
