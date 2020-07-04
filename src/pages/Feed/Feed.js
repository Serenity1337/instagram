import React, { useState, useEffect } from 'react'
import classes from './Feed.module.scss'
import axios from 'axios'
import Post from '../../components/Post'

export const Feed = () => {
  const [posts, setposts] = useState([])

  const [postFormState, setpostFormState] = useState(false)

  const [captionState, setcaptionState] = useState('')

  const [fileState, setfileState] = useState({})

  const currentUserName = JSON.parse(localStorage.getItem('user'))

  const [users, setusers] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('http://localhost:4000/posts')
      const postsResponse = await response.json()
      setposts(postsResponse)
    }
    fetchPosts()
    const fetchUsers = async () => {
      const response = await fetch('http://localhost:4000/users')
      const usersResponse = await response.json()
      setusers(usersResponse)
    }
    fetchUsers()
    const checkIfLoggedIn = () => {
      if (!currentUserName) {
        window.location.href = 'http://localhost:3000/login'
      }
    }
    checkIfLoggedIn()
  }, [])

  const postHandler = () => {
    setpostFormState(true)
  }
  const onChangeHandler = (event) => {
    setfileState(event.target.files[0])
  }

  const captionHandler = (event) => {
    setcaptionState(event.target.value)
  }
  const cancelPostFormHandler = () => {
    setpostFormState(false)
  }
  const postFormHandler = (event) => {
    const data = new FormData()
    data.append('file', fileState)
    axios.post('http://localhost:8000/upload', data, {}).then((res) => {
      console.log(res.statusText)
    })
    const post = {
      picture: fileState.name,
      caption: captionState,
      poster: currentUserName,
      likes: 0,
      likedBy: [],
      comments: [],
    }
    fetch('http://localhost:4000/posts', {
      method: 'POST',
      body: JSON.stringify(post),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((header) => {
      if (header.ok) {
        setpostFormState(false)
        const postsArr = [...posts, post]
        setposts(postsArr)
        return header.json()
      } else {
        console.log(header)
      }
    })
  }
  return (
    <>
      <header>
        {postFormState ? (
          <div className={classes.background}>
            <div className={classes.postContainer}>
              <input type='text' onInput={captionHandler} />
              <input type='file' name='file' onChange={onChangeHandler} />
              <div className={classes.btnContainer}>
                <div
                  className={classes.cancelBtn}
                  onClick={cancelPostFormHandler}
                >
                  Cancel
                </div>
                <div className={classes.postBtn} onClick={postFormHandler}>
                  Post
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div className={classes.headerContainer}>
          <div className={classes.logo}>
            <i className='fab fa-2x fa-instagram'></i>
            <div className={classes.verticalLine}></div>
            <span className={classes.hidden}>Instagram</span>
          </div>
          <div className={classes.desktop}>
            <div className={classes.searchContainer}>
              <i className={`fa fa-search ${classes.searchIcon} `}></i>
              <input className={classes.searchBar} placeholder=' Search' />
            </div>
          </div>
          <div className={classes.icons}>
            <span>
              <i
                className={`fas fa-plus ${classes.togglePost}`}
                onClick={postHandler}
              ></i>
            </span>
            <span>
              <i className='far fa-compass'></i>
            </span>
            <span>
              <i className='far fa-heart'></i>
            </span>
            <span>
              <i className='far fa-user'></i>
            </span>
          </div>
        </div>
      </header>
      {posts.map((poster, index) => (
        <Post
          post={poster}
          index={index}
          key={index}
          users={users}
          currentUserName={currentUserName}
          // postUser={postUser}
          // setpostUser={setpostUser}
        ></Post>
      ))}
    </>
  )
}
