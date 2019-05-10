'use strict';

const express = require('express');
const router = express.Router();
const User = require('../database/models/User');
const Gallery = require('../database/models/Gallery');
const guard = require('../middleware/guard');
const userGuard = require('../middleware/userGuard');

router.route('/:id').get(guard, (req, res) => {
  // User.where({ id: req.user.id })
  User.where({ id: req.params.id })
    .fetch({ withRelated: ['galleries'] })
    .then((result) => {
      const gallery = {
        galleries: result.related('galleries').toJSON(),
      };
      console.log(gallery);
      return res.render('templates/user/index', gallery);
    });
});

router.route('/:id/edit').get(userGuard, (req, res) => {
  // User.where({ id: req.user.id })
  console.log(req.params.id);
  User.where({ id: req.params.id })
    .fetch({ withRelated: ['galleries'] })
    .then((result) => {
      const gallery = {
        galleries: result.related('galleries').toJSON(),
      };
      console.log(gallery);
      return res.render('templates/user/edit', gallery);
    });
});

module.exports = router;
