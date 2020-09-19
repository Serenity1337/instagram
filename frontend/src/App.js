import React, { useState, useMemo, useEffect } from 'react'
import './App.css'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Register from './pages/Register'
import Login from './pages/Login'
import Feed from './pages/Feed'

import { UserContext } from './userContext'

function App() {

  const [user, setuser] = useState({})
  const value = useMemo(() => ({ user, setuser }), [user, setuser])
  useEffect(() => {
  const token = JSON.parse(localStorage.getItem('token'))
  if (token === null) {
    return
  }
  let requestBody = {
    query: `query {
      user(id: "${token.userId}")
      {
        userName
        email
        avatar
        followedBy
        following
        _id
        
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
                  setuser(response.data.user)
                    
                })
                .catch((e) => {
                  console.log(e)
                })
  }, [])
  return (
    <BrowserRouter>
      <Switch>
      <UserContext.Provider value={value}>
        <Route
          path={`/login`}
          component={Login}
          exact={true}
          label='Login'
        ></Route>
        <Route
          path={`/register`}
          component={Register}
          exact={true}
          label='Register'
        ></Route>
        <Route path={`/`} component={Feed} exact={true} label='Feed'></Route>
        </UserContext.Provider>
      </Switch>
    </BrowserRouter>
  )
}

export default App
