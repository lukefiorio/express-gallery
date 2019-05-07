'use strict';

// express
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const urlParser = bodyParser.urlencoded({ extended: false });
// passport
const passport = require('passport');
const localStrategy = require('passport-local');
// override
const methodOverride = require('method-override');

const app = express();
const PORT = 3000;

// source data
const gallery = require('./routes/gallery.js');
const login = require('./routes/login.js');
const register = require('./routes/register.js');
const user = require('./routes/user.js');
const User = require('./database/models/User');
const guard = require('./middleware/guard');
// const knex = require('./database/knex');

// handlebars
app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(express.static('public'));
app.use(urlParser);
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use(passport.session());

app.use('/gallery', gallery);
app.use('/register', register);
app.use('/login', login);
app.use('/user', user);

////
////
passport.use(
  new localStrategy(function(username, password, done) {
    return new User({ username: username })
      .fetch()
      .then((user) => {
        console.log(user);

        if (user === null) {
          return done(null, false, { message: 'bad username or password' });
        } else {
          user = user.toJSON();
          // happy route
          if (user.password === password) {
            return done(null, user);
            // error route. username exists, pw not matched
          } else {
            return done(null, false, { message: 'bad username or password' });
          }
        }
      })
      .catch((err) => {
        console.log('error:', err);
        return done(err);
      });
  }),
);

// create session for user & send cookie
passport.serializeUser(function(user, done) {
  console.log('serializing');
  return done(null, { id: user.id, username: user.username });
});

// will fire if session id/user (in session storage) + cookie (user's) && outside of public route
passport.deserializeUser(function(user, done) {
  console.log('deserializing');
  console.log(user);

  return new User({ id: user.id }).fetch().then((user) => {
    user = user.toJSON();
    done(null, {
      id: user.id,
      username: user.username,
    });
  });
});

const server = app.listen(PORT, () => {
  console.log(`Express app is listening on port ${PORT}`);
});
