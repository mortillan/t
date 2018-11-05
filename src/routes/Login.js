import React, { Component } from 'react'
import TopBar from '../component/TopBar'
import Brand from '../component/Brand'

class Login extends Component {
  render() {
    return (
      <div className='vfull'>
        <TopBar brand={Brand()} end={Navigation()} />
        <div className='container vfull'>
          <div className='columns vfull' style={{ alignItems: 'center' }}>
            <div className='column is-offset-4 is-4'>
              <h1 className='is-size-2 has-text-weight-bold'>Welcome back</h1>
              <div className='field'>
                <div className='control is-expanded'>
                  <input className='input black' type='text' placeholder='Email or username' />
                </div>
                <div className='control is-expanded'>
                  <input className='input black' type='text' placeholder='Password' />
                </div>
                <button className='button is-black is-fullwidth'>Login</button>
              </div>
              <div className='columns'>
                <div className='column is-6'>
                  <label className='checkbox'>
                    <input type='checkbox' />
                    Remember me
                  </label>
                </div>
                <div className='column is-6 has-text-right'>
                  <a href='#' className='has-text-black'>Forgot Password?</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const Navigation = () => {
  return (
    <div className='navbar-end'>
      <div className='navbar-item'>
        <div className='field is-grouped'>
          <p className='control'>
            <a className='button has-text-weight-bold' href='/signup'>
              Create a free account
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login