import React, { useState, useEffect, useContext } from 'react'
import classes from './Header.module.scss'
import axios from 'axios'
import {UserContext} from '../../userContext'
import {constructDate} from '../../functions'
import { Link } from 'react-router-dom'

export const Header = (props) => {


  const [postFormState, setpostFormState] = useState(false)

  const [captionState, setcaptionState] = useState('')

  const [fileState, setfileState] = useState({})

  const { user, setuser } = useContext(UserContext)

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
    event.preventDefault()
    const data = new FormData()
    data.append('file', fileState)
    axios.post('http://localhost:8000/upload', data, {}).then((res) => {
      console.log(res.statusText)
    })
    const post = {
      picture: fileState.name,
      caption: captionState,
      poster: user._id,
      likedBy: [],
      date: constructDate()
    }
  
    let requestBody =  {
      query:  `mutation {
        createPost(postInput: {
          caption: "${captionState}",
          picture: "${fileState.name}",
          likedBy: [],
          date: "${constructDate()}",
          poster: "${user._id}"
          
        })
        {
          _id
        }
      }`
    }
    const postsArr = [...props.posts, post]
    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((header) => {
      if (header.ok) {
        setpostFormState(false)
        
        props.setposts(postsArr)
        return header.json()
      } else {
        console.log(header)
      }
    })
  }
  return (
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
      <Link to={`/`} className={classes.logo}>
      <i className='fab fa-2x fa-instagram'></i>
        <div className={classes.verticalLine}></div>
        <span className={classes.hidden}>Instagram</span>
        </Link>
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
    
          
          <Link
            to={`/${user.userName}`}>
          <i className='far fa-user'></i>
        </Link>
        
      </div>
    </div>
  </header>
  )
}
