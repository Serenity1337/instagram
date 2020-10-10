import React, { useState, useEffect, useContext } from 'react'
import classes from './Post.module.scss'
import Postcomment from '../Postcomment'
import { constructDate } from '../../functions'
import { UserContext } from '../../userContext'
import { PostsContext } from '../../postsContext'
export const Post = (props) => {
  const [postUser, setpostUser] = useState({})
  const [comments, setcomments] = useState([])
  const [commentState, setcommentState] = useState('')
  const [liked, setliked] = useState(false)
  const [post, setpost] = useState({})
  const { user, setuser } = useContext(UserContext)
  const { posts, setposts } = useContext(PostsContext)
  const commentInput = React.createRef()

  useEffect(() => {
    setcomments(props.post.comments)
    setpost(props.post)
    const usersWhoLikedPostArr = [...props.post.likedBy]
    const found = usersWhoLikedPostArr.includes(`${user._id}`)
    if (found) {
      setliked(true)
    } else {
      setliked(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setcomments(props.post.comments)
  }, [posts])

  const commentInputHandler = (event) => {
    setcommentState(event.target.value)
  }
  const commentPostHandler = () => {
    const newComment = {
      caption: commentState,
      poster: user._id,
      likedBy: [],
      post: props.post._id,
      date: constructDate(),
      replies: [],
    }
    const commentsArr = [...props.post.comments, newComment]
    const postCopy = { ...props.post }
    postCopy.comments = commentsArr
    const allPosts = [...posts]
    allPosts[props.index] = postCopy

    let requestBody = {
      query: `mutation {
        createComment(commentInput: {
          caption: "${commentState}"
          poster: "${user._id}"
          likedBy: []
          post: "${props.post._id}"
          date: "${constructDate()}"
          
        })
        {
          _id
        }
      }`,
    }
    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((header) => {
      if (header.ok) {
        props.setposted(allPosts)
        setposts(allPosts)
        return header.json()
      } else {
        console.log(header)
      }
    })
    commentInput.current.value = ''
  }
  const likeBtnHandler = () => {
    setliked(true)
    const postClone = { ...props.post }
    const userLikedArr = [...props.post.likedBy, user._id]
    postClone.likedBy = userLikedArr

    const allposts = [...props.posts]
    allposts[props.index] = postClone
    const arr = JSON.stringify(userLikedArr)
    let requestBody = {
      query: `mutation {
        postUpdate(postUpdateInput: {
          id: "${props.post._id}",
          likedBy: ${arr}
        })
        {
          _id
        }
      }`,
    }

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((header) => {
      if (header.ok) {
        // props.setposts(allposts)
        // props.setposted(allposts)
        // props.setpostposted(allposts)
        setposts(allposts)
        // props.setposted(allposts)
        return header.json()
      } else {
        console.log(header)
      }
    })
  }

  const unlikeBtnHandler = () => {
    setliked(false)
    const postClone = { ...post }
    const userLikedArr = postClone.likedBy.filter(
      (user) => user._id !== user._id
    )
    const allposts = [...posts]
    allposts[props.index] = postClone
    postClone.likedBy = userLikedArr
    const arr = JSON.stringify(userLikedArr)

    let requestBody = {
      query: `mutation {
        postUpdate(postUpdateInput: {
          id: "${props.post._id}",
          likedBy: ${arr}
        })
        {
          _id
        }
      }`,
    }

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((header) => {
      if (header.ok) {
        // props.setposts(allposts)
        // props.setposted(allposts)
        // props.setpostposted(allposts)
        setposts(allposts)
        return header.json()
      } else {
        console.log(header)
      }
    })
  }

  return (
    <section className={classes.cardContainer}>
      <div className={classes.card}>
        <div className={classes.cardUser}>
          <img
            src={`images/avatars/${user.avatar}`}
            alt=''
            className={classes.smImg}
          />
          <div className={classes.cardUsername}>
            {props.post.poster.userName}
          </div>
        </div>
        <img
          src={`images/postpics/${props.post.picture}`}
          alt=''
          className={classes.cardImage}
        />
        <div className={classes.commentSection}>
          <div className={classes.socialIcons}>
            <div>
              {!liked ? (
                <span className={classes.likeButton}>
                  <i className='far fa-heart' onClick={likeBtnHandler}></i>
                </span>
              ) : (
                <span className={classes.likeButton}>
                  <i className='fas fa-heart' onClick={unlikeBtnHandler}></i>
                </span>
              )}

              <span className={classes.commentButton}>
                <i className='far fa-comment'></i>
              </span>
            </div>
            <i className='far fa-bookmark'></i>
          </div>
        </div>
        <div className={classes.likeSection}>
          <span className={classes.counter}>
            {' '}
            {props.post.likedBy.length} likes
          </span>
        </div>

        {props.post.comments.map((comment, commentIndex) => (
          <Postcomment
            key={commentIndex}
            comment={comment}
            comments={comments}
            post={props.post}
            index={props.index}
            posts={props.posts}
            setposts={props.setposts}
            commentIndex={commentIndex}
            setcomments={setcomments}
            setposted={props.setposted}
          ></Postcomment>
        ))}

        <div className={classes.addAComment}>
          <input
            className={classes.inputAComment}
            type='text'
            placeholder='Add a comment...'
            onChange={commentInputHandler}
            name='commentInput'
            ref={commentInput}
          />
          <div className={classes.postAComment} onClick={commentPostHandler}>
            Post
          </div>
          <div className={classes.line}></div>
          {/* <i className='fas fa-ellipsis-h'></i> */}
        </div>
      </div>
    </section>
  )
}
