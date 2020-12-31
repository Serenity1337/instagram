import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../userContext'
import classes from './ProfileSettings.module.scss'
import Header from '../../components/Header'
import Axios from 'axios'
import { PostsContext } from '../../postsContext'
import { UsersContext } from '../../usersContext'
import { postRequest } from '../../api'

export const ProfileSettings = (props) => {
  //states
  const { user, setuser } = useContext(UserContext)
  const { users, setusers } = useContext(UsersContext)
  const [profileInfo, setprofileInfo] = useState({})
  const { posts, setposts } = useContext(PostsContext)
  const [profile, setprofile] = useState(true)
  const [emailError, setemailError] = useState(false)
  const [userNameError, setuserNameError] = useState(false)
  const [passwordError, setpasswordError] = useState('')
  const [changePassword, setchangePassword] = useState(false)
  //states

  //refs
  const uploadBtn = React.createRef()
  const userNameInput = React.createRef()
  const nameInput = React.createRef()
  const bioInput = React.createRef()
  const emailInput = React.createRef()
  const phoneInput = React.createRef()
  const genderInput = React.createRef()
  const oldPassInput = React.createRef()
  const newPassInput = React.createRef()
  const rnewPassInput = React.createRef()
  //refs

  //fetch posts
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'))
    if (token === null) {
      window.location.href = 'http://localhost:3000/login'
    }
  }, [])
  //fetch posts

  //input state handlers
  const profileInputHandler = (event) => {
    setprofileInfo({ ...profileInfo, [event.target.name]: event.target.value })
  }
  const changePasswordRender = () => {
    setchangePassword(true)
    setprofile(false)
  }
  const changeProfileRender = () => {
    setprofile(true)
    setchangePassword(false)
  }
  //input state handlers

  //edit profile handler
  const userSubmitHandler = () => {
    let nameCopy = ''
    let userNameCopy = ''
    let bioCopy = ''
    let phoneCopy = ''
    let genderCopy = ''
    let emailCopy = ''
    let allUsers = [...users]
    let userCopy = { ...user }

    if (!profileInfo.userName) {
      if (!user.userName) {
        userNameCopy = ''
      } else {
        userNameCopy = user.userName
      }
    } else {
      userNameCopy = profileInfo.userName
    }
    if (!profileInfo.name) {
      if (!user.fullName) {
        nameCopy = ''
      } else {
        nameCopy = user.fullName
      }
    } else {
      nameCopy = profileInfo.name
    }
    if (!profileInfo.bio) {
      if (!user.bio) {
        bioCopy = ''
      } else {
        bioCopy = user.bio
      }
    } else {
      bioCopy = profileInfo.bio
    }
    if (!profileInfo.phone) {
      if (!user.phoneNumber) {
        phoneCopy = ''
      } else {
        phoneCopy = user.phoneNumber
      }
    } else {
      phoneCopy = profileInfo.phone
    }
    if (!profileInfo.email) {
      if (!user.email) {
        emailCopy = ''
      } else {
        emailCopy = user.email
      }
    } else {
      emailCopy = profileInfo.email
    }
    if (!profileInfo.gender) {
      if (!user.gender) {
        genderCopy = ''
      } else {
        genderCopy = user.gender
      }
    } else {
      genderCopy = profileInfo.gender
    }

    userCopy.userName = userNameCopy
    userCopy.email = emailCopy
    userCopy.bio = bioCopy
    userCopy.gender = genderCopy
    userCopy.phoneNumber = phoneCopy
    userCopy.fullName = nameCopy
    const userIndex = props.users.findIndex(
      (findUser) => user._id === findUser._id
    )
    allUsers[userIndex] = userCopy

    let requestBody = {
      query: `mutation {
        userUpdate(userUpdateInput: {
        
        id: "${user._id}"
          phoneNumber: "${phoneCopy}"
          gender: "${genderCopy}"
          bio:"${bioCopy}"
          userName: "${userNameCopy}"
          email:"${emailCopy}"
          followedBy: ${JSON.stringify(user.followedBy)}
          following: ${JSON.stringify(user.following)}
          fullName: "${nameCopy}"
          
        })
        {
          _id
        }
        }`,
    }

    postRequest(requestBody).then((response) => {
      if (response.errors) {
        if (response.errors[0].message.includes('User')) {
          setuserNameError(true)
        } else {
          setuserNameError(false)
        }
        if (response.errors[0].message.includes('Email')) {
          setemailError(true)
        } else {
          setemailError(false)
        }
      } else {
        setemailError(false)
        setuserNameError(false)
      }
    })
  }
  //edit profile handler

  //change password handler
  const passwordChangeHandler = () => {
    setpasswordError('')
    if (profileInfo.newPass.length < 3) {
      setpasswordError('New password needs to be atleast 3 characters')
    } else {
      if (profileInfo.newPass !== profileInfo.rnewPass) {
        setpasswordError('Please make sure you repeated the password correctly')
      }
    }
    let requestBody = {
      query: `
      mutation {
        passwordUpdate(userPassUpdateInput: {
      
        oldPass: "${profileInfo.oldPass}"
        newPass: "${profileInfo.newPass}"
        id: "${user._id}"
        })
        {
          _id
        }
      }
      `,
    }
    postRequest(requestBody).then((response) => {
      if (response.errors) {
        if (response.errors[0].message.includes('Old')) {
          passwordError('Old password is incorrect')
        } else {
          passwordError('')
        }
      }
    })
  }
  //change password handler

  //change avatar handler

  const changeAvatar = (event) => {
    const data = new FormData()
    data.append('file', event.target.files[0])
    Axios.post('http://localhost:8000/upload2', data, {}).then((res) => {})
    const userClone = { ...user }
    userClone.avatar = event.target.files[0].name
    const allUsers = [...props.users]
    const userIndex = props.users.findIndex(
      (findUser) => user._id === findUser._id
    )
    allUsers[userIndex] = userClone

    let requestBody = {
      query: `
      mutation {
        avatarUpdate(userAvatarUpdateInput:{
          id: "${user._id}"
          avatar: "${event.target.files[0].name}"
        })
        {
          _id
        }
        }
      `,
    }
    postRequest(requestBody).then((response) => {
      if (response) {
        setusers(allUsers)
        setuser(userClone)
      }
    })
  }

  //change avatar handler

  return (
    <div>
      <Header posts={posts} />
      <div className={classes.settings}>
        <div className={classes.sideBar}>
          <div
            className={`${classes.editProfile} ${
              profile ? classes.active : null
            }`}
            onClick={changeProfileRender}
          >
            Edit Profile
          </div>
          <div
            className={`${classes.changePassword} ${
              changePassword ? classes.active : null
            }`}
            onClick={changePasswordRender}
          >
            Change Password
          </div>
        </div>

        {profile ? (
          <form className={classes.profile}>
            <div className={classes.avatarContainer}>
              <div
                className={classes.avatar}
                onClick={() => {
                  uploadBtn.current.click()
                }}
              >
                <img src={`images/avatars/${user.avatar}`} alt='' />
                <input
                  type='file'
                  name='avatar'
                  id='avatar'
                  onChange={changeAvatar}
                  ref={uploadBtn}
                  className={classes.hidden}
                />
              </div>
              <span className={classes.nameUser}>
                {!profileInfo.name ? user.fullName : profileInfo.name}
              </span>
            </div>
            <div className={classes.name}>
              <label
                htmlFor='name'
                onClick={() => {
                  nameInput.current.focus()
                }}
              >
                Name
              </label>
              <input
                type='text'
                // value={user.userName || ''}
                defaultValue={user.fullName}
                onChange={profileInputHandler}
                name='name'
                ref={nameInput}
              />
            </div>
            <div className={classes.userName}>
              <label
                htmlFor='userName'
                onClick={() => {
                  userNameInput.current.focus()
                }}
              >
                Username
              </label>
              <input
                type='text'
                // value={user.userName || ''}
                defaultValue={user.userName}
                onChange={profileInputHandler}
                name='userName'
                ref={userNameInput}
              />
            </div>
            {userNameError ? (
              <span className={classes.error}>Username is already in use</span>
            ) : null}
            <div className={classes.bio}>
              <label
                htmlFor='bio'
                onClick={() => {
                  bioInput.current.focus()
                }}
              >
                Bio
              </label>
              <input
                type='text'
                // value={user.userName || ''}
                defaultValue={user.bio}
                onChange={profileInputHandler}
                name='bio'
                ref={bioInput}
              />
            </div>
            <div className={classes.email}>
              <label
                htmlFor='email'
                onClick={() => {
                  emailInput.current.focus()
                }}
              >
                Email
              </label>
              <input
                type='email'
                defaultValue={user.email}
                onChange={profileInputHandler}
                name='email'
                ref={emailInput}
              />
            </div>
            {emailError ? (
              <span className={classes.error}>Email is already in use</span>
            ) : null}
            <div className={classes.phone}>
              <label
                htmlFor='phone'
                onClick={() => {
                  phoneInput.current.focus()
                }}
              >
                Phone Number
              </label>
              <input
                type='text'
                // value={user.userName || ''}
                defaultValue={user.phoneNumber}
                onChange={profileInputHandler}
                name='phone'
                ref={phoneInput}
              />
            </div>
            <div className={classes.gender}>
              <label
                htmlFor='gender'
                onClick={() => {
                  genderInput.current.focus()
                }}
              >
                Gender
              </label>
              <input
                type='text'
                defaultValue={user.gender}
                onChange={profileInputHandler}
                name='gender'
                ref={genderInput}
              />
            </div>

            <span className={classes.submitBtn} onClick={userSubmitHandler}>
              Submit
            </span>
          </form>
        ) : null}

        {changePassword ? (
          <form className={classes.profile}>
            <div className={classes.avatarContainer}>
              <div
                className={classes.avatar}
                onClick={() => {
                  uploadBtn.current.click()
                }}
              >
                <img src={`images/avatars/${user.avatar}`} alt='' />
                <input
                  type='file'
                  name='avatar'
                  id='avatar'
                  onChange={changeAvatar}
                  ref={uploadBtn}
                  className={classes.hidden}
                />
              </div>
              <span className={classes.nameUser}>
                {!profileInfo.name ? user.fullName : profileInfo.name}
              </span>
            </div>

            <div className={classes.userName}>
              <label
                htmlFor='oldPass'
                onClick={() => {
                  oldPassInput.current.focus()
                }}
              >
                Old password
              </label>
              <input
                type='password'
                onChange={profileInputHandler}
                name='oldPass'
                ref={oldPassInput}
              />
            </div>
            <div className={classes.userName}>
              <label
                htmlFor='newPass'
                onClick={() => {
                  newPassInput.current.focus()
                }}
              >
                New Password
              </label>
              <input
                type='password'
                onChange={profileInputHandler}
                name='newPass'
                ref={newPassInput}
              />
            </div>

            <div className={classes.password}>
              <label
                htmlFor='rnewPass'
                onClick={() => {
                  rnewPassInput.current.focus()
                }}
              >
                Repeat New Password
              </label>
              <input
                type='password'
                onChange={profileInputHandler}
                name='rnewPass'
                ref={rnewPassInput}
              />
            </div>

            <span
              className={classes.passwordBtn}
              onClick={passwordChangeHandler}
            >
              Change Password
            </span>

            {passwordError.length > 0 ? (
              <span className={classes.passwordError}>{passwordError}</span>
            ) : null}
          </form>
        ) : null}
      </div>
    </div>
  )
}
