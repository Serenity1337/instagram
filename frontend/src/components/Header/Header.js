import React, { useState, useEffect, useContext } from 'react'
import classes from './Header.module.scss'
import axios from 'axios'
import { UserContext } from '../../userContext'
import { UsersContext } from '../../usersContext'
import { constructDate } from '../../functions'
import { Link } from 'react-router-dom'
import { postRequest } from '../../api'

export const Header = (props) => {
  const [postFormState, setpostFormState] = useState(false)

  const [captionState, setcaptionState] = useState('')

  const [fileState, setfileState] = useState({})

  const { user, setuser } = useContext(UserContext)

  const { users, setusers } = useContext(UsersContext)

  const [filteredUsers, setfilteredUsers] = useState([])

  const postHandler = () => {
    setpostFormState(true)
  }

  const logoutHandler = () => {
    localStorage.removeItem('token')
  }
  const searchFilterHandler = (event) => {
    if (!event.target.value) {
      setfilteredUsers([])
    } else {
      const displayUsers = users.filter((data) => {
        if (event.target.value === null) return []
        else if (
          data.userName
            .toLowerCase()
            .includes(event.target.value.toLowerCase()) ||
          data.fullName.toLowerCase().includes(event.target.value.toLowerCase())
        ) {
          return data
        }
      })
      setfilteredUsers(displayUsers)
    }
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
      date: constructDate(),
      comments: [],
    }

    let requestBody = {
      query: `mutation {
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
      }`,
    }

    postRequest(requestBody).then((response) => {
      if (response) {
        console.log(response)
        const postsArr = [...props.posts, post]

        setpostFormState(false)

        props.setposts(postsArr)
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
            <input
              className={classes.searchBar}
              placeholder=' Search'
              onChange={searchFilterHandler}
            />
            <ul
              className={`
                ${
                  filteredUsers.length > 0
                    ? classes.userLinkContainer
                    : classes.invisible
                } ${filteredUsers.length >= 5 ? classes.overFlow : null}`}
            >
              {filteredUsers.length > 0
                ? filteredUsers.map((info, index) => (
                    <li className={classes.userLink} key={index}>
                      <Link to={`/${info.userName}`}>
                        <img
                          src={`images/avatars/${info.avatar}`}
                          alt=''
                          className={classes.smImg}
                        />
                        <div className={classes.userInfo}>
                          <div className={classes.nickName}>
                            {info.fullName}
                          </div>
                          <div className={classes.realName}>
                            {info.userName}
                          </div>
                        </div>
                        {/* <span>{data.country}</span> */}
                      </Link>
                    </li>
                  ))
                : null}
            </ul>
            {/* {keyword ? filteredUsers : null} */}
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

          {user !== null ? (
            <Link to={`/${user.userName}`}>
              <i className='far fa-user'></i>
            </Link>
          ) : null}
          <Link to={`/login`} onClick={logoutHandler}>
            Logout
          </Link>
        </div>
      </div>
    </header>
  )
}
