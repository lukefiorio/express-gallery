const User = require('./database/models/User');
// const knex = require('./database/knex');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlParser = bodyParser.urlencoded({ extended: false });
const PORT = 3000;

const gallery = require('./routes/gallery.js');

app.use(urlParser);

app.use('/gallery', gallery);

const server = app.listen(PORT, () => {
  console.log(`Express app is listening on port ${PORT}`);
});
