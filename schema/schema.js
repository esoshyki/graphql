const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;

const Movies = require('../server/models/movie');
const Directors = require('../server/models/director');

// const directorsJSON = [
//   { name: "Quantin Tarantino", age: 55},// 5ee09fb2c41874ceac40f69c
//   { name: 'Michael Redford', age: 72}, //5ee09ff1c41874ceac40f69e"
//   { name: 'James McTeague', age: 51}, //5ee09fb2c41874ceac40f69c  
//   { name: 'Guy Ritchie', age: 50}, //5ee0a4e4c41874ceac40f6a3
// ]

// const movies = [
//   {id : "1", name: 'Pulp Fiction', genre: 'Crime', directorId: "1"},
//   {id : "2", name: '1984', genre: 'Sci-Fi', directorId: "2"},
//   {id : "3", name: 'V For Vendetta', genre: 'Sct-Fi-Triller', directorId: "3"},
//   {id : "4", name: 'Snatch', genre: 'Crime-Comedy', directorId: "4"}, 
//   {id : "5", name: 'Reselvors Dogs', genre: 'Crime', directorId: "1"},
//   {id : "6", name: 'The hatefull Eight', genre: 'Crime', directorId: "1"},
//   {id : "7", name: 'Inglourses Basters', genre: 'Crime', directorId: "1"},
//   {id : "8", name: 'Lock, smock and two Smoking Barrels', genre: 'Crime-Comedy', directorId: "4"}, 
// ]

// const directors = [
//   {id : "1", name: 'Quantin Tarantino', age: 55},
//   {id : "2", name: 'Michael Redford', age: 72},
//   {id : "3", name: 'James McTeague', age: 51},
//   {id : "4", name: 'Guy Ritchie', age: 50}, 
// ]

const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    genre: { type: new GraphQLNonNull(GraphQLString) },    
    director: {
      type: DirectorType,
      resolve(parent, args) {
        console.log(parent)
        return Directors.findById(parent.directorID, (err, res) => {
          return err ? [] : res
        })
      }
    }
  }),
});

const DirectorType = new GraphQLObjectType({
  name: 'Director',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    movies: { 
      type: GraphQLList(MovieType) ,
      resolve(parent, args) {
        return Movies.find({
          directorID: parent.id
        }, (err, res) => {
          return err ? [] : res
        })
      },
    },
  }),
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addDirector: {
      type: DirectorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        const director = new Directors({
          name: args.name,
          age: args.age
        })
        return director.save()
      }
    },
    addMovie: {
      type: MovieType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        directorID: { type: GraphQLID },
      },
      resolve(parent, args) {
        const movie = new Movies({
          name: args.name,
          genre: args.genre,
          directorID: args.directorID
        })
        return movie.save()
      }
    },
    deleteDirector: {
      type: DirectorType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Directors.findByIdAndRemove(args.id)
      }
    },
    deleteMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Movies.findByIdAndRemove(args.id)
      }
    },
    updateDirector: {
      type: DirectorType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        return Directors.findByIdAndUpdate(args.id, {
          $set: { name: args.name, age: args.age }
        }, { new: true })
      }
    },
    updateMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        directorID: { type: GraphQLID },
      },
      resolve(parent, args) {
        return Movies.findByIdAndUpdate(args.id, {
          $set: { name: args.name, genre: args.genre, directorID: args.directorID }
        }, { new: true })
      }
    },
  }
})

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID }},
      resolve(parent, args) {
        return Movies.findById(args.id, (err, res) => {
          return err ? [] : res
        })
      }
    },
    director: { 
      type: DirectorType,
      args: { id: { type: GraphQLID }},
      resolve(parent, args) {
        return Directors.findById(args.id, (err, res) => {
          return err ? [] : res
        })
      }
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        return Movies.find({}, (err, res) => {
          return err ? [] : res
        })
      }
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve(parent, args) {
        return Directors.find({}, (err, res) => {
          return err ? [] : res
        })
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation
})