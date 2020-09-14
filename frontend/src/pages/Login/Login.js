import React, { useState, useEffect } from 'react'
import classes from './Login.module.scss'
import { Link } from 'react-router-dom'
export const Login = () => {
  const [emailInput, setemailInput] = useState('')
  const [passwordErrorState, setpasswordErrorState] = useState(false)
  const [users, setusers] = useState([])
  const [emailErrorstate, setemailErrorstate] = useState(false)
  const [passwordInput, setpasswordInput] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('http://localhost:4000/users')
      const usersResponse = await response.json()
      setusers(usersResponse)
    }
    fetchUsers()
  }, [])

  const emailInputHandler = (event) => {
    setemailInput(event.target.value)
  }
  const passwordInputHandler = (event) => {
    setpasswordInput(event.target.value)
  }
  const userLoginHandler = async (event) => {
    event.preventDefault()
    Array.prototype.forEach.call(event.target.elements, (element) => {
      element.value = ''
    })
    const userData = {
      userNames: [],
      userEmails: [],
    }
    users.map((user) => {
      userData.userNames.push(user.username)
      userData.userEmails.push(user.email)
      return 0
    })
    console.log(userData)
    const emailFound = userData.userEmails.includes(emailInput)
    const userFound = users.find((user) => user.email === emailInput)
    console.log(userFound)

    if (!emailFound) {
      setemailErrorstate(true)
    } else {
      setemailErrorstate(false)

      if (userFound.password !== passwordInput) {
        setpasswordErrorState(true)
      } else {
        setpasswordErrorState(false)

        localStorage.setItem('user', JSON.stringify(userFound.username))
        window.location.href = `http://localhost:3000/`
        // JSON.parse(localStorage.getItem('komentarai'));
      }
    }

    console.log(users)
  }
  return (
    <>
      <div className={classes.container}>
        <h1 className={classes.branding}>Instagram</h1>
        <form action='' onSubmit={userLoginHandler}>
          <div className={classes.inputContainer}>
            <span>Please enter your email</span>
            <input
              type='email'
              name='email'
              id='loginEmail'
              onInput={emailInputHandler}
            />
          </div>
          <div className={classes.inputContainer}>
            <span>enter password</span>
            <input
              type='text'
              name='password'
              id='loginPassword'
              onInput={passwordInputHandler}
            />
          </div>
          {passwordErrorState || emailErrorstate ? (
            <span className={classes.error}>Incorrect password or email.</span>
          ) : null}

          <button type='click' id='loginSubmitBtn'>
            Log In
          </button>
        </form>
      </div>
      <div className={classes.redirection}>
        Don't have an account? <Link to='/register'>Register</Link>
      </div>
    </>
  )
}
