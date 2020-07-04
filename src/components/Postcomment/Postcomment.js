import React, { useState, useEffect } from 'react'
import classes from './Postcomment.module.scss'
import { Reply } from '../Reply/Reply'
export const Postcomment = (props) => {
  const currentUserName = JSON.parse(localStorage.getItem('user'))
  const [commentLiked, setcommentLiked] = useState(false)
  const [commPoster, setcommPoster] = useState({})
  const [replyState, setreplyState] = useState(false)
  const [replyFocusState, setreplyFocusState] = useState(false)
  const [replyMsg, setreplyMsg] = useState('')
  const [commentReplies, setcommentReplies] = useState([])
  const [showReplies, setshowReplies] = useState(false)
  const [replyCount, setreplyCount] = useState(Number)
  const replyCommInput = React.createRef()
  useEffect(() => {
    const usersWhoLikedCommArr = [...props.comment.likedBy]
    const found = usersWhoLikedCommArr.includes(currentUserName)

    if (found) {
      setcommentLiked(true)
    } else {
      setcommentLiked(false)
    }
    const poster =
      props.users.filter((user) => props.comment.poster !== user)[0] || {}

    setcommPoster(poster)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.users])

  useEffect(() => {
    setreplyCount(props.comment.replies.length)
  }, [props.comment.replies.length])
  useEffect(() => {
    setcommentReplies(props.comment.replies)
  }, [props.comment.replies])

  // function for liking a comment
  const comLikeBtnHandler = () => {
    const postClone = { ...props.post }
    const commentClone = { ...props.comment }
    const commentsClone = [...props.comments]

    commentClone.likedBy = [...commentClone.likedBy, currentUserName]

    commentClone.likes += 1

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
        props.setcomments(commentsClone)
        return header.json()
      } else {
        console.log(header)
      }
    })
  }
  // function for unliking a comment
  const comUnlikeBtnHandler = () => {
    const postClone = { ...props.post }
    const commentClone = { ...props.comment }
    const commentsClone = [...props.comments]

    const userLikedArr = commentClone.likedBy.filter(
      (user) => user !== currentUserName
    )

    commentClone.likedBy = userLikedArr

    commentClone.likes -= 1

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
        props.setcomments(commentsClone)
        // setreplyCount(commentClone.replies.length)
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
      caption: `@${props.comment.poster} ${replyMsg}`,
      poster: currentUserName,
      likedBy: [],
      likes: 0,
      id: Date.now(),
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
        setcommentReplies(repliesArr)
        setreplyState(false)
        return header.json()
      } else {
        console.log(header)
      }
    })
    replyCommInput.current.value = ''
  }
  const viewReplies = () => {
    setshowReplies(true)
  }
  const hideReplies = () => {
    setshowReplies(false)
  }
  const viewRepliesRender = () => {
    if (replyCount >= 1) {
      if (!showReplies) {
        return (
          <div
            className={classes.viewReplies}
            onClick={viewReplies}
          >{`View ${props.comment.replies.length} replies`}</div>
        )
      } else {
        return (
          <div
            className={classes.hideReplies}
            onClick={hideReplies}
          >{`Hide ${props.comment.replies.length} replies`}</div>
        )
      }
    } else {
      return null
    }
  }
  const replyHandler = (reply, replyIndex) => {
    if (showReplies) {
      return (
        <Reply
          key={replyIndex}
          comment={props.comment}
          commentIndex={props.commentIndex}
          reply={reply}
          replyIndex={replyIndex}
          post={props.post}
          comments={props.comments}
          users={props.users}
          commentReplies={commentReplies}
          setcommentReplies={setcommentReplies}
        ></Reply>
      )
    }
    return null
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
            <span className={classes.bold}>{props.comment.poster}</span>
            <span className={classes.commCaption}>{props.comment.caption}</span>
          </div>
        </div>
        {!commentLiked ? (
          <span className={classes.comLikeButton}>
            <i className='far fa-heart' onClick={comLikeBtnHandler}></i>
          </span>
        ) : (
          <span className={classes.comLikeButton}>
            <i className='fas fa-heart' onClick={comUnlikeBtnHandler}></i>
          </span>
        )}
      </div>
      <span className={classes.commLikes}>{props.comment.likes} likes</span>
      <span className={classes.replyBtn} onClick={replyStateHandler}>
        reply
      </span>
      {viewRepliesRender()}
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
            ref={replyCommInput}
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

      {commentReplies.map((reply, replyIndex) =>
        replyHandler(reply, replyIndex)
      )}
    </div>
  )
}