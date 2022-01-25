const mongoose = require('mongoose');
const Models = require('./models.js');

const Films = Models.Film;
const Genres = Models.Genre;
const Directors = Models.Director;
const Users = Models.User;

// mongoose.connect('mongodb://localhost:27017/moooviesdb', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();

const cors = require('cors');
app.use(cors());

app.use(morgan('common'));

app.use(bodyParser.json());

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

const { check, validationResult } = require('express-validator');

// GET requests

app.get('/', (req, res) => {
  res.send('Welcome to Mooovies!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.use(express.static('public'));


/**
* Get the list of data about all films in 'Films' collection
* @method GET
* @method populate adds data from Genre and Director documents
* @param {string} endpoint - /films
* @requires authentication JWT
* @returns {array} returns array of film objects in json format
*/
app.get('/films', passport.authenticate('jwt', { session: false }), (req, res) => {
  Films.find()
  .populate({path: 'Genre', model: Genres})
  .populate({path: 'Director', model: Directors})
    .then((films) => {
      res.status(201).json(films);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
* Get the data about a single film document in 'Films' collection
* @method GET
* @method populate adds data from Genre and Director documents
* @param {string} endpoint - /films/:Title
* @param {string} Title of film
* @requires authentication JWT
* @returns {object} returns film object in json format
*/
app.get('/films/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Films.findOne({ Title: req.params.Title })
  .populate({path: 'Genre', model: Genres})
  .populate({path: 'Director', model: Directors})
    .then((film) => {
      res.json(film);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
* Get the data about films of one genre from 'Films' collection
* @method GET
* @method populate adds data from Genre and Director documents
* @param {string} endpoint - /Genre/:_id
* @param {string} _id of genre
* @requires authentication JWT
* @returns {array} returns array of film objects in json format
*/
app.get('/Genre/:_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Films.find({ Genre: mongoose.Types.ObjectId(req.params._id) })
  .populate({path: 'Genre', model: Genres})
  .populate({path: 'Director', model: Directors})
    .then((films) => {
      res.json(films);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
* Get the data about films of one director from 'Films' collection
* @method GET
* @method populate adds data from Genre and Director documents
* @param {string} endpoint - /Director/:_id
* @param {string} _id of director
* @requires authentication JWT
* @returns {array} returns array of film objects in json format
*/
app.get('/Director/:_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Films.find({ Director: mongoose.Types.ObjectId(req.params._id) })
  .populate({path: 'Genre', model: Genres})
  .populate({path: 'Director', model: Directors})
    .then((films) => {
      res.json(films);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
* Get the list of data about all genres in 'Genres' collection
* @method GET
* @param {string} endpoint - /genres
* @requires authentication JWT
* @returns {array} returns array of genre objects in json format
*/
app.get('/genres', passport.authenticate('jwt', { session: false }), (req, res) => {
  Genres.find()
    .then((genres) => {
      res.status(201).json(genres);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
* Get the list of data about all directors in 'Directors' collection
* @method GET
* @param {string} endpoint - /directors
* @requires authentication JWT
* @returns {array} returns array of director objects in json format
*/
app.get('/directors', passport.authenticate('jwt', { session: false }), (req, res) => {
  Directors.find()
    .then((directors) => {
      res.status(201).json(directors);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
* Get the list of data about all users in 'Users' collection
* @method GET
* @param {string} endpoint - /users
* @requires authentication JWT
* @returns {array} returns array of user objects in json format
*/
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
* Get the data about a single user document in 'Users' collection
* @method GET
* @method populate adds film data from Films document via Favorites array
* @param {string} endpoint - /users/:Username
* @param {string} Username
* @requires authentication JWT
* @returns {object} returns user object in json format
*/
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
  .populate({path: 'Favorites', model: Films})
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// POST/PUT/DELETE requests

/**
* Add a new user to 'Users' collection
* @method POST
* @param {string} endpoint - /register
* @param {string} Username
* @param {string} Password
* @param {string} Email
* @param {string} Birthdate
* @returns {object} creates user object in json format
*/
app.post('/register',
  [check('Username', 'Username of at least five characters is required').isLength({ min: 5 }),
  check('Username', 'Username contains non-alphanumeric characters - not allowed').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail(),
  ], (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // checks to see if Username alrady exists in collection
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthdate: req.body.Birthdate
            })
            .then((user) => { res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

/**
* Add a film to a user's list of favorites in that user document
* @method POST
* @param {string} endpoint - /favorites/:Username/films/:_id
* @param {string} Username
* @param {string} _id of film
* @requires authentication JWT
* @returns {object} updates user object
*/
app.post('/favorites/:Username/films/:_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, 
    { $push: { Favorites: req.params._id } },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

/**
* Remove a film from a user's list of favorites in that user document
* @method DELETE
* @param {string} endpoint - /favorites/:Username/films/:_id
* @param {string} Username
* @param {string} _id of film
* @requires authentication JWT
* @returns {object} updates user object
*/
app.delete('/favorites/:Username/films/:_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
    { $pull: { Favorites: req.params._id } },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

/**
* Update a user's profile by username
* @method PUT
* @param {string} endpoint - /users/update/:Username
* @param {string} Username
* @param {string} Password
* @param {string} Email
* @param {string} Birthdate
* @requires authentication JWT
* @returns {object} returns updated user object in json format
*/
app.put('/users/update/:Username', passport.authenticate('jwt', { session: false }),
  [check('Username', 'Username of at least five characters is required').isLength({ min: 5 }),
  check('Username', 'Username contains non-alphanumeric characters - not allowed').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail(),
  ], (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate({ Username: req.params.Username }, {
      $set:
      {
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthdate: req.body.Birthdate
      }
    },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      });
  });

/**
* De-registers a user by username
* @method DELETE
* @param {string} endpoint - /users/:Username
* @param {string} Username
* @requires authentication JWT
*/
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

// log errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
