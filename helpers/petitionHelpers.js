var mongoClient = require("mongodb").mongoClient;
var db = require("../config/connection");
var collections = require("../config/collections");

module.exports = {
	createPetition: (data) => {
		return new Promise(async (resolve, reject) => {
			let date_ob = new Date();

			// current date
			// adjust 0 before single digit date
			let date = ("0" + date_ob.getDate()).slice(-2);

			// current month
			let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

			// current year
			let year = date_ob.getFullYear();

			let today = date + "/" + month + "/" + year;

			data.dateCreated = today;

			await db
				.get()
				.collection(collections.PETITION_COLLECTION)
				.insertOne(data)
				.then((response) => {
					resolve(response.ops[0]);
				});
		});
	},

	getPetitions: () => {
		return new Promise(async (resolve, reject) => {
			await db.get
				.collection(collections.PETITION_COLLECTION)
				.find()
				.sort({ _id: -1 })
				.limit(5)
				.then((response) => {
					resolve(data.ops[0]);
				});
		});
	},
};
