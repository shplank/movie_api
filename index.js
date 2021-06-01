const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();

app.use(morgan('common'));

app.use(bodyParser.json());

let films = [
  {
    title: 'Parasite',
    year: 2019,
    director: 'Bong Joon-ho',
    genres: 'thriller, comedy'
  },
  {
    title: 'Moonlight',
    year: 2016,
    director: 'Barry Jenkins',
    genres: 'drama, indie'
  },
  {
    title: 'Get Out',
    year: 2017,
    director: 'Jordan Peele',
    genres: 'horror, thriller'
  },
  {
    title: 'The Favourite',
    year: 2018,
    director: 'Yorgos Lanthimos',
    genres: 'drama, history'
  },
  {
    title: 'Midsommar',
    year: 2019,
    director: 'Ari Aster',
    genres: 'horror, drama'
  },
  {
    title: 'Black Swan',
    year: 2010,
    director: 'Darren Aronofsky',
    genres: 'thriller, drama'
  },
  {
    title: 'Arrival',
    year: 2016,
    director: 'Denis Villeneuve',
    genres: 'sci-fi, thriller'
  },
  {
    title: 'Blade Runner',
    year: 1982,
    director: 'Ridley Scott',
    genres: 'sci-fi, action'
  },
  {
    title: 'Raising Arizona',
    year: 1987,
    director: 'Joel Coen',
    genres: 'comedy, crime'
  },
  {
    title: 'The City of Lost Children',
    year: 1995,
    director: 'Marc Caro, Jean-Pierre Jeunet',
    genres: 'fantasy, sci-fi'
  }
];

let users = [];

// GET requests

app.get('/', (req, res) => {
  res.send('Welcome to Mooovies!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.use(express.static('public'));

// Gets the list of data about ALL films

app.get('/films', (req, res) => {
  res.json(films);
});

// Gets the data about a single film, by title

app.get('/films/:title', (req, res) => {
  res.json(films.find((film) =>
    { return film.title === req.params.title }));
});

// Gets the data about a genre, by name

app.get('/genres/:name', (req, res) => {
  res.send('Successful GET request returning data on a genre');
 });

// Gets the data about a director, by name

app.get('/directors/:name', (req, res) => {
  res.send('Successful GET request returning data on a director');
 });

// Allows a new user to register

app.post('/users', (req, res) => {
  res.send('Successful POST request adding a user');
 });

// Updates a user's profile

app.put('/users/:username/profile', (req, res) => {
  let user = users.find((user) => { return user.username === req.params.username });

  if (user) {
    user.profile[req.params.username] = parseInt(req.params.username);
    res.status(201).send('Profile for ' + req.params.username + ' has been updated.');
  } else {
    res.status(404).send('User with the name ' + req.params.username + ' was not found.');
  }
});

// Adds a film to a user's list of favorites

app.post('/users/:username/favorites', (req, res) => {
  let newFave = req.body;

  if (!newFave.title) {
    const message = 'Missing title in request body';
    res.status(400).send(message);
  } else {
    users.favorites.push(newFave);
    res.status(201).send(newFave);
  }
});

// Removes a film from a user's list of favorites

app.delete('/users/:username/favorites/:title', (req, res) => {
  let film = films.find((film) => { return film.title === req.params.title });

  if (film) {
    films = films.filter((obj) => { return obj.title !== req.params.title });
    res.status(201).send(req.params.title + ' was removed from favorites.');
  }
});

// De-registers a user

app.delete('/users/:username', (req, res) => {
  let user = users.find((user) => { return user.username === req.params.username });

  if (user) {
    user = users.filter((obj) => { return obj.username !== req.params.username });
    res.status(201).send('User ' + req.params.username + ' has been de-registered.');
  }
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
