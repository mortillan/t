import React, { Component, memo, useState, useReducer, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
// import moment from 'moment'
import getIsoWeek from 'date-fns/get_iso_week'
import dateFormat from 'date-fns/format'
import Notification from 'react-web-notification'

import Slider from '../components/Slider'
import TopBar from '../components/TopBar'
import Brand from '../components/Brand'
import Footer from '../components/Footer'
import OnlineCount from '../components/OnlineCount'
import Copyright from '../components/Copyright'
import HourCount from '../components/HourCount'
import MinCount from '../components/MinCount'
import CircleButton from '../components/CircleButton'
import TimeFluid from '../components/TimeFluid'
import TimeBar from '../components/TimeBar'
import TaskBar from '../components/TaskBar'
import TaskTimeRemaining from '../components/TaskTimeRemaining'

import worker from '../workers/timer.worker'

import { calculateSecondsPastMidnight } from '../lib/common'
import { GlobalContext, themes } from '../lib/context'
import { TASK_TYPES, TASK_KEY_FORMAT } from '../lib/constants'
import { DOC_TITLE } from '../config/app'

import { css } from '../config/themes'

import { clockReducer } from '../reducers/clock'
import { TICK } from '../actions/main'

import { taskReducer } from '../reducers/task'

import { timelogReducer, initialState as timelogInitialState } from '../reducers/timelogs'

const MAX_SECONDS = 86400

function initClockState(initialClockState) {
  const date = new Date()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const ms = date.getMilliseconds()

  return {
    tick: ((hours * 60 * 60) + (minutes * 60) + seconds),
    tickHours: 23 - hours,
    tickMins: 59 - minutes,
    taskKey: dateFormat(new Date(), TASK_KEY_FORMAT),
  }
}

const createTopBar = (hasTask, theme) => {
  if (hasTask) {
    return (
      <TopBar />
    )
  }

  return (
    <TopBar
      brand={<Brand theme={theme} />}
      mid={<OnlineCount />}
      end={createNav()} />
  )
}

const createNav = () => {
  return (
    <div className='navbar-end'>
      <div className='navbar-item'>
        <div className='field is-grouped'>
          <p className='control'>
            <Link to='/login'
              className='nav-btn button not-outlined has-text-weight-semibold fat-border'>Login</Link>
          </p>
          <p className='control'>
            <Link to='/register'
              className='nav-btn button has-text-weight-semibold fat-border'>Create a free account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const createTaskButton = (focusMode) => {
  const types = Object.keys(TASK_TYPES)

  return types.map(type => (
    <button key={`btn-task-${type}`} className={!focusMode ?
      `button is-size-5 has-text-weight-semibold is-outlined btn-tasks fat-border btn-${type}` :
      `button is-size-5 is-outlined btn-tasks hide fat-border btn-${type}`}
      data-type={type} onClick={() => null}>
      {type}
    </button>
  ))
}

const createTaskTimerBar = (currentTask, theme) => {
  return (
    <>
      <TimeBar clipPath='url(#br-tb)' fill={css[theme].color} fillOpacity='.16' />
      <g className='tlb'>
        <TimeFluid start={currentTask.tick}
          fill={currentTask.color}
          clipPath='url(#br-tb)' />
      </g>
    </>
  )
}

const createTimeBar = (timeLogs, tick, theme) => {
  return (
    <>
      <TimeBar clipPath='url(#br-tb)' fill={css[theme].color} fillOpacity='.16' />
      <TimeFluid start={tick}
        fill={css[theme].color}
        fillOpacity='.16'
        clipPath='url(#br-tb)' />
      {timeLogs && timeLogs.map((task, i) => (
        <TaskBar key={Date.now() + task.color + i}
          start={task.start}
          length={task.length}
          fill={task.color} />
      ))}
    </>
  )
}

export const Timer = ({ initialClockState }) => {
  const [clock, clockDispatch] = useReducer(clockReducer, initialClockState, initClockState)
  const [currentTask, currentTaskDispatch] = useReducer(taskReducer, null)
  const [timeLogs, timeLogsDispatch] = useReducer(timelogReducer, timelogInitialState)

  useEffect(() => {
    function onTimer({ data: { hrs, min, sec } }) {
      const total = ((hrs * 60 * 60) + (min * 60) + sec)

      clockDispatch({
        type: TICK,
        data: {
          tick: total,
          tickHours: 23 - hrs,
          tickMins: 59 - min,
        }
      })
    }

    const timerWorker = new Worker(URL.createObjectURL(new Blob(['(' + worker.toString() + ')()'])))

    timerWorker.addEventListener('message', onTimer)

    return (() => {
      timerWorker.terminate()
    })
  })

  const globalContext = useContext(GlobalContext)

  const [slider, sliderSetState] = useState(5)

  return (
    <>
      {createTopBar(currentTask, globalContext.theme)}
      <div className='container is-fluid vfull'>
        <div className='columns vfull is-vcentered'>
          <div className='column'>
            <div className='columns is-multiline'>
              <div className='column is-12'>
                <h1 className={!currentTask ?
                  'is-size-2 has-text-weight-semibold' :
                  'is-size-2 has-text-weight-semibold hide'}>
                  You have <HourCount hr={clock.tickHours} /> hours <MinCount min={clock.tickMins} /> minutes today.
                    </h1>
              </div>
              <div className='column is-flex-desktop is-flex-touch' style={{ alignItems: 'center' }}>
                <svg viewBox={`0 0 ${MAX_SECONDS} 2320`} style={{ flex: '1 1 auto' }}>
                  <clipPath id='br-tb'>
                    <rect height='2320' y='0' x='0' width={MAX_SECONDS} rx='250' ry='250' />
                  </clipPath>
                  {currentTask ? createTaskTimerBar(currentTask, globalContext.theme) : createTimeBar(timeLogs[clock.taskKey], clock.tick, globalContext.theme)}
                </svg>
                {!currentTask && <Link to='/logs'
                  className='icon button'
                  style={{
                    backgroundColor: globalContext.theme === themes.LIGHT ? 'rgba(33, 37, 41, .16)' : css[globalContext.theme].backgroundColor,
                    borderColor: 'transparent',
                    height: '2.25rem',
                    flex: '0 0 auto',
                    marginLeft: '1rem',
                  }}>
                  <i className='ion-ionic ion-ios-arrow-forward'
                    style={{
                      color: css[globalContext.theme].color,
                      fontWeight: 'bold',
                      fontSize: '1.25rem',
                    }}></i>
                </Link>}
              </div>
              <div className='column is-12' style={{ minHeight: '75px' }}>
                {createTaskButton(currentTask)}
                <div className={currentTask ? 'focus-controls' : 'hide'}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span onClick={() => currentTaskDispatch()}
                      className='icon stop'>
                      <i className='ion-ionic ion-md-close'></i>
                    </span>
                    <span className='is-size-5 has-text-weight-semibold grey-text'>Press "Esc" to stop</span>
                  </div>
                  <div className='is-size-5 has-text-weight-semibold grey-text'
                    style={{
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                    {currentTask && `#${currentTask.type}`}
                  </div>
                </div>
              </div>
            </div>
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
          <div className={currentTask ?
            'has-text-weight-semibold is-size-5 is-invisible' :
            'has-text-weight-semibold is-size-5'}
            style={{ width: '240px' }}>
            <div>{slider} minutes</div>
            <Slider
              val={slider}
              onChange={e => sliderSetState(e.target.value)}
              min='5'
              max='90'
              step='1' />
          </div>
          <div>
            <CircleButton
              className='button'
              onClick={globalContext.toggleTheme}
              backgroundColor={css[globalContext.theme].color}
              size='1.5rem' />
          </div>
        </div>
      </Footer>
    </>
  )
}

// export class Timer1 extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       tickHours: 0,
//       tickMins: 0,
//       tick: 0,
//       tasksLog: JSON.parse(localStorage.getItem('logs')) || {},
//       taskKey: moment().format(TASK_KEY_FORMAT),
//       currentTask: null,
//       slider: 5,
//       focusMode: false,
//       mode: '',
//       taskTimer: null,
//       showNotif: false,
//     }
//     this.timerWorker = new Worker(URL.createObjectURL(new Blob(['(' + worker.toString() + ')()'])));
//   }

//   createNav = () => {
//     const { focusMode } = this.state
//     return (
//       <div className={focusMode ? 'navbar-end is-invisible' : 'navbar-end'}>
//         <div className='navbar-item'>
//           <div className='field is-grouped'>
//             <p className='control'>
//               <Link to='/login'
//                 className='nav-btn button not-outlined has-text-weight-semibold fat-border'>Login</Link>
//             </p>
//             <p className='control'>
//               <Link to='/register'
//                 className='nav-btn button has-text-weight-semibold fat-border'>Create a free account</Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   createTaskButton = () => {
//     const { focusMode } = this.state
//     const types = Object.keys(TASK_TYPES)

//     return types.map(type => (
//       <button key={`btn-task-${type}`} className={!focusMode ?
//         `button is-size-5 has-text-weight-semibold is-outlined btn-tasks fat-border btn-${type}` :
//         `button is-size-5 is-outlined btn-tasks hide fat-border btn-${type}`}
//         data-type={type} onClick={this.onClickTaskType}>
//         {type}
//       </button>
//     ))
//   }

//   createTopBar = (theme) => {
//     return (
//       <TopBar
//         brand={<Brand theme={theme} focusMode={this.state.focusMode} />}
//         mid={<OnlineCount />}
//         end={this.createNav()} />
//     )
//   }

//   createTaskTimerBar = (theme) => {
//     const { currentTask } = this.state
//     return (
//       <>
//         <TimeBar clipPath='url(#br-tb)' fill={css[theme].color} fillOpacity='.16' />
//         <g className='tlb'>
//           <TimeFluid start={currentTask.tick}
//             fill={currentTask.color}
//             clipPath='url(#br-tb)' />
//         </g>
//       </>
//     )
//   }

//   createTimeBar = (theme) => {
//     const { tasksLog, taskKey, tick } = this.state
//     const tasksToday = tasksLog[taskKey] || null
//     return (
//       <>
//         <TimeBar clipPath='url(#br-tb)' fill={css[theme].color} fillOpacity='.16' />
//         <TimeFluid start={tick}
//           fill={css[theme].color}
//           fillOpacity='.16'
//           clipPath='url(#br-tb)' />
//         {tasksToday && tasksToday.map((task, i) => (
//           <TaskBar key={Date.now() + task.color + i}
//             start={task.start}
//             length={task.length}
//             fill={task.color} />
//         ))}
//       </>
//     )
//   }

//   startTimer = (type = 'break') => {
//     const { tick, slider, focusMode } = this.state
//     const length = slider * 60

//     //save task to state
//     const newTask = {
//       length: length,
//       start: tick,
//       end: tick + length,
//       color: TASK_TYPES[type].color,
//       type: type,
//       tick: 0,
//       remaining: length,
//       key: moment().format(TASK_KEY_FORMAT)
//     }

//     this.setState(() => ({
//       currentTask: newTask,
//       focusMode: !focusMode,
//       mode: type,
//       taskTimer: setInterval(() => this.tickTimer(new Date()), 1000),
//     }))
//     document.title = `${Math.trunc(length / 60)}`.padStart(2, '0') + ':' + `${length % 60}`.padStart(2, '0')
//   }

//   stopTimer = () => {
//     const { focusMode, taskTimer, tasksLog, currentTask, tick } = this.state

//     if (!focusMode) {
//       return;
//     }

//     clearInterval(taskTimer)

//     const key = currentTask.key
//     if (!tasksLog[key]) {
//       tasksLog[key] = []
//     }

//     if (currentTask.end <= MAX_SECONDS) {
//       tasksLog[key].push({
//         length: currentTask.length - currentTask.remaining,
//         start: currentTask.start,
//         color: currentTask.color,
//         type: currentTask.type,
//       })
//     } else {
//       tasksLog[key].push({
//         length: MAX_SECONDS - currentTask.start,
//         start: currentTask.start,
//         color: currentTask.color,
//         type: currentTask.type,
//       })

//       const nextKey = moment().add(1, 'd').format(TASK_KEY_FORMAT)
//       tasksLog[nextKey] = []
//       tasksLog[nextKey].push({
//         length: tick - 0,
//         start: 0,
//         end: tick,
//         color: currentTask.color,
//         type: currentTask.type,
//       })
//     }

//     //TODO stop current task on current time
//     this.setState({
//       focusMode: !focusMode,
//       currentTask: null,
//       taskTimer: null,
//       tasksLog: tasksLog,
//     })

//     document.title = DOC_TITLE
//     localStorage.setItem('logs', JSON.stringify(this.state.tasksLog))
//   }

//   tickTimer = (date) => {
//     const { currentTask } = this.state

//     const total = calculateSecondsPastMidnight(date)
//     const tick = (total - currentTask.start) * (MAX_SECONDS / currentTask.length)
//     let remaining = Math.max(0, ((currentTask.start + currentTask.length) - total))

//     this.setState({
//       currentTask: {
//         ...currentTask,
//         tick: tick,
//         remaining: remaining,
//       }
//     })

//     document.title = `${Math.trunc(remaining / 60)}`.padStart(2, '0') + ':' + `${remaining % 60}`.padStart(2, '0')

//     //auto stop countdown if no time remaining
//     if (remaining <= 0) {
//       this.stopTimer()
//       this.setState((state, props) => {
//         return {
//           showNotif: true,
//         }
//       })
//     }
//   }

//   onKeypress = (e) => {
//     const { key } = e

//     if (key === 'Escape') {
//       this.stopTimer()
//     } else if (key === 'b') {
//       this.startTimer('break')
//     } else if (key === 'w') {
//       this.startTimer('work')
//     } else if (key === 'l') {
//       this.startTimer('learn')
//     } else if (key === 'p') {
//       this.startTimer('play')
//     }
//   }

//   onClickTaskType = (e) => {
//     const { target } = e

//     const { type } = target.dataset

//     this.startTimer(type);
//   }

//   onChangeSliderValue = (e) => {
//     this.setState({
//       slider: e.target.value
//     })
//   }

//   onTimer = (e) => {
//     const { timestamp, hrs, min, sec } = e.data
//     const total = ((hrs * 60 * 60) + (min * 60) + sec)

//     this.setState({
//       tick: total,
//       tickHours: 23 - hrs,
//       tickMins: 59 - min,
//       taskKey: moment(timestamp).format(TASK_KEY_FORMAT),
//     })
//   }

//   onShowNotif = (e, tag) => {
//     this.setState({
//       showNotif: false,
//     })
//   }

//   onClickNotif = (e, tag) => {
//     window.focus()
//   }

//   componentDidMount() {
//     document.addEventListener('keydown', this.onKeypress)

//     this.timerWorker.addEventListener('message', this.onTimer);

//     const currentDateTime = new Date()
//     const hours = currentDateTime.getHours()
//     const minutes = currentDateTime.getMinutes()
//     const seconds = currentDateTime.getSeconds()
//     const total = ((hours * 60 * 60) + (minutes * 60) + seconds)

//     this.setState({
//       tick: total,
//       tickHours: 23 - hours,
//       tickMins: 59 - minutes,
//     })
//   }

//   componentWillUnmount() {
//     this.timerWorker.terminate()
//   }

//   render() {
//     return (
//       <GlobalContext.Consumer>
//         {({ theme, toggleTheme }) => (
//           <>
//             {this.createTopBar(theme)}
//             <div className='container is-fluid vfull'>
//               <div className='columns vfull is-vcentered'>
//                 <div className='column'>
//                   <div className='columns is-multiline'>
//                     <div className='column is-12'>
//                       <h1 className={!this.state.focusMode ?
//                         'is-size-2 has-text-weight-semibold' :
//                         'is-size-2 has-text-weight-semibold hide'}>
//                         You have <HourCount hr={this.state.tickHours} /> hours <MinCount min={this.state.tickMins} /> minutes today.
//                       </h1>
//                       {this.state.focusMode &&
//                         <TaskTimeRemaining
//                           remaining={this.state.currentTask.remaining}
//                           focusMode={this.state.focusMode}
//                           mode={this.state.mode} />}
//                     </div>
//                     <div className='column is-flex-desktop is-flex-touch' style={{ alignItems: 'center' }}>
//                       <svg viewBox='0 0 86400 2320' style={{ flex: '1 1 auto' }}>
//                         <clipPath id='br-tb'>
//                           <rect height='2320' y='0' x='0' width='86400' rx='250' ry='250' />
//                         </clipPath>
//                         {this.state.currentTask ? this.createTaskTimerBar(theme) : this.createTimeBar(theme)}
//                       </svg>
//                       {!this.state.focusMode && <Link to='/logs'
//                         className='icon button'
//                         style={{
//                           backgroundColor: theme === themes.LIGHT ? 'rgba(33, 37, 41, .16)' : css[theme].backgroundColor,
//                           borderColor: 'transparent',
//                           height: '2.25rem',
//                           flex: '0 0 auto',
//                           marginLeft: '1rem',
//                         }}>
//                         <i className='ion-ionic ion-ios-arrow-forward'
//                           style={{
//                             color: css[theme].color,
//                             fontWeight: 'bold',
//                             fontSize: '1.25rem',
//                           }}></i>
//                       </Link>}
//                     </div>
//                     <div className='column is-12' style={{ minHeight: '75px' }}>
//                       {this.createTaskButton()}
//                       <div className={this.state.focusMode ? 'focus-controls' : 'hide'}>
//                         <div style={{
//                           display: 'flex',
//                           alignItems: 'center'
//                         }}>
//                           <span onClick={this.stopTimer}
//                             className='icon stop'>
//                             <i className='ion-ionic ion-md-close'></i>
//                           </span>
//                           <span className='is-size-5 has-text-weight-semibold grey-text'>Press "Esc" to stop</span>
//                         </div>
//                         <div className='is-size-5 has-text-weight-semibold grey-text'
//                           style={{
//                             display: 'flex',
//                             alignItems: 'center'
//                           }}>
//                           {'#' + this.state.mode}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {this.state.showNotif && <Notification timeout={10000}
//               title={'Laegato'}
//               onShow={this.onShowNotif}
//               onClick={this.onClickNotif}
//               options={{
//                 tag: Date.now(),
//                 body: `Time's up!`,
//                 icon: 'favicon.ico',
//                 lang: 'en',
//               }} />}
//             <Footer>
//               <div className='content'
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'flex-end'
//                 }}>
//                 <Copyright />
//                 <div className={this.state.focusMode ?
//                   'has-text-weight-semibold is-size-5 is-invisible' :
//                   'has-text-weight-semibold is-size-5'}
//                   style={{ width: '240px' }}>
//                   <div>{this.state.slider} minutes</div>
//                   <Slider onChange={this.onChangeSliderValue}
//                     val={this.state.slider}
//                     min='5'
//                     max='90'
//                     step='1' />
//                 </div>
//                 <div>
//                   <CircleButton
//                     className='button'
//                     onClick={toggleTheme}
//                     backgroundColor={css[theme].color}
//                     size='1.5rem' />
//                   {/* <a className={this.state.focusMode ?
//                     'icon button is-primary hide' :
//                     'icon is-primary button'}
//                     href='#'>
//                     <i className='ion-ionic ion-md-help'></i>
//                   </a> */}
//                 </div>
//               </div>
//             </Footer>
//           </>
//         )}
//       </GlobalContext.Consumer>
//     )
//   }
// }

// const Navigation = memo(({ focusMode }) => {
//   return (
//     <div className={focusMode ? 'navbar-end is-invisible' : 'navbar-end'}>
//       <div className='navbar-item'>
//         <div className='field is-grouped'>
//           <p className='control'>
//             <Link to='/login'
//               className='nav-btn button not-outlined has-text-weight-semibold fat-border'>Login</Link>
//           </p>
//           <p className='control'>
//             <Link to='/register'
//               className='nav-btn button has-text-weight-semibold fat-border'>Create a free account</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// })
