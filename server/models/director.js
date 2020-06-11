const mongoose = require('mongoose');
const types = mongoose.Schema.Types
const Schema = mongoose.Schema;

const directorSchema = new Schema({
  name: 'string',
  age: 'string',
})

module.exports = mongoose.model('Director', directorSchema, 'directors')
