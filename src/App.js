import React, { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'

function App() {
  return (
    <BrowserRouter>
      <Switch>
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
          component={Profile}
          exact={true}
          label='Profile'
        ></Route>
      </Switch>
    </BrowserRouter>
  )
}

export default App
