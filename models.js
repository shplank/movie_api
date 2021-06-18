const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthdate: Date,
  Favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Film"}]
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
}

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};

let filmSchema = mongoose.Schema({
  Title: {type: String, required: true},
  ReleaseYear: {type: String},
  Description: {type: String, required: true},
  Genre: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre"}],
  Director: [{ type: mongoose.Schema.Types.ObjectId, ref: "Director"}],
  ImagePath: {type: String},
  Featured: Boolean
});

let genreSchema = mongoose.Schema({
  Name: {type: String, required: true},
  Description: {type: String, required: true}
});

let directorSchema = mongoose.Schema({
  Name: {type: String, required: true},
  Bio: {type: String, required: true},
  Birth: {type: String}
});

let Film = mongoose.model('Film', filmSchema);
let Genre = mongoose.model('Genre', genreSchema);
let Director = mongoose.model('Director', directorSchema);
let User = mongoose.model('User', userSchema);

module.exports.Film = Film;
module.exports.Genre = Genre;
module.exports.Director = Director;
module.exports.User = User;
