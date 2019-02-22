import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { GoogleLogin } from 'react-google-login'

import TopBar from '../components/TopBar'
import Brand from '../components/Brand'
import Footer from '../components/Footer'
import CircleButton from '../components/CircleButton'
import Copyright from '../components/Copyright'

import { GlobalContext } from '../lib/context'
import { css } from '../config/themes'

import 'bulma-divider';

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .required('This field is required'),
  password: Yup.string()
    .required('This field is required')
    .min(8, 'Password is too short')
    .max(100, 'Password is too long'),
})

class Login extends Component {

  handleFormSubmit = (values) => {
    return this.props.history.push('/register')
  }

  handleOnSuccessGoogleLogin = (response) => {
    console.log(response)
    const { id_token: idToken } = response.tokenObj

    if(idToken) {
      this.props.history.push({
        pathname: '/register',
        state: {
          provider: 'google',
        }
      })
    }
  }

  handleOnFailureGoogleLogin = (response) => {
    console.log(response)
  }

  componentDidMount() {
    // fetch('http://localhost:8000/cookie/login', { credentials: 'include' }).then(response => response.json()).then(json => console.log(json));
  }

  render() {
    return (
      <GlobalContext.Consumer>
        {({ theme, toggleTheme }) => (
          <>
            <TopBar 
              brand={<Brand theme={theme} />} 
              end={<Navigation />} />
            <div className='container vfull'>
              <div className='columns vfull' style={{ alignItems: 'center' }}>
                <div className='column is-offset-4 is-4'>
                  <h1 className='is-size-2 has-text-weight-semibold'>Welcome back</h1>
                  <Formik initialValues={{
                    username: '',
                    password: '',
                  }}
                    validationSchema={LoginSchema}
                    onSubmit={this.handleFormSubmit}>
                    {({ errors, touched }) => (
                      <Form>
                        <div className='field'>
                          <GoogleLogin clientId={process.env.REACT_APP_GAUTH_CLIENT_ID} 
                            uxMode="redirect"
                            isSignedIn="true"
                            buttonText="Login with Google" 
                            className="google-login-button"
                            theme={theme}
                            onSuccess={this.handleOnSuccessGoogleLogin} 
                            onFailure={this.handleOnFailureGoogleLogin} />
                        </div>
                        <div className='is-divider' data-content='OR'></div>
                        <div className='field'>
                          <div className='control is-expanded'>
                            <Field name='username'
                              className={errors.username && touched.username ?
                                'input fat-border is-danger' : 'input fat-border is-black'}
                              type='text'
                              placeholder='Email or username' />
                          </div>
                          <ErrorMessage name='username'
                            component='p'
                            className='help is-danger' />
                        </div>
                        <div className='field'>
                          <div className='control is-expanded'>
                            <Field name='password'
                              className={errors.password && touched.password ? 
                                'input fat-border is-danger' : 'input fat-border is-black'}
                              type='password'
                              placeholder='Password' />
                            <ErrorMessage name='password'
                              component='p'
                              className='help is-danger' />
                          </div>
                        </div>
                        <div className='field'>
                            <button type='submit'
                              className='button is-primary is-fullwidth'>
                              Login
                            </button>
                        </div>
                        <div className='columns'>
                          <div className='column is-6'>
                            <label className='checkbox'>
                              <input type='checkbox' />
                              Remember me
                              </label>
                          </div>
                          <div className='column is-6 has-text-right'>
                            <a href='/account/reset'>
                              Forgot Password?
                            </a>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
            <Footer>
              <div className='content'
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end'
                }}>
                <Copyright />
                <div>
                  <CircleButton className='button'
                    onClick={toggleTheme}
                    backgroundColor={css[theme].color}
                    size='1.5rem' />
                  {/* <a className='icon button' href='#'
                    style={{ color: '#ffffff', backgroundColor: '#212529' }}>
                    <i className='ion-ionic ion-md-help'></i>
                  </a> */}
                </div>
              </div>
            </Footer>
          </>
        )}
      </GlobalContext.Consumer>
    )
  }

}

const Navigation = () => {
  return (
    <div className='navbar-end'>
      <div className='navbar-item'>
        <div className='field is-grouped'>
          <p className='control'>
            <Link to='/register'
              className='nav-btn button has-text-weight-semibold fat-border'>
              Create a free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login