const express = require('express');
const router = express.Router();
const petitionHelpers = require('../helpers/petitionHelpers');

/*
  TODO:
  [x]Rewrite function to create a new petition.
*/

router.post('/new', async (req, res) => {
  const data = req.body;
  const user = req.session.user;
  const loggedIn = req.session.loggedIn;

  if (loggedIn) {
    await petitionHelpers
      .createPetition(data, user._id)
      .then(async (response) => {
        if (response) {
          await req.flash('info', 'Petition created successfully');
          res.redirect('/');
        } else {
          await req.flash('info', 'Failed to create petition');
          res.redirect('/');
        }
      });
  } else {
    await req.flash('info', 'Please Login First');
    res.redirect('/');
  }
});

// router.post("/sign?:_id", async (req, res) => {
//   if (req.session.loggedIn) {
//     let _id = req.params._id;
//     await petitionHelpers.sign(_id);
//   }
// });

router.get('/browse', async (req, res) => {
  await petitionHelpers.getAllPetitions().then(async (petitions) => {
    const messages = await req.consumeFlash('info');
    const loggedIn = req.session.loggedIn;
    res.render('browse', {
      title: 'LIFE',
      messages,
      petitions,
      loggedIn,
      browse: true,
    });
  });
});

router.get('/search', async (req, res) => {
  const messages = await req.consumeFlash('info');
  const loggedIn = req.session.loggedIn;
  res.render('search', {title: 'LIFE', messages, loggedIn});
});

router.get('/results?:search_query', async (req, res) => {
  const searchQuery = req.query.search_query;
  await petitionHelpers.search(searchQuery).then((results) => {
    const loggedIn = req.session.loggedIn;
    res.render('search', {title: 'LIFE', results, loggedIn});
  });
});

module.exports = router;
