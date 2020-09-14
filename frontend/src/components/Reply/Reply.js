import React, { useState, useEffect } from 'react'
import classes from './Reply.module.scss'
export const Reply = (props) => {
  const currentUserName = JSON.parse(localStorage.getItem('user'))
  const [commentLiked, setcommentLiked] = useState(false)
  const [commPoster, setcommPoster] = useState({})
  const [replyState, setreplyState] = useState(false)
  const [replyFocusState, setreplyFocusState] = useState(false)
  const [replyMsg, setreplyMsg] = useState('')
  const replyInput = React.createRef()
  useEffect(() => {
    const usersWhoLikedCommArr = [...props.reply.likedBy]
    const found = usersWhoLikedCommArr.includes(currentUserName)
    if (found) {
      setcommentLiked(true)
    } else {
      setcommentLiked(false)
    }
    const poster =
      props.users.filter((user) => props.reply.poster !== user)[0] || {}

    setcommPoster(poster)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.users])

  // function for liking a reply
  const replyLikeBtnHandler = () => {
    const postClone = { ...props.post }
    const commentClone = { ...props.comment }
    const commentsClone = [...props.comments]

    commentClone.replies[props.replyIndex].likedBy = [
      ...commentClone.replies[props.replyIndex].likedBy,
      currentUserName,
    ]

    commentClone.replies[props.replyIndex].likes += 1

    commentsClone[props.commentIndex] = commentClone

    postClone.comments = commentsClone

    setcommentLiked(true)

    fetch('http://localhost:4000/posts/' + props.post.id, {
      method: 'PUT',
      body: JSON.stringify(postClone),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((header) => {
      if (header.ok) {
        props.setcommentReplies(commentClone.replies)
        return header.json()
      } else {
        console.log(header)
      }
    })
  }

  // function for unliking a reply
  const replyUnlikeBtnHandler = () => {
    const postClone = { ...props.post }
    const commentClone = { ...props.comment }
    const commentsClone = [...props.comments]

    const userLikedArr = commentClone.replies[props.replyIndex].likedBy.filter(
      (user) => user !== currentUserName
    )
    commentClone.replies[props.replyIndex].likedBy = userLikedArr

    commentClone.replies[props.replyIndex].likes -= 1

    commentsClone[props.commentIndex] = commentClone

    postClone.comments = commentsClone

    setcommentLiked(false)

    fetch('http://localhost:4000/posts/' + props.post.id, {
      method: 'PUT',
      body: JSON.stringify(postClone),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((header) => {
      if (header.ok) {
        props.setcommentReplies(commentClone.replies)
        return header.json()
      } else {
        console.log(header)
      }
    })
  }

  const replyMsgHandler = (event) => {
    setreplyMsg(event.target.value)
  }

  const replyStateHandler = () => {
    setreplyState(true)
  }

  const onFocus = () => {
    setreplyFocusState(true)
  }
  const onBlur = () => {
    setreplyFocusState(false)
  }

  const cancelBtnHandler = () => {
    setreplyState(false)
  }

  const replyBtnHandler = () => {
    const newComment = {
      caption: `@${props.reply.poster} ${replyMsg}`,
      poster: currentUserName,
      likedBy: [],
      likes: 0,
      id: Date.now(),
      replies: [],
    }
    const repliesArr = [...props.comment.replies, newComment]
    const postCopy = { ...props.post }
    postCopy.comments[props.commentIndex].replies = repliesArr
    fetch('http://localhost:4000/posts/' + props.post.id, {
      method: 'PUT',
      body: JSON.stringify(postCopy),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((header) => {
      if (header.ok) {
        props.setcommentReplies(repliesArr)
        setreplyState(false)
        return header.json()
      } else {
        console.log(header)
      }
    })
    replyInput.current.value = ''
  }

  return (
    <div className={classes.comments}>
      <div className={classes.commDiv}>
        <div className={classes.flex}>
          <img
            src={`images/avatars/${commPoster.avatar}`}
            alt=''
            className={classes.smImg}
          />
          <div className={classes.comment}>
            <span className={classes.bold}>{props.reply.poster}</span>
            <span className={classes.commCaption}>{props.reply.caption}</span>
          </div>
        </div>
        {!commentLiked ? (
          <span className={classes.comLikeButton}>
            <i className='far fa-heart' onClick={replyLikeBtnHandler}></i>
          </span>
        ) : (
          <span className={classes.comLikeButton}>
            <i className='fas fa-heart' onClick={replyUnlikeBtnHandler}></i>
          </span>
        )}
      </div>

      <span className={classes.commLikes}>{props.reply.likes} likes</span>
      <span className={classes.replyBtn} onClick={replyStateHandler}>
        reply
      </span>
      {replyState ? (
        <div className={classes.container}>
          <input
            className={classes.inputAComment}
            type='text'
            placeholder='Add a public reply...'
            onChange={replyMsgHandler}
            name='commentInput'
            onFocus={onFocus}
            onBlur={onBlur}
            ref={replyInput}
          />
          <div
            className={!replyFocusState ? classes.line : classes.line2}
          ></div>
          <div className={classes.btnGrp}>
            <div className={classes.postCancelBtn} onClick={cancelBtnHandler}>
              CANCEL
            </div>
            <div className={classes.postReplyBtn} onClick={replyBtnHandler}>
              POST
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
