import React, { useState, useMemo, useEffect } from 'react'
import './App.css'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Register from './pages/Register'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Profile from './pages/Profile'
import { UserContext } from './userContext'
import ProfileSettings from './pages/ProfileSettings'

function App() {
  const [user, setuser] = useState({})
  const [users, setusers] = useState([])
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
        _id
        userName
         email
         avatar
         followedBy
         following
         bio
         gender
         phoneNumber
         fullName
         posts {
           _id
           caption
           picture
           likedBy
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
        setuser(response.data.user)
      })
      .catch((e) => {
        console.log(e)
      })
  }, [])
  useEffect(() => {
    let requestBody = {
      query: `query {
        users {
          _id
         userName
          email
          avatar
          followedBy
          following
          bio
          gender
          phoneNumber
          fullName
          posts {
            _id
            caption
            picture
            likedBy
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
        setusers(response.data.users)
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
          {users.map((profileUser, profileIndex) => (
            <Route
              key={profileIndex}
              path={`/${profileUser.userName}`}
              render={() => (
                <Profile
                  profileUser={profileUser}
                  users={users}
                  profileIndex={profileIndex}
                  setusers={setusers}
                />
              )}
              exact={true}
              label='Profile'
            ></Route>
          ))}
          <Route
            path={`/AccountSettings`}
            render={() => <ProfileSettings users={users} setusers={setusers} />}
            exact={true}
            label='settings'
          ></Route>
        </UserContext.Provider>
      </Switch>
    </BrowserRouter>
  )
}

export default App
