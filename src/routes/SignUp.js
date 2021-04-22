import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import TopBar from '../components/TopBar'
import Brand from '../components/Brand'
import Footer from '../components/Footer'
import CircleButton from '../components/CircleButton'
import Copyright from '../components/Copyright'

import { GlobalContext } from '../lib/context'
import { css } from '../config/themes'

const commonFieldValidation = {
  username: Yup.string()
    .matches(/^[a-zA-z]+/, {
      message: 'Must start with letters',
      excludeEmptyString: true,
    })
    .matches(/^[a-zA-Z0-9_.]+$/, {
      message: 'You can only use letters, numbers, underscore and dot',
      excludeEmptyString: true,
    })
    .required('This field is required'),
  password: Yup.string()
    .min(8, 'Must not be less than 8 characters')
    .required('This field is required')
}

const DefaultSchema = Yup.object().shape({
  firstName: Yup.string()
    .matches(/^[a-zA-z\s]+/, {
      message: 'Only letters are allowed',
      excludeEmptyString: true,
    })
    .required('This field is required'),
  lastName: Yup.string()
    .matches(/^[a-zA-z\s]+/, {
      message: 'Only letters are allowed',
      excludeEmptyString: true,
    })
    .required('This field is required'),
  email: Yup.string()
    .email('This is not a valid email')
    .required('This field is required'),
  ...commonFieldValidation,
})

const GoogleSchema = Yup.object().shape({
  ...commonFieldValidation
})

class SignUp extends Component {

  state = {
    spiel: 'Create account',
  }

  btnRegisterRef = React.createRef();

  register = async (values, { setErrors }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/oauth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values),
        mode: 'cors'
      })

      this.btnRegisterRef.current.classList.add('is-loading')

      const json = await response.json()

      this.btnRegisterRef.current.classList.remove('is-loading')

      if (response.status === 200) {
        this.setState({
          spiel: `Thanks for signing up!`,
        })
      } else {
        setErrors({
          email: json.error
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  createSignUpForm = () => {
    const { location } = this.props

    if (!location.state) {
      return (
        <Formik initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          username: '',
          password: '',
        }}
          validationSchema={DefaultSchema}
          onSubmit={this.register}>
          {({ errors, touched }) => (
            <Form>
              <div className='field is-flex-touch is-flex-desktop'>
                <div style={{ marginRight: '1rem' }}>
                  <div className='control is-expanded'>
                    <Field name='firstName'
                      className={errors.firstName && touched.firstName ?
                        'input fat-border is-danger' : 'input is-black fat-border'}
                      type='text'
                      placeholder='First Name' />
                  </div>
                  <ErrorMessage name='firstName'
                    component='p'
                    className='help is-danger' />
                </div>
                <div>
                  <div className='control is-expanded'>
                    <Field name='lastName'
                      className={errors.lastName && touched.lastName ?
                        'input fat-border is-danger' : 'input is-black fat-border'}
                      type='text'
                      placeholder='Last Name' />
                  </div>
                  <ErrorMessage name='lastName'
                    component='p'
                    className='help is-danger' />
                </div>
              </div>
              <div className='field'>
                <div className='control '>
                  <Field name='username'
                    className={errors.username && touched.username ?
                      'input fat-border is-danger' : 'input is-black fat-border'}
                    type='text'
                    placeholder='Username' />
                </div>
                <ErrorMessage name='username'
                  component='p'
                  className='help is-danger' />
              </div>
              <div className='field'>
                <div className='control is-expanded'>
                  <Field name='email'
                    className={errors.email && touched.email ?
                      'input fat-border is-danger' : 'input is-black fat-border'}
                    type='text'
                    placeholder='Email' />
                </div>
                <ErrorMessage name='email'
                  component='p'
                  className='help is-danger' />
              </div>
              <div className='field'>
                <div className='control is-expanded'>
                  <Field name='password'
                    className={errors.password && touched.password ?
                      'input fat-border is-danger' : 'input is-black fat-border'}
                    type='text'
                    placeholder='Password' />
                </div>
                <ErrorMessage name='password'
                  component='p'
                  className='help is-danger' />
              </div>
              <div className='field'>
                <button ref={this.btnRegisterRef}
                  type='submit'
                  className='button is-primary is-fullwidth'>
                  Register
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )
    }

    if (location.state.provider === 'google') {
      return (
        <Formik initialValues={{
          username: '',
          password: ''
        }}
          validationSchema={GoogleSchema}
          onSubmit={this.register}>
          {({ errors, touched }) => (
            <Form>
              <Field type='hidden' name='idToken' value={location.state.idToken} />
              <div className='field'>
                <div className='control is-expanded'>
                  <Field name='username'
                    className={errors.username && touched.username ?
                      'input fat-border is-danger' : 'input is-black fat-border'}
                    type='text'
                    placeholder='Username' />
                </div>
                <ErrorMessage name='username'
                  component='p'
                  className='help is-danger' />
              </div>
              <div className='field'>
                <div className='control is-expanded'>
                  <Field name='password'
                    className={errors.password && touched.password ?
                      'input fat-border is-danger' : 'input is-black fat-border'}
                    type='text'
                    placeholder='Password' />
                </div>
                <ErrorMessage name='password'
                  component='p'
                  className='help is-danger' />
              </div>
              <div className='field'>
                <button ref={this.btnRegisterRef}
                  type='submit'
                  className='button is-primary is-fullwidth'>
                  Register
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )
    } else if (location.state.provider === 'facebook') {

    }
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
                  <h1 className='is-size-2 has-text-weight-semibold'>{this.state.spiel}</h1>
                  {this.createSignUpForm()}
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
                  {/* <a className='icon button'
                    href='#'
                    style={{
                      color: '#ffffff',
                      backgroundColor: '#212529'
                    }}>
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
            <Link to='/login'
              className='nav-btn button not-outlined has-text-weight-semibold fat-border'>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp