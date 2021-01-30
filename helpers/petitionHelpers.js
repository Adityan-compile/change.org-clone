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
			data.signed = 1;

			await db
				.get()
				.collection(collections.PETITION_COLLECTION)
				.insertOne(data)
				.then((response) => {
					resolve(response.ops[0]);
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
				).then((response)=>{
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
				.toArray();
			resolve(petitions);
		});
	},
};
