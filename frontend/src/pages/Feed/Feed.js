import React, { useState, useEffect, useContext } from 'react'
import classes from './Feed.module.scss'
import axios from 'axios'
import Post from '../../components/Post'
import { UserContext } from '../../userContext'
import { PostsContext } from '../../postsContext'
import { constructDate } from '../../functions'
import { Link } from 'react-router-dom'
import { UsersContext } from '../../usersContext'

export const Feed = (props) => {
  const [postFormState, setpostFormState] = useState(false)

  const [captionState, setcaptionState] = useState('')

  const [fileState, setfileState] = useState({})

  const { users, setusers } = useContext(UsersContext)

  const { user, setuser } = useContext(UserContext)

  const { posts, setposts } = useContext(PostsContext)

  const [postposted, setpostposted] = useState(0)

  const [counter, setcounter] = useState(1)
  useEffect(() => {}, [])

  return (
    <>
      {posts.length > 0
        ? posts.map((post, index) => (
            <Post
              users={props.users}
              setusers={props.setusers}
              post={post}
              posts={posts}
              setposts={setposts}
              index={index}
              key={index}
              setposted={props.setposted}
              posted={props.posted}
              setpostposted={setpostposted}
              // postUser={postUser}
              // setpostUser={setpostUser}
            ></Post>
          ))
        : null}
    </>
  )
}
