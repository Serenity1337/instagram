import React, { useState, useEffect } from 'react'
import classes from './Profile.module.scss'
import axios from 'axios'
import Post from '../../components/Post'

export const Profile = () => {
  const [posts, setposts] = useState([])

  const [postFormState, setpostFormState] = useState(false)

  const [captionState, setcaptionState] = useState('')

  const [fileState, setfileState] = useState({})

  const currentUserName = JSON.parse(localStorage.getItem('user'))

  const [users, setusers] = useState([])

  const checkIfLoggedIn = () => {
    if (!currentUserName) {
      window.location.href = 'http://localhost:3000/login'
    }
  }
  checkIfLoggedIn()
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
  const postFormHandler = (event) => {
    event.preventDefault()
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
        const postsArr = [...posts]

        console.log(postsArr)
        setposts(postsArr.push(post))
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
          <form onSubmit={postFormHandler}>
            <input type='text' onInput={captionHandler} />
            <input type='file' name='file' onChange={onChangeHandler} />
          </form>
        ) : null}
        <div className={classes.headerContainer}>
          <div className={classes.logo}>
            <i className='fab fa-2x fa-instagram'></i>
            <div className={classes.verticalLine}></div>
            <span className={classes.hidden}>Instagram</span>
          </div>
          <div className={classes.desktop}>
            <div className={classes.searchContainer}>
              <i className='fa fa-search' className={classes.searchIcon}></i>
              <input className={classes.searchBar} placeholder=' Search' />
            </div>
          </div>
          <div className={classes.icons}>
            <span>
              <i className='fas fa-plus' onClick={postHandler}></i>
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
      {posts.map((post, index) => (
        <Post
          post={post}
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
