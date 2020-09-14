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
input userInput {
  userName: String!
  password: String!
  email: String!
  avatar: String!
  followedBy: [String!]!
  following: [String!]!
 
  
}
input commentInput {
  caption: String!
  poster: String!
  likedBy: [String!]!
  post: String!
  date: String!
}

input replyInput {
  caption: String!
  poster: String!
  likedBy: [String!]!
  comment: String!
  date: String!
}

type RootQuery {
    posts: [post]
    users: [user]
    comments: [comment]
    replies: [reply]
}

type RootMutation {
    createPost(postInput: postInput): post
    createUser(userInput: userInput): user
    createComment(commentInput: commentInput): comment
    createReply(replyInput: replyInput):reply


}

schema {
    query: RootQuery
    mutation: RootMutation
}
`)


// updatecomQuery(comQueryUpdateInput: comQueryUpdateInput): comQuery
// updateReply(replyUpdateInput: replyUpdateInput): reply


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