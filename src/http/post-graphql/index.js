let arc = require('@architect/functions')
let {ApolloServer, gql} = require('apollo-server-lambda')

let typeDefs = gql`
  type Query {
    hello: String
    invalid: String
  }
`

let resolvers = {
  Query: {
    hello: () => 'Hello world!',
    invalid: () => { throw new Error('test error') }
  },
}

let server = new ApolloServer({typeDefs, resolvers})
let handler = server.createHandler()

exports.handler = function(event, context, callback) {
  let body = arc.http.helpers.bodyParser(event)
  // Support for AWS HTTP API syntax
  event.httpMethod = event.httpMethod
    ? event.httpMethod
    : event.requestContext.http.method
  // Body is now parsed, re-encode to JSON for Apollo
  event.body = body
  event.cors = true
  handler(event, context, callback)
}
