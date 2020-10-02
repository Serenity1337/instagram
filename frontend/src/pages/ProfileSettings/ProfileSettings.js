import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../userContext'
import classes from './ProfileSettings.module.scss'
import Header from '../../components/Header'

export const ProfileSettings = (props) => {
  //states
  const { user, setuser } = useContext(UserContext)
  const [oldPass, setoldPass] = useState('')
  const [newPass, setnewPass] = useState('')
  const [rnewPass, setrnewPass] = useState('')
  const [posts, setposts] = useState([])
  const [profile, setprofile] = useState(true)
  const [name, setname] = useState('')
  const [userName, setuserName] = useState('')
  const [bio, setbio] = useState('')
  const [email, setemail] = useState('')
  const [phone, setphone] = useState('')
  const [gender, setgender] = useState('')
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
    let requestBody = {
      query: `query {
        posts {
          _id
          caption
          picture
          likedBy
          poster {
            _id
            userName
            email
            avatar
            followedBy
            following
          }
          comments {
            _id
            caption
            likedBy
            poster {
              _id
            userName
            email
            avatar
            followedBy
            following
            }
            replies {
              _id
              caption
              likedBy
              date
              poster {
                _id
              userName
              email
              avatar
              followedBy
              following
              }
            }
            date
            
          }
          
        }
      }`,
    }

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((header) => {
        console.log(header)
        if (header.ok) {
          return header.json()
        } else {
          console.log('error')
        }
      })
      .then((response) => {
        setposts(response.data.posts)
      })
      .catch((e) => {
        console.log(e)
        throw e
      })

    const token = JSON.parse(localStorage.getItem('token'))
    if (token === null) {
      window.location.href = 'http://localhost:3000/login'
    }
  }, [])
  //fetch posts

  //input state handlers
  const userNameHandler = (event) => {
    setuserName(event.target.value)
  }
  const bioHandler = (event) => {
    setbio(event.target.value)
  }
  const emailHandler = (event) => {
    setemail(event.target.value)
  }
  const phoneHandler = (event) => {
    setphone(event.target.value)
  }
  const nameHandler = (event) => {
    setname(event.target.value)
  }
  const genderHandler = (event) => {
    setgender(event.target.value)
  }
  const oldPassHandler = (event) => {
    setoldPass(event.target.value)
  }
  const newPassHandler = (event) => {
    setnewPass(event.target.value)
  }
  const rNewPassHandler = (event) => {
    setrnewPass(event.target.value)
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
    let allUsers = [...props.users]
    let userCopy = user

    if (!userName) {
      if (!user.userName) {
        userNameCopy = ''
      } else {
        userNameCopy = user.userName
      }
    } else {
      userNameCopy = userName
    }
    if (!name) {
      if (!user.fullName) {
        nameCopy = ''
      } else {
        nameCopy = user.fullName
      }
    } else {
      nameCopy = name
    }
    if (!bio) {
      if (!user.bio) {
        bioCopy = ''
      } else {
        bioCopy = user.bio
      }
    } else {
      bioCopy = bio
    }
    if (!phone) {
      if (!user.phoneNumber) {
        phoneCopy = ''
      } else {
        phoneCopy = user.phoneNumber
      }
    } else {
      phoneCopy = phone
    }
    if (!email) {
      if (!user.email) {
        emailCopy = ''
      } else {
        emailCopy = user.email
      }
    } else {
      emailCopy = email
    }
    if (!gender) {
      if (!user.gender) {
        genderCopy = ''
      } else {
        genderCopy = user.gender
      }
    } else {
      genderCopy = gender
    }

    userCopy.userName = userNameCopy
    userCopy.email = emailCopy
    userCopy.bio = bioCopy
    userCopy.gender = genderCopy
    userCopy.phoneNumber = phoneCopy
    userCopy.fullName = nameCopy
    console.log(userCopy)
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

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((header) => {
        if (header.ok) {
          console.log(header)
          props.setusers(allUsers)
          setuser(userCopy)
          return header.json()
        } else {
          console.log(header)
        }
      })
      .then((response) => {
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
    console.log(oldPass)
    console.log(newPass)
    console.log(rnewPass)
    setpasswordError('')
    if (newPass.length < 3) {
      setpasswordError('New password needs to be atleast 3 characters')
    } else {
      if (newPass !== rnewPass) {
        setpasswordError('Please make sure you repeated the password correctly')
        console.log('asdaworks')
      }
    }
    let requestBody = {
      query: `
      mutation {
        passwordUpdate(userPassUpdateInput: {
      
        oldPass: "${oldPass}"
        newPass: "${newPass}"
        id: "${user._id}"
        })
        {
          _id
        }
      }
      `,
    }
    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((header) => {
        if (header.ok) {
          console.log(header)
          return header.json()
        } else {
          console.log(header)
        }
      })
      .then((response) => {
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

  const changeAvatar = () => {
    console.log('it works!')
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
                {name.length === 0 ? user.fullName : name}
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
                onChange={nameHandler}
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
                onChange={userNameHandler}
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
                onChange={bioHandler}
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
                // value={user.userName || ''}
                defaultValue={user.email}
                onChange={emailHandler}
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
                onChange={phoneHandler}
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
                onChange={genderHandler}
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
                {name.length === 0 ? user.fullName : name}
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
                onChange={oldPassHandler}
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
                onChange={newPassHandler}
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
                onChange={rNewPassHandler}
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
