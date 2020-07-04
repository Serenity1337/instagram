import React from 'react'
import './App.css'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Register from './pages/Register'
import Login from './pages/Login'
import Feed from './pages/Feed'

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
        <Route path={`/`} component={Feed} exact={true} label='Feed'></Route>
      </Switch>
    </BrowserRouter>
  )
}

export default App
