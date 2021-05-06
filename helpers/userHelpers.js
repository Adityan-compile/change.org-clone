const emailCheck = require("email-check");
const bcrypt = require("bcrypt");
const db = require("../config/connection");
const ObjectId = require("mongodb").ObjectID;

module.exports = {
  validate: (email) => {
    return new Promise(async (resolve, reject) => {
      const response = {};
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
      await db
        .get()
        .collection(process.env.USER_COLLECTION)
        .find({ email: userData.email })
        .toArray()
        .then(async (response) => {
          if (response) {
            userData.password = await bcrypt.hash(userData.password, 10);
            await db
              .get()
              .collection(process.env.USER_COLLECTION)
              .insertOne(userData)
              .then((data) => {
                let res = {};
                res.status = true;
                res.user = data.ops[0];
                resolve(res);
              });
          } else {
            data.ops[0].status = false;
            resolve(data.ops[0]);
          }
        });
    });
  },

  login: (data) => {
    return new Promise(async (resolve, reject) => {
      const response = {};
      const user = await db
        .get()
        .collection(process.env.USER_COLLECTION)
        .findOne({ email: data.email });
      if (user) {
        await bcrypt.compare(data.password, user.password).then((status) => {
          if (status) {
            response.user = user;
            response.status = true;
            resolve(response);
          } else {
            resolve((response.status = false));
          }
        });
      } else {
        resolve((response.status = false));
      }
    });
  },

  logout: (req, res) => {
    req.session.destroy();
    res.redirect("/");
  },

  updateUser: (data, userId) => {
    console.log(data, userId);
    return new Promise(async (resolve, reject) => {
      let response = {};
      response.status = false;
      await db
        .get()
        .collection(process.env.USER_COLLECTION)
        .findOneAndUpdate(
          { _id: ObjectId(userId) },
          {
            $set: {
              name: data.name,
              email: data.email,
            },
          },
          {
            returnOriginal: false,
          }
        )
        .then((res) => {  
          if(res.nModified != 0){
            response.status = true;
            response.user = res.value;
            resolve(response);
          }else{
         resolve(response);
          }
        });
    });
  },

  deleteUser: (userId) => {
    return new Promise(async (resolve, reject) => {
      let status = false;
      await db
        .get()
        .collection(process.env.USER_COLLECTION)
        .deleteOne({ _id: ObjectId(userId) })
        .then((res) => {
          console.log(res);
          if (res.deletedCount === "1") {
            status = true;
            resolve(status);
          } else {
            resolve(status);
          }
        });
    });
  },
};
