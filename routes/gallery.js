const express = require('express');
const router = express.Router();
const knex = require('../database/knex');
const User = require('../database/models/User');
const Gallery = require('../database/models/Gallery');

router
  .route('/')
  .get((req, res) => {
    User.where({ id: req.user.id })
      .fetch({ withRelated: ['galleries'] })
      .then(function(user) {
        const gallery = {
          galleries: user.related('galleries').toJSON(),
        };
        return res.render('templates/gallery/gallery', gallery);
      });
  })
  .post((req, res) => {
    res.send('create a new gallery photo');
  });

router.route('/new').get((req, res) => {
  res.send('new photo form');
});

router
  .route('/:id')
  .get((req, res) => {
    res.send('view a single photo');
  })
  .put((req, res) => {
    res.send('update a gallery photo');
  })
  .delete((req, res) => {
    res.send('delete a gallery photo');
  });

router.route('/:id/edit').get((req, res) => {
  res.send('edit photo form');
});

module.exports = router;
