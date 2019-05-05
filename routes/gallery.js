const express = require('express');
const router = express.Router();
const knex = require('../database/knex');

router
  .route('/')
  .get((req, res) => {
    res.send('view a list of photos');
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
