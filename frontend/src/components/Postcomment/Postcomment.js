import React, { useState, useEffect, useContext } from 'react'
import classes from './Postcomment.module.scss'
import { Reply } from '../Reply/Reply'
import {UserContext} from '../../userContext'
import {constructDate} from '../../functions'
export const Postcomment = (props) => {
  const [commentLiked, setcommentLiked] = useState(false)
  const [replyState, setreplyState] = useState(false)
  const [replyFocusState, setreplyFocusState] = useState(false)
  const [replyMsg, setreplyMsg] = useState('')
  const [commentReplies, setcommentReplies] = useState([])
  const [showReplies, setshowReplies] = useState(false)
  const [replyCount, setreplyCount] = useState(Number)
  const replyCommInput = React.createRef()
  const { user, setuser } = useContext(UserContext)
  useEffect(() => {
    const usersWhoLikedCommArr = [...props.comment.likedBy]
    const found = usersWhoLikedCommArr.includes(`${user._id}`)
    if (found) {
      setcommentLiked(true)
    } else {
      setcommentLiked(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])


 

    useEffect(() => {
      setcommentReplies(props.comment.replies)
    }, [props.comment.replies])



  // function for liking a comment
  const comLikeBtnHandler = () => {
    const postClone = { ...props.post }
    const commentClone = { ...props.comment }
    const commentsClone = [...props.comments]

    commentClone.likedBy = [...commentClone.likedBy, user._id]

    commentsClone[props.commentIndex] = commentClone

    postClone.comments = commentsClone

    const arr = JSON.stringify(commentClone.likedBy)

    const allPosts = [...props.posts]

    allPosts[props.index] = postClone

    let requestBody = {
      query: `mutation {
        commentUpdate(commentUpdateInput: {
          id: "${props.comment._id}"
          likedBy: ${arr}
          
        })
        {
          _id
        }
      }`
    }

    setcommentLiked(true)

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((header) => {
      if (header.ok) {
        props.setcomments(commentsClone)
        props.setposts(allPosts)
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
      (user) => user._id !== user._id
    )

    commentClone.likedBy = userLikedArr

    commentsClone[props.commentIndex] = commentClone

    postClone.comments = commentsClone

    const arr = JSON.stringify(userLikedArr)

    const allPosts = [...props.posts]

    allPosts[props.index] = postClone

    let requestBody = {
      query: `mutation {
        commentUpdate(commentUpdateInput: {
          id: "${props.comment._id}"
          likedBy: ${arr}
          
        })
        {
          _id
        }
      }`
    }

    setcommentLiked(false)

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((header) => {
      if (header.ok) {
        props.setcomments(commentsClone)
        props.setposts(allPosts)
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
      caption: `@${props.comment.poster.userName} ${replyMsg}`,
      poster: user._id,
      likedBy: [],
      comment: props.comment._id,
      date: constructDate()
    }

    const requestBody = {
      query: `mutation {
        createReply(replyInput: {
          caption: "@${props.comment.poster.userName} ${replyMsg}"
          poster: "${user._id}"
          likedBy: []
          comment: "${props.comment._id}"
          date: "${constructDate()}"
        })
        {
          _id
        }
      }`
    }

    const repliesArr = [...props.comment.replies, newComment]
    const postCopy = { ...props.post }
    postCopy.comments[props.commentIndex].replies = repliesArr
    const allPosts = [...props.posts]
    allPosts[props.index] = postCopy

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((header) => {
      if (header.ok) {
        props.setposts(allPosts)
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
    if (props.comment.replies.length >= 1) {
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
          posts={props.posts}
          setposts={props.setposts}
          comments={props.comments}
          setcomments={props.setcomments}
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
            src={`images/avatars/${user.avatar}`}
            alt=''
            className={classes.smImg}
          />
          <div className={classes.comment}>
            <span className={classes.bold}>{props.comment.poster.userName}</span>
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
      <span className={classes.commLikes}>{props.comment.likedBy.length} likes</span>
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
