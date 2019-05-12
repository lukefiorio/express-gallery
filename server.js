'use strict';

// express
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const urlParser = bodyParser.urlencoded({ extended: false });
// redis
const redis = require('connect-redis')(session);
// passport
const passport = require('passport');
const localStrategy = require('passport-local');
// encryption
const bcrypt = require('bcryptjs');
// override
const methodOverride = require('method-override');

// source data
const gallery = require('./routes/gallery.js');
const login = require('./routes/login.js');
const logout = require('./routes/logout.js');
const register = require('./routes/register.js');
const user = require('./routes/user.js');
const User = require('./database/models/User');
const guard = require('./middleware/guard');

const PORT = 3000;
const app = express();

require('dotenv').config();

// handlebars
app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(express.static('public'));
app.use(urlParser);
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(
  session({
    store: new redis({ url: process.env.REDIS_URL }),
    secret: process.env.REDIS_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/gallery', gallery);
app.use('/register', register);
app.use('/login', login);
app.use('/logout', logout);
app.use('/user', user);

////
////
passport.use(
  new localStrategy(function(username, password, done) {
    return new User({ username: username })
      .fetch()
      .then((user) => {
        if (user === null) {
          // bad username
          return done(null, false, { message: 'bad username or password' });
        } else {
          user = user.toJSON();
          bcrypt.compare(password, user.password).then((res) => {
            if (res) {
              return done(null, user);
            } else {
              // bad password
              return done(null, false, { message: 'bad username or password' });
            }
          });
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
  return done(null, { id: user.id, username: user.username, role: user.role });
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
      role: user.role,
    });
  });
});

// home page
app.get('/', (req, res) => {
  const loggedIn = req.hasOwnProperty('user');
  let loggedId;
  let loggedUsername;
  let loggedRole;
  if (loggedIn) {
    (loggedId = req.user.id), (loggedUsername = req.user.username), (loggedRole = req.user.role);
  } else {
    (loggedId = false), (loggedUsername = false), (loggedRole = false);
  }
  return res.render('main', {
    loggedIn: loggedIn,
    loggedId: loggedId,
    loggedUsername: loggedUsername,
    loggedRole: loggedRole,
  });
});

const server = app.listen(PORT, () => {
  console.log(`Express app is listening on port ${PORT}`);
});
