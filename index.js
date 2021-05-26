const express = require('express'),
  morgan = require('morgan');

const app = express();

app.use(morgan('common'));

let topDocs = [
  {
    title: 'Won\'t You Be My Neighbor? (2018)',
    director: 'Morgan Neville'
  },
  {
    title: '13th (2016)',
    director: 'Ava DuVernay'
  },
  {
    title: '20 Feet from Stardom (2013)',
    director: 'Morgan Neville'
  },
  {
    title: 'March of the Penguins (2005)',
    director: 'Luc Jacquet'
  },
  {
    title: 'Time (2020)',
    director: 'Garrett Bradley'
  },
  {
    title: 'Jodorowsky\'s Dune (2014)',
    director: 'Frank Pavich'
  },
  {
    title: 'I Am (2010)',
    director: 'Tom Shadyac'
  },
  {
    title: 'Paris Is Burning (1990)',
    director: 'Jennie Livingston'
  },
  {
    title: 'Vernon, Florida (1981)',
    director: 'Errol Morris'
  },
  {
    title: 'Grey Gardens (1975)',
    director: 'David Maysles, Albert Maysles'
  }
];

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to DocFlix!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(topDocs);
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
