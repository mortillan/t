import React, { Component } from 'react'
import TopBar from '../component/TopBar'
import Brand from '../component/Brand'

class SignUp extends Component {
  render() {
    return (
      <div className='vfull'>
        <TopBar brand={Brand()} end={Navigation()} />
        <div className='container vfull'>
          <div className='columns vfull' style={{ alignItems: 'center' }}>
            <div className='column is-offset-3 is-6'>
              <h1 className='is-size-2 has-text-weight-bold'>Sign up for private beta</h1>
              <form>
                <div className='field has-addons'>
                  <div className='control is-expanded'>
                    <input className='input black' type='text' placeholder='Your email address' />
                  </div>
                  <div className='control'>
                    <a className='button is-black'>Let me know</a>
                  </div>
                </div>
              </form>
              <p className='is-size-7	'>
                We respect your privacy and do not tolerate spam and will never sell, rent, lease,
                or give away your information (name, address, email, etc.) to any third party.
                Nor will we send you unsolicited email.
              </p>
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
            <a className='button not-outlined has-text-weight-bold' href='/'>Login</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp