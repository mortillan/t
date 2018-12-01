import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import TopBar from '../component/TopBar'
import Brand from '../component/Brand'
import Footer from '../component/Footer'
import CircleButton from '../component/CircleButton'
import Copyright from '../component/Copyright'

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

  handleFormSubmit = (values) => {
    return this.props.history.push('/register')
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
              className='button has-text-weight-bold is-outlined fat-border'>
              Create a free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login