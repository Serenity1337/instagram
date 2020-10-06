import React, { useState, useMemo, useEffect } from 'react'
import './App.css'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Register from './pages/Register'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Profile from './pages/Profile'
import { UserContext } from './userContext'
import { PostsContext } from './postsContext'
import ProfileSettings from './pages/ProfileSettings'
import { UsersContext } from './usersContext'

function App() {
  const [user, setuser] = useState({})
  const [posts, setposts] = useState([])
  const [users, setusers] = useState([])
  const [posted, setposted] = useState('')
  const [counter, setcounter] = useState(0)
  const value = useMemo(() => ({ user, setuser }), [user, setuser])
  const postsValue = useMemo(() => ({ posts, setposts }), [posts, setposts])
  const usersValue = useMemo(() => ({ users, setusers }), [users, setusers])
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
            console.log(response)
            if (response) {
              setusers(response.data.users)
              const copyUsers = [...users]
              let postsCopy = userCopy.posts
              response.data.users.map((consumer, index) => {
                if (userCopy.following.includes(`${consumer._id}`)) {
                  if (consumer.posts.length > 0) {
                    postsCopy = [...postsCopy, ...consumer.posts]
                    console.log(consumer.posts)
                  }
                }
              })
              setposts(postsCopy)
              console.log(postsCopy)
            }
          })
          .catch((e) => {
            console.log(e)
          })
        console.log('im here from app users')
      })
      .catch((e) => {
        console.log(e)
      })
    console.log('im here from app users')
  }, [posted])

  useEffect(() => {
    // fetching posts
    // let requestBody = {
    //   query: `query {
    //     posts {
    //       _id
    //       caption
    //       picture
    //       likedBy
    //       poster {
    //         _id
    //         userName
    //         email
    //         avatar
    //         followedBy
    //         following
    //       }
    //       comments {
    //         _id
    //         caption
    //         likedBy
    //         poster {
    //           _id
    //         userName
    //         email
    //         avatar
    //         followedBy
    //         following
    //         }
    //         replies {
    //           _id
    //           caption
    //           likedBy
    //           date
    //           poster {
    //             _id
    //           userName
    //           email
    //           avatar
    //           followedBy
    //           following
    //           }
    //         }
    //         date

    //       }

    //     }
    //   }`,
    // }

    // fetch('http://localhost:8000/graphql', {
    //   method: 'POST',
    //   body: JSON.stringify(requestBody),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // })
    //   .then((header) => {
    //     console.log(header)
    //     if (header.ok) {
    //       return header.json()
    //     } else {
    //       console.log('error')
    //     }
    //   })
    //   .then((response) => {
    //     if (response.data.posts[0] !== null) {
    //     }
    //     return null
    //   })
    //   .catch((e) => {
    //     console.log(e)
    //     throw e
    //   })

    // const checkIfLoggedIn = () => {
    //   if (user === null) {
    //     window.location.href = 'http://localhost:3000/login'
    //   }
    // }
    // checkIfLoggedIn()
    const token = JSON.parse(localStorage.getItem('token'))
    if (token === null) {
      window.location.href = 'http://localhost:3000/login'
    }
  }, [])
  // useEffect(() => {

  // }, [user])
  return (
    <BrowserRouter>
      <Switch>
        <PostsContext.Provider value={postsValue}>
          <UserContext.Provider value={value}>
            <UsersContext.Provider value={usersValue}>
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
                    />
                  )}
                  exact={true}
                  label='Profile'
                ></Route>
              ))}
              <Route
                path={`/AccountSettings`}
                render={() => (
                  <ProfileSettings users={users} setusers={setusers} />
                )}
                exact={true}
                label='settings'
              ></Route>
            </UsersContext.Provider>
          </UserContext.Provider>
        </PostsContext.Provider>
      </Switch>
    </BrowserRouter>
  )
}

export default App
