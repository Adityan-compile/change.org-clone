var emailCheck = require("email-check");
var bcrypt = require("bcrypt");
var db = require("../config/connection");
var collections = require("../config/collections");

module.exports = {
	validate: (email) => {
		return new Promise(async (resolve, reject) => {
			let response = {};
			await emailCheck(email)
				.then((res) => {
					response.status = true;
					resolve(response);
				})
				.catch((err) => {
					response.status = true;
					response.err = err;
					resolve(response);
				});
		});
	},

	signUp: (userData) => {
		return new Promise(async (resolve, reject) => {
			userData.password = await bcrypt.hash(userData.password, 10);
					await db
						.get()
						.collection(collections.USER_COLLECTION)
						.insertOne(userData)
						.then((data) => {
							data.ops[0].status = true;
							resolve(data.ops[0]);
						});
				});
	},

	login: (data) => {
		return new Promise(async (resolve, reject) => {
			let loggedIn = false;
			let response = {};
			let user = await db
				.get()
				.collection(collections.USER_COLLECTION)
				.findOne({ email: data.email });
			if (user) {
				await bcrypt.compare(data.password, user.password).then((status) => { 
					if (status) {
						response.user = user;
						response.status = true;
						resolve(response);
					} else {
						resolve({ status: false });
					}
				});
			} else {
				resolve({ status: false });
			}
		});
	},

	deleteUser: (userId) => {
		return new Promise(async (resolve, reject) => {
			let status = false;
			await db
				.get()
				.collection(collections.USER_COLLECTION)
				.deleteOne({ _id: ObjectId(userId) })
				.then((res) => {
					console.log(res);
					if (res.acknowledged && res.deletedCount == "1") {
						status = true;
						resolve(status);
					} else {
						resolve(status);
					}
				});
		});
	},
};
