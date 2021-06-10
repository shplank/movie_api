const mongoose = require('mongoose');

let filmSchema = mongoose.Schema({
  Title: {type: String, required: true},
  ReleaseYear: String,
  Description: {type: String, required: true},
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean
});

let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthdate: Date,
  Favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Film"}]
});

let Film = mongoose.model('Film', filmSchema);
let User = mongoose.model('User', userSchema);

module.exports.Film = Film;
module.exports.User = User;
