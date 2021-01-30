var express = require("express");
var userHelpers = require("../helpers/userHelpers");
var petitionHelpers = require("../helpers/petitionHelpers");
var router = express.Router();

/* GET home page. */
router.get("/", async (req, res, next) => {
	await petitionHelpers.getLimitedPetitions().then(async (petitions) => {
		const messages = await req.consumeFlash("info");
		let loggedIn = req.session.loggedIn;
		console.log(petitions);
		res.render("index", { title: "LIFE", messages, petitions });
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

router.get("/signup", async (req, res) => {
	if (req.session.loggedIn) {
		await req.flash("info", "Already loggedIn");
		res.redirect("/");
	} else {
		res.render("signup");
	}
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

module.exports = router;
