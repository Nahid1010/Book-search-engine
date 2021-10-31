// apollo server
const { gql } = require('apollo-server-express');

// query data
const typeDefs = gql`
  type Book {
    bookId: ID!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }
  input bookInput {
    authors: [String]
    description: String
    title: String
    bookId: String
    image: String
    link: String
  }
  type Auth {
    token: ID!
    user: User
  }
  type Query {
    me: User
  }
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: bookInput!): User
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;