const express = require('express');
const router = express.Router();
const knex = require('../database/knex');
const User = require('../database/models/User');
const passport = require('passport');

router.route('/').get((req, res) => {
  return res.render('templates/login/index');
});

router.post(
  '/',
  passport.authenticate('local', {
    successRedirect: '/user/:id',
    failureRedirect: '/login',
  }),
);

module.exports = router;
