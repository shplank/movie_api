const mongoose = require('mongoose');
const Models = require('./models.js');

const Films = Models.Film;
const Genres = Models.Genre;
const Directors = Models.Director;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/moooviesdb', { useNewUrlParser: true, useUnifiedTopology: true });

const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();

app.use(morgan('common'));

app.use(bodyParser.json());

// GET requests

app.get('/', (req, res) => {
  res.send('Welcome to Mooovies!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.use(express.static('public'));

// Get the list of data about ALL films
app.get('/films', (req, res) => {
  Films.find()
    .then((films) => {
      res.status(201).json(films);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get the data about a single film, by title
app.get('/films/:Title', (req, res) => {
  Films.findOne({ Title: req.params.Title })
    .then((film) => {
      res.json(film);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get the data about a genre, by name
app.get('/genres/:Name', (req, res) => {
  Genres.findOne({ Name: req.params.Name })
    .then((genre) => {
      res.json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get the data about a director, by name
app.get('/directors/:Name', (req, res) => {
  Directors.findOne({ Name: req.params.Name })
    .then((director) => {
      res.json(director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

 // Get all users
 app.get('/users', (req, res) => {
   Users.find()
     .then((users) => {
       res.status(201).json(users);
     })
     .catch((err) => {
       console.error(err);
       res.status(500).send('Error: ' + err);
     });
 });

// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

 //Add a user
 /* We’ll expect JSON in this format
 {
   ID: Integer,
   Username: String,
   Password: String,
   Email: String,
   Birthday: Date
 }*/
 app.post('/users', (req, res) => {
   Users.findOne({ Username: req.body.Username })
     .then((user) => {
       if (user) {
         return res.status(400).send(req.body.Username + ' already exists');
       } else {
         Users
           .create({
             Username: req.body.Username,
             Password: req.body.Password,
             Email: req.body.Email,
             Birthdate: req.body.Birthdate
           })
           .then((user) =>{res.status(201).json(user) })
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

// Update a user's profile by username
/* We’ll expect JSON in this format
{
  Username: String, (required)
  Password: String, (required)
  Email: String, (required)
  Birthday: Date
}*/
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthdate: req.body.Birthdate
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Add a film to a user's list of favorites
app.post('/users/:Username/Films/:FilmID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { Favorites: req.params.FilmID }
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

// Remove a film from a user's list of favorites
app.post('/users/:Username/Films/:FilmID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $pull: { Favorites: req.params.FilmID }
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

// De-registers a user by username
app.delete('/users/:Username', (req, res) => {
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
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
