'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../database/knex');
const User = require('../database/models/User');
const passport = require('passport');

router.route('/').get((req, res) => {
  const loggedIn = req.hasOwnProperty('user');
  let loggedId;
  let loggedUsername;
  let loggedRole;
  if (loggedIn) {
    (loggedId = req.user.id), (loggedUsername = req.user.username), (loggedRole = req.user.role);
  } else {
    (loggedId = false), (loggedUsername = false), (loggedRole = false);
  }
  return res.render('templates/login/index', {
    loggedIn: loggedIn,
    loggedId: loggedId,
    loggedUsername: loggedUsername,
    loggedRole: loggedRole,
  });
});

router.post(
  '/',
  passport.authenticate('local', {
    // successRedirect: '/gallery',
    failureRedirect: '/login',
  }),
  function(req, res) {
    return res.redirect(`/user/${req.user.id}`);
  },
);

module.exports = router;
