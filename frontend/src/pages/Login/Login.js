import React, { useState, useEffect, useContext } from 'react'
import classes from './Login.module.scss'
import { Link } from 'react-router-dom'
export const Login = () => {
  const [emailInput, setemailInput] = useState('')
  const [errorState, seterrorState] = useState(false)
  const [passwordInput, setpasswordInput] = useState('')

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

          let requestBody = {
            query: `query{
  login(email: "${emailInput}", password: "${passwordInput}")
  {
    userId
    token
  }
}`
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
                    console.log(response)
                    if (response.data.login === null) {
                      seterrorState(true)
                    } else {
                      localStorage.setItem('token', JSON.stringify(response.data.login))
                      window.location.href = `http://localhost:3000/`
                    }

                  })
                  .catch((e) => {
                    console.log(e)
                  })
              // console.log(response)
            

        
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
          {errorState ? (
            <span className={classes.error}>Incorrect email or password.</span>
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
