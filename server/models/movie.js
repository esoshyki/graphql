const mongoose = require('mongoose');
const types = mongoose.Schema.Types
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  name: types.String,
  genre: types.String,
  directorID: types.ObjectId
})

module.exports = mongoose.model('Movie', movieSchema, 'movies')
