import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import TopBar from '../component/TopBar'
import Brand from '../component/Brand'
import Footer from '../component/Footer';

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .required('This field is required'),
  password: Yup.string()
    .required('This field is required')
    .min(8, 'Password is too short')
    .max(100, 'Password is too long'),
})

class Login extends Component {

  constructor() {
    super()
  }

  handleFormSubmit(values) {
    console.log(values)
  }

  render() {
    return (
      <div className='vfull'>
        <TopBar brand={Brand()} end={Navigation()} />
        <div className='container vfull'>
          <div className='columns vfull' style={{ alignItems: 'center' }}>
            <div className='column is-offset-4 is-4'>
              <h1 className='is-size-2 has-text-weight-bold'>Welcome back</h1>
              <Formik initialValues={{
                username: '',
                password: '',
              }} validationSchema={LoginSchema} onSubmit={this.handleFormSubmit}>
                {
                  ({ errors, touched }) => (
                    <Form>
                      <div className='field'>
                        <div className='control is-expanded'>
                          <Field name='username' className={errors.username && touched.username ? 'input black is-danger' : 'input black'} type='text' placeholder='Email or username' />
                        </div>
                        <ErrorMessage name='username' component='p' className='help is-danger' />
                      </div>
                      <div className='field'>
                        <div className='control is-expanded'>
                          <Field name='password' className='input black' type='password' placeholder='Password' />
                          <ErrorMessage name='password' component='p' className='help is-danger' />
                        </div>
                      </div>
                      <div className='field'>
                        <div className='control'>
                        <button type='submit' className='button is-black is-fullwidth'>Login</button>
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
                          <a href='/account/reset' className='has-text-black'>Forgot Password?</a>
                        </div>
                      </div>
                    </Form>
                  )
                }
              </Formik>
            </div>
          </div>
        </div>
        <Footer>
          {/* <div className='content' style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
            <div>
              Copyright {new Date().getFullYear()} Godspeed. All rights reserverd.
            </div>
            <div>
              <button onClick={this.toggleTheme} className='button btn-circle theme' style={{ marginRight: '1rem' }}></button>
              <a className={this.state.focusMode ? 'icon button theme hide' : 'icon button theme'} href='#' style={{color: '#ffffff', backgroundColor: '#212529'}}>
                <i className='ion-ionic ion-md-help'></i>
              </a>
            </div>
          </div> */}
        </Footer>
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
            <Link to='/signup' className='button has-text-weight-bold'>Create a free account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login