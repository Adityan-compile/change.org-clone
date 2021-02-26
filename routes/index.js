var express = require("express");
var userHelpers = require("../helpers/userHelpers");
var petitionHelpers = require("../helpers/petitionHelpers");
var router = express.Router();
var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
var querystring = require("querystring");

/* GET home page. */
router.get("/", async (req, res, next) => {
	await petitionHelpers.getLimitedPetitions().then(async (petitions) => {
		const messages = await req.consumeFlash("info");
		let loggedIn = req.session.loggedIn;
		res.render("index", { title: "LIFE", messages, petitions, loggedIn });
	});
});

router.post("/login", async (req, res) => {
	let data = req.body;
	await userHelpers.login(data).then(async (response) => {
		if (response.status) {
			req.session.loggedIn = true;
			req.session.user = response.user;
			res.redirect("/");
		} else {
			req.session.loggedIn = false;
			await req.flash("info", "Login Failed");
			res.redirect("/");
		}
	});
});

router.post("/signup", async (req, res) => {
	let data = req.body;
	await userHelpers.validate(data.email).then(async (response) => {
		await userHelpers.signUp(data).then(async (result) => {
			if (result.status) {
				req.session.loggedIn = true;
				req.session.user = result.user;
				await req.flash("info", "SignUp Successful");
				res.redirect("/");
			} else {
				await req.flash("info", "SignUp Failed");
				res.redirect("/");
			}
		});
	});
});

router
	.route("/donate")
	.get((req, res) => {
		let loggedIn = req.session.loggedIn;
		let user = req.session.user;
		let public_key = process.env.STRIPE_PUBLIC_KEY;
		res.render("donate", { title: "LIFE", loggedIn, user, public_key });
	})
	.post((req, res) => {
		let data = req.body;
		let encodedEmail = encodeURIComponent(`${data.email}`);
		data.url = `/donate/confirm?name=${data.name}&email=${encodedEmail}&amount=${data.amount}`;
		res.redirect(data.url);
	});

router.get("/donate/confirm", (req, res) => {
	let data = req.query;
	data.email = decodeURIComponent(data.email);
	let public_key = process.env.STRIPE_PUBLIC_KEY;
	res.render("confirmDonation", { title:"LIFE", data, public_key});
});

router.get("/logout", async (req, res) => {
	req.session.destroy();
	// await req.flash("info", "Logged out successfully");
	res.redirect("/");
});

// Test method for notifications
// router.get("/flash", async (req, res)=>{
// 	await req.flash("info", "This is a test");
// 	res.redirect("/");
// });

module.exports = router;
