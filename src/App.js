import React, { Component } from 'react'
import { CookiesProvider } from 'react-cookie'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Loadable from 'react-loadable'
import './App.css'
import { themes, GlobalContext } from './lib/context'

const Loading = () => (
  <div style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
  }}>
    <div className='lds-ellipsis'>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
)

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
  loader: () => import('./routes/TimeLogs').then(module => module.TimeLogs),
  loading: Loading,
})

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      theme: localStorage.getItem('theme') || themes.DARK
    }
  }

  toggleTheme = () => {
    const { theme } = this.state

    if (theme === themes.LIGHT) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
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
    const { theme } = this.state
    if (theme === themes.LIGHT) {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }

  render() {
    return (
      <CookiesProvider>
        <GlobalContext.Provider value={{
          toggleTheme: this.toggleTheme,
          theme: this.state.theme
        }}>
          <BrowserRouter>
            <Switch>
              <Route exact path='/' component={Timer} />
              <Route path='/logs' component={TimeLogs} />
              <Route path='/register' component={SignUp} />
              <Route path='/login' component={Login} />
            </Switch>
          </BrowserRouter>
        </GlobalContext.Provider>
      </CookiesProvider>
    )
  }
}

export default App