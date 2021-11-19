const {gql} = require('apollo-server-express');

const typeDefs = gql`
type Auth {
    token: ID!
    user: User
}
type Query {
    me: User
    users: [User]
    
}
type User {
    _id: ID!
    username: String!
    email: String
    bookCount: Int
    savedBooks: [Book]
}
type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook( bookId: String, authors: [String], description: String, title: String!, image: String, link: String): User
    removeBook(bookId: String!): User
}

type Book {
    bookId: String
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
}

`;

module.exports = typeDefs;