'use strict';

module.exports = function(req, res, next) {
  console.log(req);
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect('/login');
  }
};
