const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('../schema/schema')
const mongoose = require('mongoose');
const dbString = 'mongodb+srv://shyki:3guv915fQepTyzDH@cluster0-uk0mn.mongodb.net/?retryWrites=true&w=majority'

const app = express();
const PORT = 3005

mongoose.connect(dbString,  { useNewUrlParser: true, useUnifiedTopology: true, dbName: "graphql-tutorial" })

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))

const dbConnection = mongoose.connection;
dbConnection.on('error', err => console.log(err))
dbConnection.once('open', () => console.log('db connected'))

app.listen(PORT, err => {
  err ? console.log(err) : console.log(`app listen on ${PORT}`)
})