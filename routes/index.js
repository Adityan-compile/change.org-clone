var express = require("express");
var userHelpers = require("../helpers/userHelpers");
var petitionHelpers = require("../helpers/petitionHelpers");
var router = express.Router();

/* GET home page. */
router.get("/", async (req, res, next) => {
	await petitionHelpers.getLimitedPetitions().then(async (petitions) => {
		const messages = await req.consumeFlash("info");
		let loggedIn = req.session.loggedIn;
		res.render("index", { title: "LIFE", messages, petitions, loggedIn });
	});
});

router.get("/login", async (req, res) => {
	let loggedIn = req.session.loggedIn;
	if (loggedIn) {
		await req.flash("info", "Already logged in");
		res.redirect("/");
	} else {
		res.render("login");
	}
});

router.post("/login", async (req, res) => {
	let data = req.body;
	await userHelpers.login(data).then(async (status) => {
		if (status) {
			req.session.loggedIn = true;
			req.session.user = data;
			res.redirect("/");
		} else {
			req.session.loggedIn = false;
			await req.flash("info", "Login Failed");
			res.redirect("/login");
		}
	});
});

router.post("/signup", async (req, res) => {
	let data = req.body;
	await userHelpers.validate(data.email).then(async (response) => {
		await userHelpers.signup(data).then(async (status) => {
			if (status) {
				req.session.loggedIn = true;
				req.session.user = response;
				await req.flash("info", "SignUp Successful");
				res.redirect("/");
			} else {
				await req.flash("info", "SignUp Failed");
				res.redirect("/");
			}
		});
	});
});

router.get("/logout", async (req, res) => {
	req.session.pop();
	await req.flash("info", "Logged out successfully");
	res.redirect("/");
});


// Test method for notifications
// router.get("/flash", async (req, res)=>{
// 	await req.flash("info", "This is a test");
// 	res.redirect("/");
// });

module.exports = router;
