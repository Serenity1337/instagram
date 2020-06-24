import React, { useState, useEffect } from 'react'
import classes from './Post.module.scss'
export const Post = (props) => {
  const [postUser, setpostUser] = useState({})
  const [comments, setcomments] = useState([])
  const [commentState, setcommentState] = useState('')
  const [liked, setliked] = useState(false)
  const [post, setpost] = useState({})
  useEffect(() => {
    const poster =
      props.users.filter((user) => props.post.poster !== user)[0] || {}

    setpostUser(poster)
  }, [props.users])
  useEffect(() => {
    setcomments(props.post.comments)
    setpost(props.post)
    const usersWhoLikedPostArr = [...props.post.likedBy]
    const found = usersWhoLikedPostArr.includes(props.currentUserName)
    if (found) {
      setliked(true)
    } else {
      setliked(false)
    }
  }, [])
  const commentInputHandler = (event) => {
    setcommentState(event.target.value)
  }
  const commentFormHandler = (event) => {
    event.preventDefault()
    const newComment = {
      caption: commentState,
      poster: props.currentUserName,
      likedBy: [],
      likes: 0,
      id: Date.now(),
    }
    event.target.elements.commentInput.value = ''
    const commentsArr = [...comments, newComment]
    const postCopy = { ...props.post }
    postCopy.comments = commentsArr
    fetch('http://localhost:4000/posts/' + props.post.id, {
      method: 'PUT',
      body: JSON.stringify(postCopy),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((header) => {
      if (header.ok) {
        setcomments(commentsArr)
        return header.json()
      } else {
        console.log(header)
      }
    })
  }

  const likeBtnHandler = () => {
    const postClone = { ...props.post }
    const userLikedArr = [...props.post.likedBy, props.currentUserName]
    console.log(props.post)
    const likes = post.likes + 1
    postClone.likes = likes
    postClone.likedBy = userLikedArr
    setliked(true)

    fetch('http://localhost:4000/posts/' + props.post.id, {
      method: 'PUT',
      body: JSON.stringify(postClone),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((header) => {
      if (header.ok) {
        setpost(postClone)
        return header.json()
      } else {
        console.log(header)
      }
    })
  }

  const unlikeBtnHandler = () => {
    const postClone = { ...post }
    const userLikedArr = postClone.likedBy.filter(
      (user) => user !== props.currentUserName
    )
    console.log(userLikedArr)
    console.log(props.post)
    const likes = post.likes - 1
    postClone.likes = likes
    postClone.likedBy = userLikedArr
    setliked(false)

    console.log(postClone)

    fetch('http://localhost:4000/posts/' + props.post.id, {
      method: 'PUT',
      body: JSON.stringify(postClone),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((header) => {
      if (header.ok) {
        setpost(postClone)
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
            src={`images/avatars/${postUser.avatar}`}
            alt=''
            className={classes.smImg}
          />
          <div className={classes.cardUsername}>{props.post.poster}</div>
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
          <span className={classes.counter}>{post.likes} likes</span>
        </div>
        <div className={classes.comments}>
          {comments.map((comment, index) => (
            <div className={classes.commDiv} key={index}>
              <span className={classes.bold}>{comment.poster}</span>
              <span>{comment.caption}</span>
            </div>
          ))}
        </div>
        <div className={classes.addAComment}>
          <form onSubmit={commentFormHandler}>
            <input
              className={classes.inputAcomment}
              type='text'
              placeholder='Add a comment...'
              onChange={commentInputHandler}
              name='commentInput'
            />
            <i className='fas fa-ellipsis-h'></i>
          </form>
        </div>
      </div>
    </section>
  )
}
