var express = require('express');
var router = express.Router();
var userHelpers = require('../helpers/userHelpers');
var petitionHelpers = require('../helpers/petitionHelpers');

// router.post('petitions/new', async (req, res, next)=>{
// 	let data = req.body;
// 	let email = data.email;
    
//     userHelpers.validate(email).then(async (response)=>{
//     	if(response.status){
//            petitionHelpers.createPetition(data).then(async(response)=>{
//            	if(response){
//            		req.session.email = response.email;
//            		await req.flash("info", "Petition created successfully");
//            		res.redirect("/");
//            	}
//            });
//     	}else{
//     		await req.flash("info", "Invalid Email");
//     		res.redirect("/");
//     	}
//     })

// });

router.post("/new", async(req, res)=>{
  let data = req.body;
  let email = data.email;

    userHelpers.validate(email).then(async (response)=>{
      if(response.status){
           petitionHelpers.createPetition(data).then(async(response)=>{
            if(response){
              req.session.email = response.email;
              await req.flash("info", "Petition created successfully");
              res.redirect("/");
            }
           });
      }else{
        await req.flash("info", "Invalid Email");
        res.redirect("/");
      }
    });

});

module.exports = router;
