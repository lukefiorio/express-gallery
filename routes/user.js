const express = require('express');
const router = express.Router();
const User = require('../database/models/User');
const Gallery = require('../database/models/Gallery');

router.route('/:id').get((req, res) => {
  User.where({ id: req.user.id })
    .fetch({ withRelated: ['galleries'] })
    .then(function(user) {
      const gallery = {
        galleries: user.related('galleries').toJSON(),
      };
      return res.render('templates/user/index', gallery);
    });
});

module.exports = router;
