var mongoClient = require('mongodb').mongoClient;
var db = require('../config/connection');

module.exports = {
  addDonation: (data) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(process.env.DONATION_COLLECTION)
        .insertOne(data)
        .then((response) => {
          resolve(response.ops[0]);
        });
    });
  },
};
