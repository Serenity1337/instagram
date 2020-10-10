import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../userContext'
import Header from '../../components/Header'
import classes from './Profile.module.scss'
import { Link } from 'react-router-dom'

export const Profile = (props) => {
  const { user, setuser } = useContext(UserContext)
  const [following, setfollowing] = useState(false)
  useEffect(() => {
    //   // fetching posts
    //   let requestBody = {
    //     query: `query {
    //       posts {
    //         _id
    //         caption
    //         picture
    //         likedBy
    //         poster {
    //           _id
    //           userName
    //           email
    //           avatar
    //           followedBy
    //           following
    //         }
    //         comments {
    //           _id
    //           caption
    //           likedBy
    //           poster {
    //             _id
    //           userName
    //           email
    //           avatar
    //           followedBy
    //           following
    //           }
    //           replies {
    //             _id
    //             caption
    //             likedBy
    //             date
    //             poster {
    //               _id
    //             userName
    //             email
    //             avatar
    //             followedBy
    //             following
    //             }
    //           }
    //           date

    //         }

    //       }
    //     }`,
    //   }

    //   fetch('http://localhost:8000/graphql', {
    //     method: 'POST',
    //     body: JSON.stringify(requestBody),
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   })
    //     .then((header) => {
    //       console.log(header)
    //       if (header.ok) {
    //         return header.json()
    //       } else {
    //         console.log('error')
    //       }
    //     })
    //     .then((response) => {
    //       setposts(response.data.posts)
    //     })
    //     .catch((e) => {
    //       console.log(e)
    //       throw e
    //     })

    const checkIfLoggedIn = () => {
      if (!user) {
        window.location.href = 'http://localhost:3000/login'
      }
    }
    checkIfLoggedIn()

    const isFollowing = props.profileUser.followedBy.includes(user._id)

    isFollowing ? setfollowing(true) : setfollowing(false)
  }, [])

  const followBtnHandler = () => {
    const loggedInUser = { ...user }

    const profileUser = { ...props.profileUser }


    // creating a clone of logged in user

    loggedInUser.following = [...loggedInUser.following, profileUser._id]

    const logggedInFollowingArr = JSON.stringify([...loggedInUser.following])

    const loggedInFollowedArr = JSON.stringify([...loggedInUser.followedBy])

    // creating a mutation for the logged in user

    let requestBody = {
      query: `
      mutation {
        userUpdate(userUpdateInput: {
          id: "${loggedInUser._id}"
          followedBy: ${loggedInFollowedArr}
          following: ${logggedInFollowingArr}
          phoneNumber: "${loggedInUser.phoneNumber}"
          gender: "${loggedInUser.gender}"
          bio: "${loggedInUser.bio}"
          userName: "${loggedInUser.userName}"
          email: "${loggedInUser.email}"
          fullName: "${loggedInUser.fullName}"
        })
        {
          _id
        }
      }
      `,
    }

    // committing the mutation for the logged in user

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((header) => {
      if (header.ok) {
        setuser(loggedInUser)

        return header.json()
      } else {
        console.log(header)
      }
    })

    // creating a clone of profile user

    const allUsers = [...props.users]

    profileUser.followedBy = [...profileUser.followedBy, loggedInUser._id]

    allUsers[props.profileIndex] = profileUser

    const profileFollowedArr = JSON.stringify([...profileUser.followedBy])

    const profileFollowingArr = JSON.stringify([...profileUser.following])

    // creating a mutation of profile user

    requestBody = {
      query: `
      mutation {
        userUpdate(userUpdateInput: {
          id: "${profileUser._id}"
          followedBy: ${profileFollowedArr}
          following: ${profileFollowingArr}
          phoneNumber: "${profileUser.phoneNumber}"
          gender: "${profileUser.gender}"
          bio: "${profileUser.bio}"
          userName: "${profileUser.userName}"
          email: "${profileUser.email}"
          fullName: "${profileUser.fullName}"
        })
        {
          _id
        }
      }
      `,
    }

    // committing the mutation of profile user

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((header) => {
      if (header.ok) {
        props.setusers(allUsers)
        setfollowing(true)

        return header.json()
      } else {
        console.log(header)
      }
    })
  }

  const unFollowBtnHandler = () => {
    const loggedInUser = { ...user }

    const profileUser = { ...props.profileUser }


    // creating a clone of logged in user

    loggedInUser.following = loggedInUser.following.filter(
      (id) => id !== profileUser._id
    )

    const loggedInUserFollowingArr = JSON.stringify([...loggedInUser.following])

    const loggedInFollowedArr = JSON.stringify([...loggedInUser.followedBy])

    // creating a mutation for the logged in user

    let requestBody = {
      query: `
      mutation {
        userUpdate(userUpdateInput: {
          id: "${loggedInUser._id}"
          followedBy: ${loggedInFollowedArr}
          following: ${loggedInUserFollowingArr}
          phoneNumber: "${loggedInUser.phoneNumber}"
          gender: "${loggedInUser.gender}"
          bio: "${loggedInUser.bio}"
          userName: "${loggedInUser.userName}"
          email: "${loggedInUser.email}"
          fullName: "${loggedInUser.fullName}"
        })
        {
          _id
        }
      }
      `,
    }

    // committing the mutation for the logged in user

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((header) => {
      if (header.ok) {
        setuser(loggedInUser)

        return header.json()
      } else {
        console.log(header)
      }
    })

    // creating a clone of profile user

    const allUsers = [...props.users]

    profileUser.followedBy = profileUser.followedBy.filter(
      (id) => id !== loggedInUser._id
    )

    allUsers[props.profileIndex] = profileUser

    const profileUserFollowedArr = JSON.stringify([...profileUser.followedBy])

    const profileFollowingArr = JSON.stringify([...profileUser.following])

    // creating a mutation of profile user

    requestBody = {
      query: `
      mutation {
        userUpdate(userUpdateInput: {
          id: "${profileUser._id}"
          followedBy: ${profileUserFollowedArr}
          following: ${profileFollowingArr}
          phoneNumber: "${profileUser.phoneNumber}"
          gender: "${profileUser.gender}"
          bio: "${profileUser.bio}"
          userName: "${profileUser.userName}"
          email: "${profileUser.email}"
          fullName: "${profileUser.fullName}"
        })
        {
          _id
        }
      }
      `,
    }

    // committing the mutation of profile user

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((header) => {
      if (header.ok) {
        props.setusers(allUsers)
        setfollowing(false)

        return header.json()
      } else {
        console.log(header)
      }
    })
  }
  return (
    <div>
      <Header posts={props.posts} setposts={props.setposts} />
      <div className={classes.profile}>
        <div className={classes.profileSection}>
          <img
            className={classes.avatar}
            src={`images/avatars/${props.profileUser.avatar}`}
            alt='#'
          />

          <div className={classes.profileStats}>
            <div className={classes.firstRow}>
              <span className={classes.userName}>
                {props.profileUser.userName}
              </span>
              <Link to='/AccountSettings'>
                <div className={classes.editBtn}>Edit Profile</div>
              </Link>

              {user._id !== props.profileUser._id ? (
                !following ? (
                  <div className={classes.followBtn} onClick={followBtnHandler}>
                    {' '}
                    Follow{' '}
                  </div>
                ) : (
                    <div
                      className={classes.followBtn}
                      onClick={unFollowBtnHandler}
                    >
                      {' '}
                    Unfollow{' '}
                    </div>
                  )
              ) : null}
            </div>
            <div className={classes.secondRow}>
              <span>{props.profileUser.posts.length} posts</span>
              <span className={classes.followers}>
                {props.profileUser.followedBy.length} followers
              </span>
              <span>{props.profileUser.following.length} following</span>
            </div>
          </div>
        </div>
        <div className={classes.postSection}>
          {props.profileUser.posts.length > 0 ? (
            props.profileUser.posts.map((post, index) => (
              <img
                key={index}
                className={classes.post}
                src={`images/postpics/${post.picture}`}
              />
            ))
          ) : (
              <div className={classes.noPosts}> You currently have no posts </div>
            )}
        </div>
      </div>
    </div>
  )
}
