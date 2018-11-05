import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './App.css'

import Login from './routes/Login'
import SignUp from './routes/SignUp'
import Timer from './routes/Timer'

class App extends Component {

  componentDidMount() {

  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={Login} />
          <Route exact path='/signup' component={SignUp} />
          <Route exact path='/timer' component={Timer} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App