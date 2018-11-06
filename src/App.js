import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './App.css'

import Login from './routes/Login'
import SignUp from './routes/SignUp'
import Timer from './routes/Timer'

// const GlobalContext = React.createContext({})
import { themes, GlobalContext } from './lib/context'

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
            <Route exact path='/signup' component={SignUp} />
            <Route exact path='/login' component={Login} />
          </Switch>
        </BrowserRouter>
      </GlobalContext.Provider>
    )
  }
}

export default App