const User = require('../../models/userModel');

const Post = require('../../models/postModel');

const Comment = require('../../models/commentModel')

const Reply = require('../../models/replyModel')


const user = userId => {
  return User.findById(userId)
  .then(user => {
    return {...user._doc, _id: user.id,
       posts: posts.bind(this, user._doc.posts),  
    comments: comments.bind(this, user._doc.comments)}
  })
  .catch(err => {
    throw err
  })
}

const post = postId => {
  return Post.findById(postId)
  .then(post => {
    return {...post._doc, _id: post.id,
    comments: comments.bind(this, post._doc.comments)
    }
  })
}
const comment = commentId => {
  return Comment.findById(commentId)
  .then(comment => {
    return {...comment._doc, _id: comment.id, replies: replies.bind(this, comment._doc.replies)}
  })
}
const posts = postsIds => {
  return Post.find({_id: {$in: postsIds}})
  .then (posts => {
    return posts.map(post => {
      return { ...post._doc, _id: post.id, user: user.bind(this, post.user)}
    })
  })
}

const comments = commentsIds => {
  return Comment.find({_id: {$in: commentsIds}})
  .then (comments => {
    return comments.map(comment => {
      return { ...comment._doc, _id: comment.id, poster: user.bind(this, comment.poster)}
    })
  })
}

const replies = repliesIds => {
  return Reply.find({_id: {$in: repliesIds}})
  .then (replies => {
    return replies.map(reply => {
      return { ...reply._doc, _id: reply.id, poster: user.bind(this, reply.poster)}
    })
  })
}
module.exports = {

  users: () => {
    return User.find()
    .then(users => {
      return users.map(user => {
        return {
          ...user._doc,
          _id: user.id,
           posts: posts.bind(this, user.posts,
            ),
            comments: comments.bind(this, user.comments),
            replies: replies.bind(this, user.replies)
          
          
        }
      })
    })
    .catch(err => {
      throw err;
    })

  },
  posts: () => {
    return Post.find()
    .then(posts => {
      return posts.map(post => {
        return {
          ...post._doc,
          _id: post.id,
          poster: user.bind(this, post.poster,),
          comments: comments.bind(this, post.comments)
        }
      })
    })
    .catch(err => {
      throw err;
    })

  },
  comments: () => {
    return Comment.find()
    .then(comments => {
      return comments.map(comment => {
        return {
          ...comment._doc,
          _id: comment.id,
          poster: user.bind(this, comment.poster),
          post: post.bind(this, comment.post),
          replies: replies.bind(this, comment.replies)
        }
      })
    })
  },
  replies: () => {
    return Reply.find()
    .then(replies => {
      return replies.map(reply => {
        return {
          ...reply.doc,
          _id: reply.id,
          poster: user.bind(this, reply.poster),
          comment: comment.bind(this, reply.comment)
        }
      })
    })
  },
  createUser: args => {
    const user = new User({
      userName: args.userInput.userName,
      password: args.userInput.password,
      email: args.userInput.email,
      avatar: args.userInput.avatar,
      followedBy: args.userInput.followedBy,
      following: args.userInput.following
    });
    return user
      .save()
      .then(result => {
        console.log(result);
        return { ...result._doc, _id: result._doc._id.toString() };
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
  createComment: args => {
    const comment = new Comment({
      caption: args.commentInput.caption,
      poster: args.commentInput.poster,
      likedBy: args.commentInput.likedBy,
      post: args.commentInput.post,
      date: args.commentInput.date

    })
    let comments
    return comment
    .save()
    .then(result => {
      console.log(result)
      comments = { ...result._doc, _id: result._doc._id.toString(),
      poster: user.bind(this, result._doc.poster),
      post: post.bind(this, result._doc.post)
      }
      return User.findById(comment.poster)
      .then(user => {
        user.comments.push(comment)
        return user.save()
      }).then(result => {
        return Post.findById(comment.post)
        .then(post => {
          post.comments.push(comment)
          return post.save()
        }).then(result => {
          return comments
        })
      })
    })
    .catch(err => {
      console.log(err)
      throw err
    })
  },
  createReply: args => {
    const reply = new Reply({
      caption: args.replyInput.caption,
      poster: args.replyInput.poster,
      likedBy: args.replyInput.likedBy,
      comment: args.replyInput.comment,
      date: args.replyInput.date

    })
    
    let replies
    return reply
    .save()
    .then(result => {
      console.log(result)
      console.log(result._doc)
      replies = { ...result._doc, _id: result._doc._id.toString(),
      poster: user.bind(this, result._doc.poster),
      comment: comment.bind(this, result._doc.comment)
      }
      return User.findById(reply.poster)
      .then(user => {
        user.replies.push(reply)
        return user.save()
      }).then(result => {
        return Comment.findById(reply.comment)
        .then(comment => {
          comment.replies.push(reply)
          return comment.save()
        }).then(result => {
          return replies
        })
      })
    })
    .catch(err => {
      console.log(err)
      throw err
    })
  },
  createPost: args => {
    const post = new Post({
      caption: args.postInput.caption,
      picture: args.postInput.picture,
      date: args.postInput.date,
      likedBy: args.postInput.likedBy,
      poster: args.postInput.poster
    });
    let posts;
    return post
      .save()
      .then(result => {
        posts = { ...result._doc, _id: result._doc._id.toString(), poster: user.bind(this, result._doc.poster) }
        return User.findById(post.poster)
        
      })
      .then(user => {
        user.posts.push(post)
        return user.save()
      }).then(result => {
        return posts
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
//   comQueryUpdate: args => {
//     return new Promise ((resolve, reject)=> {
//     Question.update(
//       { _id: args.comQueryUpdateInput.id },
//       {
//         $set: {
//           views: args.comQueryUpdateInput.views,
//           likes: args.comQueryUpdateInput.likes,
//           likedBy: args.comQueryUpdateInput.likedBy,
//           returningAnswer: args.comQueryUpdateInput.returningAnswer

//         },
//       }.exec((err, res) => {
//         console.log('test', res)
//         if(err) reject(err)
//         else resolve(res)
//     })
//     )
//   })
   
//   },
//   updateReply: args => {
//     return new Promise ((resolve, reject)=> {
//       Reply.findOneAndUpdate(
//         {_id: args.replyUpdateInput.id},
//         {
//           $set: {
//             answer: args.replyUpdateInput.answer,
//             poster: args.replyUpdateInput.poster,
//             date: args.replyUpdateInput.date,
//             status: args.replyUpdateInput.status
      
//           },

//         },
//         {new: true},
        
//       )
//     .exec((err, res) => {
//           console.log('test', res)
//           if(err) reject(err)
//           else resolve(res)
//       })
//     })
//   }
 }










