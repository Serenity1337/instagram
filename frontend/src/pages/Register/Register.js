import React, { useState, useEffect, useContext } from 'react'
import classes from './Register.module.scss'
import { Link } from 'react-router-dom'
import { UserContext } from '../../userContext'

export const Register = () => {
  const [emailInput, setemailInput] = useState('')

  const [nameInput, setnameInput] = useState('')

  const [passwordInput, setpasswordInput] = useState('')

  const [rpasswordInput, setrpasswordInput] = useState('')

  const [nameErrorState, setnameErrorstate] = useState(false)

  const [emailErrorstate, setemailErrorstate] = useState(false)

  const [passwordErrorstate, setpasswordErrorstate] = useState(false)

  const { user, setuser } = useContext(UserContext)

  const emailInputHandler = (event) => {
    setemailInput(event.target.value)
  }

  const nameInputHandler = (event) => {
    setnameInput(event.target.value)
  }

  const passwordInputHandler = (event) => {
    setpasswordInput(event.target.value)
  }

  const rpasswordInputHandler = (event) => {
    setrpasswordInput(event.target.value)
  }

  const registerUser = async (event) => {
    event.preventDefault()

    Array.prototype.forEach.call(event.target.elements, (element) => {
      element.value = ''
    })
    if (
      passwordInput !== rpasswordInput ||
      passwordInput === '' ||
      rpasswordInput === ''
    ) {
      setpasswordErrorstate(true)
    } else {
      setpasswordErrorstate(false)
      let requestBody = {
        query: `mutation {
        createUser(userInput: {
          userName: "${nameInput}"
          password: "${passwordInput}"
          email: "${emailInput}"
          avatar: "test.jpg"
          followedBy: []
          following: []
          bio: ""
          gender: ""
          phoneNumber: ""
          fullName: "asd"
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
          console.log(header)
          if (header.ok) {
            return header.json()
          } else {
            alert('Registration failed')
          }
        })
        .then((response) => {
          if (response.data.createUser !== null) {
            window.location.href = 'http://localhost:3000/login'
          } else {
            console.log(response.errors[0].message)
            if (response.errors[0].message.includes('Email')) {
              setemailErrorstate(true)
              setnameErrorstate(false)
            } else {
              setnameErrorstate(true)
              setemailErrorstate(false)
            }
          }

          // alert('Registration successful')
        })
        .catch((e) => {
          console.log(e)
        })
      // console.log(response)
    }
  }

  return (
    <div>
      <div className={classes.container}>
        <h1 className={classes.branding}>Instagram</h1>
        <p>Sign up to see photos and videos from your friends.</p>
        <form action='' onSubmit={registerUser}>
          <div className={classes.inputContainer}>
            <span>Please enter your email</span>
            <input
              type='email'
              name='email'
              id='registerEmail'
              onInput={emailInputHandler}
            />
          </div>
          {emailErrorstate ? (
            <span className={classes.error}>
              This email address is already taken
            </span>
          ) : null}

          <div className={classes.inputContainer}>
            <span>enter username</span>
            <input
              type='text'
              name='username'
              id='registerUsername'
              onInput={nameInputHandler}
            />
          </div>
          {nameErrorState ? (
            <span className={classes.error}>
              This Username is already taken
            </span>
          ) : null}

          <div className={classes.inputContainer}>
            <span>enter password</span>
            <input
              type='password'
              name='password'
              id='registerPassword'
              onInput={passwordInputHandler}
            />
          </div>

          <div className={classes.inputContainer}>
            <span>repeat password</span>
            <input
              type='password'
              name='rpassword'
              id='registerRPassword'
              onInput={rpasswordInputHandler}
            />
          </div>
          {passwordErrorstate ? (
            <span className={classes.error}>
              Please check if you entered the password correctly
            </span>
          ) : null}
          <button type='click' id='registerSubmitBtn'>
            Sign Up
          </button>
        </form>
      </div>
      <div className={classes.redirection}>
        Have an account? <Link to='/login'>Log in</Link>
      </div>
    </div>
  )
}
