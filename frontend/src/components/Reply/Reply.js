import React, { useState, useEffect, useContext } from 'react'
import classes from './Reply.module.scss'
import { UserContext } from '../../userContext'
import { constructDate } from '../../functions'
import { PostsContext } from '../../postsContext'
import { UsersContext } from '../../usersContext'
import { postRequest } from '../../api'
export const Reply = (props) => {
  const [commentLiked, setcommentLiked] = useState(false)
  const [replyState, setreplyState] = useState(false)
  const [replyFocusState, setreplyFocusState] = useState(false)
  const [replyMsg, setreplyMsg] = useState('')
  const { user, setuser } = useContext(UserContext)
  const { posts, setposts } = useContext(PostsContext)
  const { users, setusers } = useContext(UsersContext)
  const replyInput = React.createRef()
  useEffect(() => {
    const usersWhoLikedCommArr = [...props.reply.likedBy]
    const found = usersWhoLikedCommArr.includes(user._id)
    if (found) {
      setcommentLiked(true)
    } else {
      setcommentLiked(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users])

  // function for liking a reply
  const replyLikeBtnHandler = () => {
    const postClone = { ...props.post }
    const commentClone = { ...props.comment }
    const commentsClone = [...props.comments]

    commentClone.replies[props.replyIndex].likedBy = [
      ...commentClone.replies[props.replyIndex].likedBy,
      user._id,
    ]
    commentsClone[props.commentIndex] = commentClone

    postClone.comments = commentsClone

    const arr = JSON.stringify(commentClone.replies[props.replyIndex].likedBy)

    const allPosts = [...posts]
    allPosts[props.index] = postClone

    let requestBody = {
      query: `
      mutation {
        replyUpdate(replyUpdateInput: {
          id: "${props.reply._id}"
          likedBy: ${arr}
        }) 
        
         {
          _id
        }
      }
      `,
    }

    setcommentLiked(true)

    postRequest(requestBody).then((response) => {
      if (response) props.setposted(allPosts)
    })
  }

  // function for unliking a reply
  const replyUnlikeBtnHandler = () => {
    const postClone = { ...props.post }
    const commentClone = { ...props.comment }
    const commentsClone = [...props.comments]

    const userLikedArr = commentClone.replies[props.replyIndex].likedBy.filter(
      (user) => user._id !== user._id
    )
    commentClone.replies[props.replyIndex].likedBy = userLikedArr

    commentsClone[props.commentIndex] = commentClone

    postClone.comments = commentsClone

    const allPosts = [...posts]

    allPosts[props.index] = postClone

    const arr = JSON.stringify(userLikedArr)

    let requestBody = {
      query: `
      mutation {
        replyUpdate(replyUpdateInput: {
          id: "${props.reply._id}"
          likedBy: ${arr}
        }) 
        
         {
          _id
        }
      }
      `,
    }

    setcommentLiked(false)

    postRequest(requestBody).then((response) => {
      if (response) props.setposted(allPosts)
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
      date: constructDate(),
    }
    console.log('asd')
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
      }`,
    }
    const allPosts = [...posts]
    const repliesArr = [...props.comment.replies, newComment]
    const postCopy = { ...props.post }
    postCopy.comments[props.commentIndex].replies = repliesArr
    allPosts[props.index] = postCopy

    postRequest(requestBody).then((response) => {
      if (response) props.setposted(allPosts)
    })
    replyInput.current.value = ''
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
            <span className={classes.bold}>{props.reply.poster.userName}</span>
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

      <span className={classes.commLikes}>
        {props.reply.likedBy.length} likes
      </span>
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
