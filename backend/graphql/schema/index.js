const { buildSchema} = require('graphql')

module.exports = buildSchema(`
type post {
  _id: ID!
  caption: String!
  picture: String!
  poster: user! 
  comments: [comment!]!
  likedBy: [String!]!
  date: String!
}

type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
}

type comment {
  _id: ID!
  caption: String!
  poster: user!
  likedBy: [String!]!
  post: post!
  replies: [reply!]!
  date: String!
}

type reply {
  _id: ID!
  caption: String!
  poster: user!
  likedBy: [String!]!
  comment: comment!
  date: String!
}

type user {
  _id: ID!
  userName: String!
  password: String!
  email: String!
  avatar: String!
  followedBy: [String!]!
  following: [String!]!
  posts: [post!]!
  comments: [comment!]!
  replies: [reply!]!
}

input postInput {
  caption: String!
  picture: String!
  likedBy: [String!]! 
  date: String!
  poster: String!
}

input postUpdateInput {
  id: String!
  likedBy: [String!]!
}

input userInput {
  userName: String!
  password: String!
  email: String!
  avatar: String!
  followedBy: [String!]!
  following: [String!]!
}

input userUpdateInput {
  id: String!
  avatar: String
  followedBy: [String]
  following: [String]
}

input commentInput {
  
  caption: String!
  poster: String!
  likedBy: [String!]!
  post: String!
  date: String!
}

input commentUpdateInput {
  id: String!
  likedBy: [String!]!
}

input replyInput {
  caption: String!
  poster: String!
  likedBy: [String!]!
  comment: String!
  date: String!
}

input replyUpdateInput {
  id: String!
  likedBy: [String!]!
}

type RootQuery {
    posts: [post]
    user(id: String!): user
    comments: [comment]
    replies: [reply]
    login(email: String!, password: String!): AuthData
    users: [user]
}

type RootMutation {
    createPost(postInput: postInput): post

    createUser(userInput: userInput): user

    createComment(commentInput: commentInput): comment

    createReply(replyInput: replyInput):reply

    postUpdate(postUpdateInput: postUpdateInput): post

    replyUpdate(replyUpdateInput: replyUpdateInput): reply

    userUpdate(userUpdateInput:userUpdateInput): user

    commentUpdate(commentUpdateInput:commentUpdateInput): comment
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`)





// input comQueryUpdateInput {
//   _id: String
//   likedBy: [String]
//   views: Int
//   likes: Int
//   returningAnswer: String
// }

// input replyUpdateInput {
//   id: String
//   answer: String
//   poster: String
//   date: String
//   status: String
// }