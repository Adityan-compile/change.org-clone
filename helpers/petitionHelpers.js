var mongoClient = require("mongodb").mongoClient;
var db = require("../config/connection");
var collections = require("../config/collections");

/*
   TODO:
   [] Create helper function for full text search 
*/

module.exports = {
	createPetition: (data, userId) => {
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
			data.signed = 1;
			data.signedUsers = [userId];

			await db
			    .get()
				.collection(collections.PETITION_COLLECTION)
				.createIndex({
					title: "text",
					description: "text",
				})
				.then(async () => {
					await db
						.get()
						.collection(collections.PETITION_COLLECTION)
						.insertOne(data)
						.then((response) => {
							resolve(response.ops[0]);
						});
				});
		});
	},

	/* 
  TODO:
  [] Allow one user to sign a petition only once.
  [] Maintain a seperate collection for signed petitions.
*/

	signPetition: (id) => {
		return new Promise(async (resolve, reject) => {
			await db
				.get()
				.collection(collections.PETITION_COLLECTION)
				.update(
					{
						_id: ObjectId(id),
					},
					{
						$inc: {
							signed: 1,
						},
					}
				)
				.then((response) => {
					console.log(response);
				});
		});
	},

	getLimitedPetitions: () => {
		return new Promise(async (resolve, reject) => {
			var petitions = await db
				.get()
				.collection(collections.PETITION_COLLECTION)
				.find()
				.sort({ _id: -1 })
				.limit(5)
				.toArray();
			resolve(petitions);
		});
	},
	getAllPetitions: () => {
		return new Promise(async (resolve, reject) => {
			var petitions = await db
				.get()
				.collection(collections.PETITION_COLLECTION)
				.find()
				.sort({ _id: -1 })
				.toArray();
			resolve(petitions);
		});
	},

	search: (query) => {
		return new Promise(async (resolve, reject) => {
			var results = await db
				.get()
				.collection(collections.PETITION_COLLECTION)
				.find({ $text: { $search: query, $caseSensitive: false } })
				.sort({ _id: -1 })
				.toArray();

			resolve(results);
		});
	},
};
