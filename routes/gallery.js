const express = require('express');
const router = express.Router();
const knex = require('../database/knex');
const User = require('../database/models/User');
const Gallery = require('../database/models/Gallery');
const guard = require('../middleware/guard');

router
  .route('/')
  .get((req, res) => {
    // use this in the /id route
    new Gallery()
      .query((qb) => {
        // sort new photos to the top
        qb.orderBy('id', 'DESC');
      })
      .fetchAll()
      .then((result) => {
        let fullGallery = result.toJSON();
        const featureGallery = fullGallery.shift();
        const gallery = {
          features: featureGallery,
          galleries: fullGallery,
        };
        return res.render('templates/gallery', gallery);
      });
  })
  .post((req, res) => {
    knex('galleries')
      .insert({
        title: req.body.title,
        author: req.body.author,
        link: req.body.link,
        description: req.body.description,
        user_id: req.user.id,
      })
      .then((result) => {
        return res.redirect('/gallery');
      });
  });

router.route('/new').get(guard, (req, res) => {
  return res.render('templates/gallery/new');
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

      // keep first 4 photos
      // no error handling if resultArr.length < 4
      const resultView = {
        features: resultArr[0],
        galleries: resultArr.slice(1, 4),
      };

      return res.render('templates/gallery/gallery', resultView);
    });
  })
  .put((req, res) => {
    console.log(req.body);

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
      return res.redirect(`/products/${id}/edit`);
    }

    // MUST guard against non-owners editing a photo
    updateObj.id = Number(req.params.id);
    updateObj.user_id = req.user.id;
    console.log(updateObj);

    Gallery.where({ id: req.params.id })
      .save(updateObj)
      .then((result) => {
        console.log('Successful edit');
        return res.redirect(`/products/${id}`);
      });
    // new Gallery(updateObj)

    // return res.send('update a gallery photo');

    // Gallery.where({ id: req.params.id })
    // .fetch({ withRelated: ['users'] })
    // .then((result) => {
    //   const photoObj = result.toJSON();
    //   return res.render('templates/gallery/edit', photoObj);
    // });
  })
  .delete((req, res) => {
    res.send('delete a gallery photo');
  });

router.route('/:id/edit').get((req, res) => {
  Gallery.where({ id: req.params.id })
    .fetch({ withRelated: ['users'] })
    .then((result) => {
      const photoObj = result.toJSON();
      return res.render('templates/gallery/edit', photoObj);
    });
});

module.exports = router;
