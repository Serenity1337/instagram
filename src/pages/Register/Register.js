import React, { useState, useEffect } from 'react'
import classes from './Register.module.scss'
import { Link } from 'react-router-dom'


export const Register = () => {
  const [emailInput, setemailInput] = useState('')

  const [nameInput, setnameInput] = useState('')

  const [passwordInput, setpasswordInput] = useState('')

  const [rpasswordInput, setrpasswordInput] = useState('')

  const [users, setusers] = useState([])

  const [nameErrorState, setnameErrorstate] = useState(false)

  const [emailErrorstate, setemailErrorstate] = useState(false)

  const [passwordErrorstate, setpasswordErrorstate] = useState(false)

  useEffect(() => {
    fetch('http://localhost:4000/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((header) => {
        if (!header.ok) {
          throw Error(header)
        }
        return header.json()
      })
      .then((response) => {
        setusers(response)
      })
      .catch((e) => {
        console.log(e)
      })
  }, [])

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
    const userData = {
      userNames: [],
      userEmails: [],
    }
    users.map((user) => {
      userData.userNames.push(user.username)
      userData.userEmails.push(user.email)
    })
    console.log(userData)
    const dupeName = userData.userNames.includes(nameInput)
    const dupeEmail = userData.userEmails.includes(emailInput)

    if (dupeName) {
      setnameErrorstate(true)
      if (dupeEmail) {
        setemailErrorstate(true)
        if (passwordInput !== rpasswordInput) {
          setpasswordErrorstate(true)
        }
      }
    } else {
      setnameErrorstate(false)
      if (dupeEmail) {
        setemailErrorstate(true)
        if (passwordInput !== rpasswordInput) {
          setpasswordErrorstate(true)
        } else {
          setpasswordErrorstate(false)
        }
      } else {
        setemailErrorstate(false)
        if (passwordInput !== rpasswordInput) {
          setpasswordErrorstate(true)
        } else {
          setpasswordErrorstate(false)
          console.log('asd')
          let body = {
            password: passwordInput,
            username: nameInput,
            email: emailInput,
            avatar: 'images/test.jpg'
          }
          fetch('http://localhost:4000/users', {
            method: 'POST',
            body: JSON.stringify(body),
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
              if (response) {
                // alert('Registration successful')

                window.location.href = 'http://localhost:3000/login'
              }
            })
            .catch((e) => {
              console.log(e)
            })
        }
        // console.log(response)
      }
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
              type='text'
              name='password'
              id='registerPassword'
              onInput={passwordInputHandler}
            />
          </div>

          <div className={classes.inputContainer}>
            <span>repeat password</span>
            <input
              type='text'
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
