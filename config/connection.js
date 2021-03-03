const MongoClient = require('mongodb').MongoClient;

const host = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const state = {
  db: null,
};

module.exports.connect = function (done) {
  MongoClient.connect(host, (err, data) => {
    if (err) {
      return done(err);
    } else {
      state.db = data.db(dbName);
    }
  });

  done();
};

module.exports.get = function () {
  return state.db;
};
