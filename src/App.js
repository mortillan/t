import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Loadable from 'react-loadable'
import './App.css'
import { themes, GlobalContext } from './lib/context'

const Loading = () => <div>Loading...</div>

const Login = Loadable({
  loader: () => import('./routes/Login'),
  loading: Loading,
})

const SignUp = Loadable({
  loader: () => import('./routes/SignUp'),
  loading: Loading,
})

const Timer = Loadable({
  loader: () => import('./routes/Timer'),
  loading: Loading,
})

const TimeLogs = Loadable({
  loader: () => import('./routes/TimeLogs'),
  loading: Loading,
})

class App extends Component {
  constructor() {
    super()
    this.state = {
      theme: localStorage.getItem('theme') || themes.LIGHT
    }
    this.toggleTheme = this.toggleTheme.bind(this)
  }

  toggleTheme() {
    const { theme } = this.state
    
    if (theme === themes.LIGHT) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }

    this.setState((state, props) => { 
      const newTheme = theme === themes.LIGHT ? themes.DARK : themes.LIGHT 
      localStorage.setItem('theme', newTheme)
      return {
        theme: newTheme
      }
    })
  }

  componentDidMount() {
    const theme = localStorage.getItem('theme') || themes.LIGHT
    if (theme === themes.LIGHT) {
      document.body.classList.remove('dark')
    } else {
      document.body.classList.add('dark')
    }
  }

  render() {
    return (
      <GlobalContext.Provider value={{
        toggleTheme: this.toggleTheme
      }}>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={Timer} />
            <Route exact path='/insight' component={TimeLogs} />
            <Route exact path='/signup' component={SignUp} />
            <Route exact path='/login' component={Login} />
          </Switch>
        </BrowserRouter>
      </GlobalContext.Provider>
    )
  }
}

export default App