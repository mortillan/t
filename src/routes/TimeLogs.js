import React from 'react'
import { Link } from 'react-router-dom'
import LazyLoad from 'react-lazyload'
import moment from 'moment'

import TopBar from '../component/TopBar'
import Brand from '../component/Brand'
import Footer from '../component/Footer'
import OnlineCount from '../component/OnlineCount'
import CircleButton from '../component/CircleButton'
import Copyright from '../component/Copyright';

import { GlobalContext, themes } from '../lib/context'
import { css } from '../config/themes'

const underline = {
  borderBottom: `solid 1px rgba(33,37,41, .16)`,
}

const verticalMargin = {
  marginLeft: '1rem',
  marginRight: '1rem',
}

const WeekLog = ({ logs, weekNum }) => {
  const days = moment.weekdaysShort()
  const dayOfWeek = moment().day()

  return (
    <LazyLoad height={500}>
      <>
        <div className='columns is-vcentered'>
          <div className='column is-size-5 has-text-weight-bold has-text-left'
            style={{ ...verticalMargin }}>WEEK {weekNum}</div>
          <div className='column is-size-5 has-text-weight-bold has-text-right'
            style={{ ...verticalMargin }}>{moment().year()}</div>
        </div>
        <div className='columns'>
          {days.map((d, i) => {
            const style = i > dayOfWeek ? {
              color: '#212529',
              opacity: '.16',
            } : {}
            return <div key={`header-${i}-weeklog`} className='column is-size-5 has-text-weight-bold'
              style={{
                ...style,
                ...underline,
                ...verticalMargin
              }}>{moment().week(weekNum).day(i).format('ddd, MMM D')}</div>
          })}
        </div>
        <div className='columns'>
          {days.map((d, i) => {
            const key = moment().week(weekNum).day(i).format('YYYYMMDD')
            const totalSec = logs[key] ? logs[key].reduce((acc, task) => acc += task.length, 0) : 0
            return <div key={`total-${i}-weeklog`} className='column is-size-6 has-text-weight-bold'
              style={{
                ...underline,
                ...verticalMargin
              }}>Total {totalSec > 0 ? `${Math.trunc(totalSec / 3600)}h ${Math.trunc(totalSec % 60)}m` : 0}</div>
          })}
        </div>
        <div className='columns'>
          {days.map((d, i) => {
            const key = moment().week(weekNum).day(i).format('YYYYMMDD')
            return <div key={`tasks-${i}-${Date.now()}`} className='column is-size-6'
              style={{ ...verticalMargin }}>{
                logs[key] &&
                logs[key].map((task, i) => <div key={`taskduration-${i}-${performance.now()}`}>{task.type} {task.length < 60 ? `<1m` : `${Math.trunc(task.length / 60)}m`}</div>)}
            </div>
          })}
        </div>
      </>
    </LazyLoad>
  )
}

export default function TimeLogs(props) {
  const logs = JSON.parse(localStorage.getItem('logs')) || {}
  // const dayOfWeek = moment().day()
  // const days = moment.weekdaysShort()
  const weekYear = moment().week()
  const weeksInYear = [...Array(weekYear).keys()]

  return (
    <GlobalContext.Consumer>
      {({ theme, toggleTheme }) => (
        <>
          <TopBar
            brand={<Brand theme={theme} />}
            mid={<OnlineCount />}
            end={<Navigation />} />
          <div className='container vfull'>
            <div className='columns is-vcentered'>
              <div className='column is-size-2 has-text-weight-bold has-text-centered'
                style={{ ...verticalMargin }}>Logs</div>
            </div>
            {weeksInYear.map((curr, index, arr) => <WeekLog key={`weeklog-${index}`} logs={logs} weekNum={arr.length - index} />)}
          </div>
          {/* <Footer>
            <div className='content'
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end'
              }}>
              <Copyright />
              <div>
                <CircleButton
                  className='button'
                  onClick={toggleTheme}
                  backgroundColor={css[theme].color}
                  size='1.5rem' />
                <a className='icon button theme'
              href='#' style={{ color: '#ffffff', backgroundColor: '#212529' }}>
              <i className='ion-ionic ion-md-help'></i>
            </a>
              </div>
            </div>
          </Footer> */}
        </>
      )}
    </GlobalContext.Consumer>
  )
}

const Navigation = () => {
  return (
    <div className='navbar-end'>
      <div className='navbar-item'>
        <div className='field is-grouped'>
          <p className='control'>
            <Link to='/login'
              className='button not-outlined has-text-weight-bold'>Login</Link>
          </p>
          <p className='control'>
            <Link to='/register'
              className='button has-text-weight-bold is-outlined'>Create a free account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

