var express = require("express");
var router = express.Router();
var userHelpers = require("../helpers/userHelpers");
var petitionHelpers = require("../helpers/petitionHelpers");

/*
  TODO:
  []Rewrite function to create a new petition.
*/

// router.post("/new", async (req, res) => {
//   let data = req.body;
//   let email = data.email;

//   await userHelpers.validate(email).then(async (response) => {
//     if (response.status) {
//       await petitionHelpers.createPetition(data).then(async (response) => {
//         if (response) {
//           req.session.email = response.email;
//           await req.flash("info", "Petition created successfully");
//           res.redirect("/");
//         }else{
//         }
//       });
//     } else {
//       await req.flash("info", "Invalid Email");
//       res.redirect("/");
//     }
//   });
// });

router.post("/sign?:_id", async (req, res)=>{
   if(req.session.loggedIn){
      let _id = req.params._id;
      await petitionHelpers.sign(_id)
   }
});

module.exports = router;
