const mongoClient = require('mongodb').mongoClient;
const db = require('../config/connection');

module.exports = {
  createPetition: (data, userId) => {
    return new Promise(async (resolve, reject) => {
      const date_ob = new Date();

      // current date
      // adjust 0 before single digit date
      const date = ('0' + date_ob.getDate()).slice(-2);

      // current month
      const month = ('0' + (date_ob.getMonth() + 1)).slice(-2);

      // current year
      const year = date_ob.getFullYear();

      const today = date + '/' + month + '/' + year;

      data.dateCreated = today;
      data.signed = 1;
      data.signedUsers = [userId];

      await db
        .get()
        .collection(process.env.PETITION_COLLECTION)
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
        .collection(process.env.PETITION_COLLECTION)
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
      const petitions = await db
        .get()
        .collection(process.env.PETITION_COLLECTION)
        .find()
        .sort({_id: -1})
        .limit(5)
        .toArray();
      resolve(petitions);
    });
  },
  getAllPetitions: () => {
    return new Promise(async (resolve, reject) => {
      const petitions = await db
        .get()
        .collection(process.env.PETITION_COLLECTION)
        .find()
        .sort({_id: -1})
        .toArray();
      resolve(petitions);
    });
  },

  search: (query) => {
    return new Promise(async (resolve, reject) => {
      const results = await db
        .get()
        .collection(process.env.PETITION_COLLECTION)
        .find({
          title: {
            $regex: new RegExp(query),
            $options: '-i',
          },
        })
        .sort({_id: -1})
        .toArray();

      resolve(results);
    });
  },
};
