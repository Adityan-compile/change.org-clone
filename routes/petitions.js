var express = require("express");
var router = express.Router();
var userHelpers = require("../helpers/userHelpers");
var petitionHelpers = require("../helpers/petitionHelpers");

/*
  TODO:
  []Rewrite function to create a new petition.
*/

router.post("/new", async (req, res) => {
  let data = req.body;
  let user = req.session.user;
  let loggedIn = req.session.loggedIn;

  if (loggedIn) {
    await userHelpers.validate(email).then(async (response) => {
      if (response.status) {
        await petitionHelpers.createPetition(data,user._id).then(async (response) => {
          if (response) {
            await req.flash("info", "Petition created successfully");
            res.redirect("/");
          } else {
            await req.flash("info", "Failed to create petition");
            res.redirect("/");
          }
        });
      } else {
        await req.flash("info", "Invalid Email");
        res.redirect("/");
      }
    });
  }else{
    await req.flash("info", "Login First");
    res.redirect("/");
  }
});

router.post("/sign?:_id", async (req, res) => {
  if (req.session.loggedIn) {
    let _id = req.params._id;
    await petitionHelpers.sign(_id);
  }
});

module.exports = router;
