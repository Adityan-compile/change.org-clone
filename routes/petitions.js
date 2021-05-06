const express = require('express');
const router = express.Router();
const petitionHelpers = require('../helpers/petitionHelpers');

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

router.get('/sign', async (req, res) => {
  if (req.session.loggedIn) {
    let data = req.query;
    let user = req.session.user;
    await petitionHelpers.sign(data.id, user._id).then(async (response) => {
      if (response) {
        await req.flash('info', 'Petition Signed Successfully');
        res.redirect('/');
      } else {
        await req.flash('info', 'Failed to Sign Petition');
        res.redirect('/');
      }
    });
  }
});

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

router.get('/results', async (req, res) => {
  var searchQuery = req.query.search_query;
  console.log(searchQuery);
  await petitionHelpers.search(searchQuery).then((results) => {
    const loggedIn = req.session.loggedIn;
    res.render('search', {title: 'LIFE', results, loggedIn, searchQuery});
  });
});

module.exports = router;
