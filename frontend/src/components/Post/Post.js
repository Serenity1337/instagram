import React, { useState, useEffect } from 'react'
import classes from './Post.module.scss'
import Postcomment from '../Postcomment'
export const Post = (props) => {
  const [postUser, setpostUser] = useState({})
  const [comments, setcomments] = useState([])
  const [commentState, setcommentState] = useState('')
  const [liked, setliked] = useState(false)
  const [post, setpost] = useState({})
  const commentInput = React.createRef()
  useEffect(() => {
    
    setcomments(props.post.comments)
    setpost(props.post)
    console.log(props.post)
    const usersWhoLikedPostArr = [...props.post.likedBy]
    const found = usersWhoLikedPostArr.includes(props.currentUserName)
    if (found) {
      setliked(true)
    } else {
      setliked(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const commentInputHandler = (event) => {
    setcommentState(event.target.value)
  }
  const commentPostHandler = () => {
    const newComment = {
      caption: commentState,
      poster: props.currentUserName,
      likedBy: [],
      likes: 0,
      id: Date.now(),
      replies: [],
    }
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
        setpost(postCopy)
        return header.json()
      } else {
        console.log(header)
      }
    })
    commentInput.current.value = ''
  }

  const likeBtnHandler = () => {
    const postClone = { ...props.post }
    const userLikedArr = [...props.post.likedBy, props.currentUserName]
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
    const likes = post.likes - 1
    postClone.likes = likes
    postClone.likedBy = userLikedArr
    setliked(false)

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
            src={`images/avatars/${props.user.avatar}`}
            alt=''
            className={classes.smImg}
          />
          <div className={classes.cardUsername}>{props.user.userName}</div>
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
          <span className={classes.counter}> {props.post.likedBy.length} likes</span>
        </div>

        {comments.map((comment, commentIndex) => (
          <Postcomment
            key={commentIndex}
            comment={comment}
            comments={comments}
            post={post}
            commentIndex={commentIndex}
            setcomments={setcomments}
            users={props.users}
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
