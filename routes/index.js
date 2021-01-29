var express = require("express");
var userHelpers = require("../helpers/userHelpers");
var petitionHelpers = require("../helpers/petitionHelpers");
var router = express.Router();

/* GET home page. */
router.get("/", async (req, res, next) => {
	await petitionHelpers.getLimitedPetitions().then(async (petitions) => {
		const messages = await req.consumeFlash("info");
		console.log(petitions);
		res.render("index", { title: "LIFE", messages, petitions });
	});
});

// Flash message example
router.get("/flash", async function (req, res) {
	// Set a flash message by passing the key, followed by the value, to req.flash().
	await req.flash("info", "Flash is back!");
	res.redirect("/");
});

// app.get('/', async function (req, res) {
//   // Get an array of flash message by passing the key to req.consumeFlash()
//   const messages = await req.consumeFlash('info');
//   res.render('index', { messages });
// });

module.exports = router;
