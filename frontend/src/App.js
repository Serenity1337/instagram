import React, { useState, useMemo, useEffect } from 'react'
import './App.css'
import { BrowserRouter, Switch, Route, useLocation } from 'react-router-dom'

import Register from './pages/Register'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Profile from './pages/Profile'
import { UserContext } from './userContext'
import { PostsContext } from './postsContext'
import ProfileSettings from './pages/ProfileSettings'
import { UsersContext } from './usersContext'
import Header from './components/Header'

function App() {
  const [user, setuser] = useState({})
  const [posts, setposts] = useState([])
  const [users, setusers] = useState([])
  const [posted, setposted] = useState('')
  const value = useMemo(() => ({ user, setuser }), [user, setuser])
  const postsValue = useMemo(() => ({ posts, setposts }), [posts, setposts])
  const usersValue = useMemo(() => ({ users, setusers }), [users, setusers])
  const location = useLocation()
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'))
    if (token === null) {
      return
    } else {
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
            poster {
              _id
              userName
              email
              avatar
              phoneNumber
              gender
              bio
              followedBy
              following
              fullName
            }
            comments {
              _id
              caption
              likedBy
              date
              poster {
                _id
                userName
                email
                avatar
                phoneNumber
                gender
                bio
                followedBy
                following
                fullName
                
              }
              replies {
                  _id
                  caption
                  poster {
                    _id
                userName
                email
                avatar
                phoneNumber
                gender
                bio
                followedBy
                following
                fullName
                  }
                  likedBy
                  date
                }
              
              
            }
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
          const userCopy = response.data.user
          let requestBody = {
            query: `query {
              users{
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
                  poster {
                    _id
                    userName
                    email
                    avatar
                    phoneNumber
                    gender
                    bio
                    followedBy
                    following
                    fullName
                  }
                  comments {
                    _id
                    caption
                    likedBy
                    date
                    poster {
                      _id
                      userName
                      email
                      avatar
                      phoneNumber
                      gender
                      bio
                      followedBy
                      following
                      fullName
                      
                    }
                    replies {
                        _id
                        caption
                        poster {
                          _id
                      userName
                      email
                      avatar
                      phoneNumber
                      gender
                      bio
                      followedBy
                      following
                      fullName
                        }
                        likedBy
                        date
                      }
                    
                    
                  }
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
              if (response) {
                setusers(response.data.users)
                const copyUsers = [...users]
                let postsCopy = userCopy.posts
                response.data.users.map((consumer, index) => {
                  if (userCopy.following.includes(`${consumer._id}`)) {
                    if (consumer.posts.length > 0) {
                      postsCopy = [...postsCopy, ...consumer.posts]
                    }
                  }
                })
                setposts(postsCopy)
              }
            })
            .catch((e) => {
              console.log(e)
            })
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }, [posted])

  useEffect(() => {
    // checkIfLoggedIn()
    const token = JSON.parse(localStorage.getItem('token'))
    if (token === null && window.location.pathname !== '/login') {
      if (window.location.pathname !== '/register') {
        window.location.href = '/login'
      }
    }
  }, [posted])
  // useEffect(() => {

  // }, [user])
  console.log(location)
  return (
    <Switch>
      <PostsContext.Provider value={postsValue}>
        <UserContext.Provider value={value}>
          <UsersContext.Provider value={usersValue}>
            {location.pathname == '/register' ||
            location.pathname == '/login' ? null : (
              <Header setposted={setposted} />
            )}
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
            <Route
              path={`/`}
              render={() => (
                <Feed
                  users={users}
                  setusers={setusers}
                  posts={posts}
                  setposts={setposts}
                  posted={posted}
                  setposted={setposted}
                />
              )}
              exact={true}
              label='Feed'
            ></Route>
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
                    posts={posts}
                    setposts={setposts}
                    setposted={setposted}
                  />
                )}
                exact={true}
                label='Profile'
              ></Route>
            ))}
            <Route
              path={`/AccountSettings`}
              render={() => (
                <ProfileSettings
                  users={users}
                  setusers={setusers}
                  setposted={setposted}
                />
              )}
              exact={true}
              label='settings'
            ></Route>
          </UsersContext.Provider>
        </UserContext.Provider>
      </PostsContext.Provider>
    </Switch>
  )
}

export default App
