'use strict';

const Gallery = require('../database/models/Gallery');
const User = require('../database/models/User');

module.exports = function(req, res, next) {
  User.where({ id: req.params.id })
    .fetch({ withRelated: ['galleries'] })
    .then((result) => {
      const user = result.toJSON();
      if (req.isAuthenticated() && (user.id === req.user.id || req.user.role === 'admin')) {
        return next();
      } else {
        return res.redirect(`/user/${req.params.id}`);
      }
    });
};
