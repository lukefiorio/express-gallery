'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../database/knex');
const User = require('../database/models/User');
const Gallery = require('../database/models/Gallery');
const guard = require('../middleware/guard');
const galleryGuard = require('../middleware/galleryGuard');

router
  .route('/')
  .get((req, res) => {
    new Gallery()
      .query((qb) => {
        // sort new photos to the top
        qb.orderBy('id', 'DESC');
      })
      .fetchAll()
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

        let fullGallery = result.toJSON();
        const featureGallery = fullGallery.shift();
        const gallery = {
          features: featureGallery,
          galleries: fullGallery,
          loggedIn: loggedIn,
          loggedId: loggedId,
          loggedUsername: loggedUsername,
          loggedRole: loggedRole,
        };
        return res.render('templates/gallery', gallery);
      });
  })
  .post(guard, (req, res) => {
    new Gallery()
      .save({
        title: req.body.title,
        author: req.body.author,
        link: req.body.link,
        description: req.body.description,
        user_id: req.user.id,
      })
      .then((result) => {
        console.log('Successful post');
        return res.redirect('/gallery');
      });
  });

router.route('/new').get(guard, (req, res) => {
  const loggedIn = req.hasOwnProperty('user');
  let loggedId;
  let loggedUsername;
  let loggedRole;
  if (loggedIn) {
    (loggedId = req.user.id), (loggedUsername = req.user.username), (loggedRole = req.user.role);
  } else {
    (loggedId = false), (loggedUsername = false), (loggedRole = false);
  }
  return res.render('templates/gallery/new', {
    loggedIn: loggedIn,
    loggedId: loggedId,
    loggedUsername: loggedUsername,
    loggedRole: loggedRole,
  });
});

router
  .route('/:id')
  .get((req, res) => {
    const id = Number(req.params.id);
    // fetch all photos
    new Gallery().fetchAll({ withRelated: ['users'] }).then((result) => {
      let resultArr = result.toJSON();
      const photo = resultArr.find((elem) => elem.id === id);

      // add property 'samePoster' to resultArr
      // 2 = target photo, 1 = oth photos by user, 0 = all oth photos
      resultArr.forEach((elem) => {
        if (elem.id === id) {
          elem.samePoster = 2;
        } else if (elem.user_id === photo.user_id) {
          elem.samePoster = 1;
        } else {
          elem.samePoster = 0;
        }
      });

      // sort DESC by samePoster, id
      // target photo, rcnt photos by user, oth rcnt photos
      resultArr.sort((a, b) => {
        if (a.samePoster === b.samePoster) {
          return b.id - a.id;
        }
        return b.samePoster - a.samePoster;
      });

      // pass user properties if logged in
      const loggedIn = req.hasOwnProperty('user');
      let loggedId;
      let loggedUsername;
      let loggedRole;
      if (loggedIn) {
        loggedId = req.user.id;
        loggedUsername = req.user.username;
        loggedRole = req.user.role;
      } else {
        (loggedId = false), (loggedUsername = false), (loggedRole = false);
      }

      let owner;
      if (loggedId === resultArr[0].user_id) {
        owner = true;
      } else {
        owner = false;
      }

      // keep first 4 photos
      // no error handling if resultArr.length < 4
      const resultView = {
        features: resultArr[0],
        galleries: resultArr.slice(1, 4),
        loggedIn: loggedIn,
        loggedId: loggedId,
        loggedUsername: loggedUsername,
        loggedRole: loggedRole,
        owner: owner,
      };

      return res.render('templates/gallery/gallery', resultView);
    });
  })
  .put(galleryGuard, (req, res) => {
    let updateObj = {};
    if (req.body.title) {
      updateObj.title = req.body.title;
    }
    if (req.body.author) {
      updateObj.author = req.body.author;
    }
    if (req.body.link) {
      updateObj.link = req.body.link;
    }
    if (req.body.description) {
      updateObj.description = req.body.description;
    }

    if (Object.keys(updateObj).length === 0) {
      console.log('No field values were provided');
      return res.redirect(`/gallery/${id}/edit`);
    }

    updateObj.user_id = req.user.id;

    new Gallery('id', req.params.id).save(updateObj).then((result) => {
      console.log('Successful edit');
      return res.redirect(`/gallery/${req.params.id}`);
    });
  })
  .delete(galleryGuard, (req, res) => {
    Gallery.where({ id: req.params.id })
      .destroy()
      .then((result) => {
        return res.redirect('/gallery');
      });
  });

router.route('/:id/edit').get(galleryGuard, (req, res) => {
  Gallery.where({ id: req.params.id })
    .fetch({ withRelated: ['users'] })
    .then((result) => {
      const photoObj = result.toJSON();

      // pass user properties if logged in
      const loggedIn = req.hasOwnProperty('user');
      let loggedId;
      let loggedUsername;
      let loggedRole;
      if (loggedIn) {
        (loggedId = req.user.id), (loggedUsername = req.user.username), (loggedRole = req.user.role);
      } else {
        (loggedId = false), (loggedUsername = false), (loggedRole = false);
      }

      const resultView = {
        photo: photoObj,
        loggedIn: loggedIn,
        loggedId: loggedId,
        loggedUsername: loggedUsername,
        loggedRole: loggedRole,
      };
      return res.render('templates/gallery/edit', resultView);
    });
});

module.exports = router;
