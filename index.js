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

// GET requests

app.get('/', (req, res) => {
  res.send('Welcome to DocFlix!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.use(express.static('public'));

// Gets the list of data about ALL docs

app.get('/films', (req, res) => {
  res.json(films);
});

// Gets the data about a single film, by title

app.get('/films/:title', (req, res) => {
  res.json(films.find((film) =>
    { return film.title === req.params.title }));
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
