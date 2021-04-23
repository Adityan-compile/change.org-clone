const express = require("express");
var path = require("path");
var fs = require("fs");
const userHelpers = require("../helpers/userHelpers");
const petitionHelpers = require("../helpers/petitionHelpers");
const donationHelpers = require("../helpers/donationHelpers");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/* GET home page. */
router.get("/", async (req, res) => {
  await petitionHelpers.getLimitedPetitions().then(async (petitions) => {
    const messages = await req.consumeFlash("info");
    const loggedIn = req.session.loggedIn;
    res.render("index", { title: "LIFE", messages, petitions, loggedIn });
  });
});

router.post("/login", async (req, res) => {
  const data = req.body;
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
  const data = req.body;
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

router.get("/user/profile", async (req, res) => {
  if (req.session.loggedIn) {
    console.log(req.session)
    let user = req.session.user;
    let messages = await req.consumeFlash("info");
    res.render("profile.hbs", { title: "LIFE", user, messages });
  } else {
    await req.flash("info", "Please Login");
    res.redirect("/");
  }
});

router.post("/user/profile/edit", async (req, res) => {
  let data = req.body;
  let userId = req.session.user._id;
  await userHelpers.updateUser(data, userId).then(async (response) => {
    if (response.status) {
      req.session.user = response.user;
      await req.flash("info", "Profile Updated Successfully");
      res.redirect("/user/profile");
    } else {
      await req.flash("info", "Profile Update Failed");
      res.redirect("/user/profile");
    }
  });
});

router.get("/user/delete", async (req, res)=>{
  let userId = req.session.user._id;
  await userHelpers.deleteUser(userId).then(async (response)=>{
    if(response){
      req.session.destroy();
      await req.flash("info", "Account Deleted Successfully");
      res.redirect("/");
    }else{
      await req.flash("info", "Failed to Delete Account");
      res.redirect("/");
    }
  });
});

router
  .route("/donate")
  .get((req, res) => {
    const loggedIn = req.session.loggedIn;
    const user = req.session.user;
    const public_key = process.env.STRIPE_PUBLIC_KEY;
    res.render("donate", { title: "LIFE", loggedIn, user, public_key });
  })
  .post((req, res) => {
    const data = req.body;
    const encodedEmail = encodeURIComponent(data.email);
    const encodedAddress = encodeURIComponent(data.address);
    data.url = `/donate/confirm?name=${data.name}&email=${encodedEmail}&amount=${data.amount}&address=${encodedAddress}&country=${data.country}&state=${data.state}&city=${data.city}&zip=${data.zip}`;
    res.redirect(data.url);
  });

router.get("/donate/confirm", (req, res) => {
  const data = req.query;
  data.email = decodeURIComponent(data.email);
  const public_key = process.env.STRIPE_PUBLIC_KEY;
  res.render("confirmDonation", { title: "LIFE", data, public_key });
});

router.post("/charge", async (req, res) => {
  const data = req.body;
  data.query = req.query;
  data.query.address = decodeURIComponent(data.query.address);
  data.query.email = data.email;
  stripe.customers
    .create({
      email: data.stripeEmail,
      source: data.stripeToken,
      name: data.query.name,
      address: {
        line1: data.query.address,
        postal_code: data.query.zip,
        city: data.query.city,
        state: data.query.state,
        country: data.query.country,
      },
    })
    .then((user) => {
      return stripe.charges.create({
        amount: data.query.amount * 100,
        description: "Donation",
        currency: "INR",
        customer: user.id,
      });
    })
    .then(async (charged) => {
      data.receipt = charged.receipt_url;
      await donationHelpers.addDonation(data).then(async (response) => {
        if (response.status) {
          req.session.accessRestricted = true;
          data.receipt = await encodeURIComponent(data.receipt);
          res.redirect(
            `/donate/success?receipt=${data.receipt}&amount=${data.query.amount}`
          );
        }
      });
    })
    .catch((err) => {
      req.session.accessRestricted = true;
      res.redirect("/donate/failed");
    });
});

router.get("/donate/success", async (req, res) => {
  const data = req.query;
  data.receipt = decodeURIComponent(data.receipt);
  if (req.session.accessRestricted) {
    req.session.accessRestricted = false;
    res.render("success", { title: "LIFE", data });
  } else {
    await req.flash("info", "Access Restricted");
    res.redirect("/");
  }
});

router.get("/donate/failed", async (req, res) => {
  if (req.session.accessRestricted) {
    req.session.accessRestricted = false;
    res.render("failed", { title: "LIFE" });
  } else {
    await req.flash("info", "Access Restricted");
    res.redirect("/");
  }
});

router
  .route("/logout")
  .get(userHelpers.logout)
  .post(userHelpers.logout);

router.route("/serviceWorker").get((req, res) => {
  var file = fs.readFile(
    path.join(__dirname, "../public", "/javascripts/serviceWorker.js")
  );
  res.sendFile(file);
  res.end();
});

module.exports = router;
