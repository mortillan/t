import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import TopBar from '../component/TopBar'
import Brand from '../component/Brand'
import Footer from '../component/Footer'
import CircleButton from '../component/CircleButton'

import { GlobalContext } from '../lib/context'
import { css } from '../config/themes'

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .required('This field is required'),
  password: Yup.string()
    .required('This field is required')
    .min(8, 'Password is too short')
    .max(100, 'Password is too long'),
})

class Login extends Component {

  handleFormSubmit(values) {
    console.log(values)
  }

  render() {
    return (
      <GlobalContext.Consumer>
        {({ theme, toggleTheme }) => (
          <div className='vfull'>
            <TopBar brand={Brand()} end={Navigation()} />
            <div className='container vfull'>
              <div className='columns vfull' style={{ alignItems: 'center' }}>
                <div className='column is-offset-4 is-4'>
                  <h1 className='is-size-2 has-text-weight-bold'>Welcome back</h1>
                  <Formik initialValues={{
                    username: '',
                    password: '',
                  }}
                    validationSchema={LoginSchema}
                    onSubmit={this.handleFormSubmit}>
                    {({ errors, touched }) => (
                      <Form>
                        <div className='field'>
                          <div className='control is-expanded'>
                            <Field name='username'
                              className={errors.username && touched.username ?
                                'input black is-danger' : 'input black'}
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
                              className='input black'
                              type='password'
                              placeholder='Password' />
                            <ErrorMessage name='password'
                              component='p'
                              className='help is-danger' />
                          </div>
                        </div>
                        <div className='field'>
                          <div className='control'>
                            <button type='submit'
                              className='button is-primary is-fullwidth'>
                              Login
                              </button>
                          </div>
                        </div>
                        <div className='columns'>
                          <div className='column is-6'>
                            <label className='checkbox'>
                              <input type='checkbox' />
                              Remember me
                              </label>
                          </div>
                          <div className='column is-6 has-text-right'>
                            <a href='/account/reset'
                              className='has-text-black'>
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
                <div>
                  Copyright {new Date().getFullYear()} Godspeed. All rights reserverd.
                </div>
                <div>
                  <CircleButton className='button'
                    onClick={toggleTheme}
                    backgroundColor={css[theme].color}
                    size='1.5rem' />
                  <a className='icon button' href='#'
                    style={{ color: '#ffffff', backgroundColor: '#212529' }}>
                    <i className='ion-ionic ion-md-help'></i>
                  </a>
                </div>
              </div>
            </Footer>
          </div>
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
              className='button has-text-weight-bold is-inverted is-outlined'>
              Create a free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login