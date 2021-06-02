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
  res.send('Successful PUT request changing a user profile');
 });

// Adds a film to a user's list of favorites

app.post('/users/:username/favorites', (req, res) => {
  res.send('Successful POST request adding a film to a favorites list');
 });

// Removes a film from a user's list of favorites

app.delete('/users/:username/favorites/:title', (req, res) => {
  res.send('Successful DELETE request removing a film from a favorites list');
 });

// De-registers a user

app.delete('/users/:username', (req, res) => {
  res.send('Successful DELETE request removing a user');
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
