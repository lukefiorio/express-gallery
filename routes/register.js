const express = require('express');
const router = express.Router();
const knex = require('../database/knex');
const User = require('../database/models/User');

router
  .route('/')
  .get((req, res) => {
    // filter on one user
    // new User({ id: '1' }).fetch().then((result) => {
    //   console.log(result.toJSON());
    //   return res.render('templates/gallery', result.toJSON());
    // });
    // select all users (and then we manually chose the first one)
    // new User().fetchAll().then((result) => {
    //   const user1 = result.models[0].toJSON();
    //   console.log('user:', user1);
    //   return res.render('templates/gallery', user1);
    // });
    // res.send('view a list of photos');
    res.render('templates/register/index');
  })
  .post((req, res) => {
    return new User({
      username: req.body.username,
      password: req.body.password,
      role: 'user',
    })
      .save()
      .then((user) => {
        console.log(user);
        return res.redirect('/login.html');
      })
      .catch((err) => {
        console.log('error:', err);
        return res.send('Error creating account');
      });
  });

module.exports = router;
