'use strict';

const express = require('express');
const router = express.Router();
const User = require('../database/models/User');
const bcrypt = require('bcryptjs');
const saltRounds = 12;

router
  .route('/')
  .get((req, res) => {
    const loggedIn = req.hasOwnProperty('user');
    let loggedId;
    let loggedUsername;
    let loggedRole;
    if (loggedIn) {
      (loggedId = req.user.id), (loggedUsername = req.user.username), (loggedRole = req.user.role);
    } else {
      (loggedId = false), (loggedUsername = false), (loggedRole = false);
    }
    res.render('templates/register/index', {
      loggedIn: loggedIn,
      loggedId: loggedId,
      loggedUsername: loggedUsername,
      loggedRole: loggedRole,
    });
  })
  .post((req, res) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        console.log('error:', err);
        return res.status(500).send('Unable to generate salt');
      }

      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) {
          console.log('error:', err);
          return res.status(500).send('Unable to encrypt');
        }

        return new User({
          username: req.body.username,
          password: hash,
          role: 'user',
        })
          .save()
          .then((user) => {
            console.log(user);
            req.login(user, (err) => {
              if (err) {
                console.log('error:', err);
                return res.status(500).send('Unable to log-in');
              }
              return res.redirect('/gallery');
            });
          })
          .catch((err) => {
            console.log('error:', err);
            return res.status(500).send('Error creating account');
          });
      });
    });
  });

module.exports = router;
