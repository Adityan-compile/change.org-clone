const mongoClient = require('mongodb').mongoClient;
const db = require('../config/connection');

module.exports = {
  addDonation: (data) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(process.env.DONATION_COLLECTION)
        .insertOne(data)
        .then((response) => {
          response.ops[0].status = true;
          resolve(response.ops[0]);
        });
    });
  },
};
