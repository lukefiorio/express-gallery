'use strict';

const express = require('express');
const router = express.Router();
const User = require('../database/models/User');
const Gallery = require('../database/models/Gallery');
const guard = require('../middleware/guard');
const userGuard = require('../middleware/userGuard');

router.route('/').get(guard, (req, res) => {
  new User()
    .query((qb) => {
      // sort users alphabetically
      qb.orderBy('username', 'ASC');
    })
    .fetchAll()
    .then((result) => {
      const allUsers = result.toJSON();
      const loggedIn = req.hasOwnProperty('user');
      let loggedId;
      let loggedUsername;
      let loggedRole;
      if (loggedIn) {
        (loggedId = req.user.id), (loggedUsername = req.user.username), (loggedRole = req.user.role);
      } else {
        (loggedId = false), (loggedUsername = false), (loggedRole = false);
      }
      return res.render('templates/user/index', {
        users: allUsers,
        loggedIn: loggedIn,
        loggedId: loggedId,
        loggedUsername: loggedUsername,
        loggedRole: loggedRole,
      });
    });
});

router.route('/:id').get(guard, (req, res) => {
  User.where({ id: req.params.id })
    .fetch({ withRelated: ['galleries'] })
    .then((result) => {
      // const allUsers = result.toJSON();
      const loggedIn = req.hasOwnProperty('user');
      let loggedId;
      let loggedUsername;
      let loggedRole;
      if (loggedIn) {
        (loggedId = req.user.id), (loggedUsername = req.user.username), (loggedRole = req.user.role);
      } else {
        (loggedId = false), (loggedUsername = false), (loggedRole = false);
      }

      let owner;
      if (loggedId === Number(req.params.id)) {
        owner = true;
      } else {
        owner = false;
      }

      const gallery = {
        galleries: result.related('galleries').toJSON(),
        loggedIn: loggedIn,
        loggedId: loggedId,
        loggedUsername: loggedUsername,
        loggedRole: loggedRole,
        owner: owner,
      };

      return res.render('templates/user/detail', gallery);
    });
});

router.route('/:id/edit').get(userGuard, (req, res) => {
  User.where({ id: req.params.id })
    .fetch({ withRelated: ['galleries'] })
    .then((result) => {
      const loggedIn = req.hasOwnProperty('user');
      let loggedId;
      let loggedUsername;
      let loggedRole;
      if (loggedIn) {
        (loggedId = req.user.id), (loggedUsername = req.user.username), (loggedRole = req.user.role);
      } else {
        (loggedId = false), (loggedUsername = false), (loggedRole = false);
      }
      const gallery = {
        galleries: result.related('galleries').toJSON(),
        loggedIn: loggedIn,
        loggedId: loggedId,
        loggedUsername: loggedUsername,
        loggedRole: loggedRole,
      };

      return res.render('templates/user/edit', gallery);
    });
});

module.exports = router;
