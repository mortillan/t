import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import TopBar from '../component/TopBar'
import Brand from '../component/Brand'
import Footer from '../component/Footer'
import CircleButton from '../component/CircleButton'
import Copyright from '../component/Copyright'

import { GlobalContext } from '../lib/context'
import { css } from '../config/themes'

const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email('This is not a valid email')
    .required('This field is required'),
})

class SignUp extends Component {

  register = async (values, { setErrors }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/register/beta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values),
        mode: 'cors'
      })
      
      const json = await response.json()
      
      if(response.status !== 200) {
        setErrors({
          email: json.error
        })
      }
    } catch (error) {
      console.error(error)
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
                <div className='column is-offset-3 is-6'>
                  <h1 className='is-size-2 has-text-weight-bold'>Sign up for private beta</h1>
                  <Formik initialValues={{
                    email: ''
                  }}
                    validationSchema={RegisterSchema}
                    onSubmit={this.register}>
                    {({ errors, touched }) => (
                      <Form>
                        <div className='field'>
                          <div className='field has-addons' style={{ marginBottom: 0 }}>
                            <div className='control is-expanded'>
                              <Field name='email'
                                className={errors.email && touched.email ?
                                  'input fat-border is-danger' : 'input is-black fat-border'}
                                type='text'
                                placeholder='Your email address' />
                            </div>
                            <div className='control'>
                              <button type='submit'
                                className='button is-black'>
                                Let me know
                            </button>
                            </div>
                          </div>
                          <ErrorMessage name='email'
                            component='p'
                            className='help is-danger is-' />
                        </div>
                        <p className='is-size-7'>
                          We respect your privacy and do not tolerate spam and will never sell, rent, lease,
                          or give away your information (name, address, email, etc.) to any third party.
                          Nor will we send you unsolicited email.
                        </p>
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
              className='button not-outlined has-text-weight-bold'>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp