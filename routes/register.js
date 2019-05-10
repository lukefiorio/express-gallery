'use strict';

const express = require('express');
const router = express.Router();
const User = require('../database/models/User');
const bcrypt = require('bcryptjs');
const saltRounds = 12;

router
  .route('/')
  .get((req, res) => {
    res.render('templates/register/index');
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
