'use strict';

const Gallery = require('../database/models/Gallery');

module.exports = function(req, res, next) {
  Gallery.where({ id: req.params.id })
    .fetch({ withRelated: ['users'] })
    .then((result) => {
      const photoUserId = result.toJSON().user_id;
      if (req.isAuthenticated() && (photoUserId === req.user.id || req.user.role === 'admin')) {
        return next();
      } else {
        return res.redirect(`/gallery/${req.params.id}`);
      }
    });
};
