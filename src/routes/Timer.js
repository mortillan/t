import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'

import Slider from '../component/Slider'
import TopBar from '../component/TopBar'
import Brand from '../component/Brand'
import Footer from '../component/Footer'
import OnlineCount from '../component/OnlineCount'
import Copyright from '../component/Copyright'

import worker from '../workers/timer.worker'
import HourCount from '../component/HourCount'
import MinCount from '../component/MinCount'
import CircleButton from '../component/CircleButton'
import CountBar from '../component/CountBar'
import Marker from '../component/Marker'
import TimeBar from '../component/TimeBar'
import TaskBar from '../component/TaskBar'
import TaskTimeRemaining from '../component/TaskTimeRemaining'

import { taskKey, calculateSecondsPastMidnight } from '../lib/common'
import { GlobalContext, themes } from '../lib/context'
import { TASK_TYPES } from '../lib/constants'

import { css } from '../config/themes'
import './Timer.css'

const MAX_SECONDS = 86400
const MS_IN_DAY = 86400000
const LAEGATO = 'Laegato'
const TASK_KEY_FORMAT = 'YYYYMMDD';

class Timer extends Component {
  constructor() {
    super()
    this.state = {
      tickHours: 0,
      tickMins: 0,
      tick: 0,
      tasksLog: JSON.parse(localStorage.getItem('logs')) || {},
      taskKey: moment().format(TASK_KEY_FORMAT),
      currentTask: null,
      slider: 5,
      focusMode: false,
      mode: '',
      taskTimer: null,
    }
    this.timerWorker = new Worker(URL.createObjectURL(new Blob(['(' + worker.toString() + ')()'])));
    this.onChangeSliderValue = this.onChangeSliderValue.bind(this)
    this.onClickTaskType = this.onClickTaskType.bind(this)
    this.startTimer = this.startTimer.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
    this.tickTimer = this.tickTimer.bind(this)
    this.onKeypress = this.onKeypress.bind(this)
    this.onTimer = this.onTimer.bind(this)
  }

  startTimer(type = 'break') {
    const { tick, slider, focusMode } = this.state
    const length = slider * 60

    //save task to state
    const newTask = {
      length: length,
      start: tick,
      end: tick + length,
      color: TASK_TYPES[type].color,
      type: type,
      tick: 0,
      remaining: length,
      key: moment().format(TASK_KEY_FORMAT)
    }

    // console.log(newTask)

    this.setState({
      currentTask: newTask,
      focusMode: !focusMode,
      mode: type,
      taskTimer: setInterval(this.tickTimer, 1000),
    })
    document.title = `${Math.trunc(length / 60)}`.padStart(2, '0') + ':' + `${length % 60}`.padStart(2, '0')
  }

  stopTimer() {
    const { focusMode, taskTimer, tasksLog, currentTask, tick } = this.state

    if (focusMode) {
      clearInterval(taskTimer)

      const key = currentTask.key
      if (!tasksLog[key]) {
        tasksLog[key] = []
      }

      if (currentTask.end <= MAX_SECONDS) {
        tasksLog[key].push({
          length: currentTask.length - currentTask.remaining,
          start: currentTask.start,
          color: currentTask.color,
          type: currentTask.type,
        })
      } else {
        tasksLog[key].push({
          length: MAX_SECONDS - currentTask.start,
          start: currentTask.start,
          color: currentTask.color,
          type: currentTask.type,
        })
        // const nextDay = new Date()
        // nextDay.setTime(new Date(currentTask.key).getTime() + MS_IN_DAY)
        const nextKey = moment().add(1, 'd').format(TASK_KEY_FORMAT)
        tasksLog[nextKey] = []
        tasksLog[nextKey].push({
          length: tick - 0,
          start: 0,
          end: tick,
          color: currentTask.color,
          type: currentTask.type,
        })
      }

      //TODO stop current task on current time
      this.setState({
        focusMode: !focusMode,
        currentTask: null,
        taskTimer: null,
        tasksLog: tasksLog,
      })

      document.title = LAEGATO
      localStorage.setItem('logs', JSON.stringify(this.state.tasksLog))
    }
  }

  tickTimer() {
    const { currentTask } = this.state

    const total = calculateSecondsPastMidnight(new Date())
    const tick = (total - currentTask.start) * (MAX_SECONDS / currentTask.length)
    const remaining = ((currentTask.start + currentTask.length) - total)

    //auto stop countdown if no time remaining
    if (currentTask.remaining <= 0) {
      return this.stopTimer()
    }

    this.setState({
      currentTask: {
        ...currentTask,
        tick: tick,
        remaining: remaining,
      }
    })

    document.title = `${Math.trunc(remaining / 60)}`.padStart(2, '0') + ':' + `${remaining % 60}`.padStart(2, '0')
  }

  onKeypress(e) {
    const { key } = e

    if (key === 'Escape') {
      this.stopTimer()
    } else if (key === 'b') {
      this.startTimer('break')
    } else if (key === 'w') {
      this.startTimer('work')
    } else if (key === 'l') {
      this.startTimer('learn')
    } else if (key === 'p') {
      this.startTimer('play')
    }
  }

  onClickTaskType(e) {
    const { target } = e

    const { type } = target.dataset

    this.startTimer(type);
  }

  onChangeSliderValue(e) {
    this.setState({
      slider: e.target.value
    })
  }

  onTimer(e) {
    const { timestamp, hrs, min, sec } = e.data
    const total = ((hrs * 60 * 60) + (min * 60) + sec)

    this.setState({
      tick: total,
      tickHours: 23 - hrs,
      tickMins: 59 - min,
      taskKey: moment(timestamp).format(TASK_KEY_FORMAT),
    })
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeypress)

    this.timerWorker.addEventListener('message', this.onTimer);

    const currentDateTime = new Date()
    const hours = currentDateTime.getHours()
    const minutes = currentDateTime.getMinutes()
    const seconds = currentDateTime.getSeconds()
    const total = ((hours * 60 * 60) + (minutes * 60) + seconds)

    this.setState({
      tick: total,
      tickHours: 23 - hours,
      tickMins: 59 - minutes,
    })
  }

  componentWillUnmount() {
    this.timerWorker.terminate()
  }

  render() {
    const { tasksLog, taskKey } = this.state
    const tasksToday = tasksLog[taskKey] || null

    return (
      <GlobalContext.Consumer>
        {({ theme, toggleTheme }) => (
          <>
            <TopBar
              brand={<Brand theme={theme} focusMode={this.state.focusMode} />}
              mid={<OnlineCount />}
              end={<Navigation focusMode={this.state.focusMode} />} />
            <div className='container is-fluid vfull'>
              <div className='columns vfull is-vcentered'>
                <div className='column'>
                  <div className='columns is-multiline'>
                    <div className='column is-12'>
                      <h1 className={!this.state.focusMode ?
                        'is-size-2 has-text-weight-bold' :
                        'is-size-2 has-text-weight-bold hide'}>
                        You have <HourCount hr={this.state.tickHours} /> hours <MinCount min={this.state.tickMins} /> minutes today.
                      </h1>
                      {this.state.focusMode &&
                        <TaskTimeRemaining
                          remaining={this.state.currentTask.remaining}
                          focusMode={this.state.focusMode}
                          mode={this.state.mode} />}
                    </div>
                    <div className='column'>
                    <svg width='100%'
                      height='40'
                      viewBox='0 0 86400 2320'
                      preserveAspectRatio='none'>
                      <TimeBar fill={css[theme].color} fillOpacity='.16' />
                      {tasksToday &&
                        tasksToday.map((task, i) => (
                          <TaskBar key={Date.now() + task.color + i}
                            start={task.start}
                            length={task.length}
                            fill={task.color} />
                        ))}
                      <Marker start={this.state.tick} fill={css[theme].color} length='50' />
                      {this.state.currentTask &&
                        <>
                          <CountBar task={this.state.currentTask} />
                          <Marker start={this.state.currentTask.tick} length='50'
                            fill={css[theme].color} />
                        </>}
                    </svg>
                  </div>
                    {!this.state.focusMode && <div className='column is-narrow'>
                    <Link to='/logs'
                      className='icon button'
                      style={{
                        backgroundColor: css[themes.DARK].backgroundColor,
                        color: css[themes.DARK].color,
                        height: '2.5rem'
                      }}>
                      <i className='ion-ionic ion-ios-arrow-forward'
                        style={{
                          backgroundColor: css[themes.DARK].backgroundColor,
                          color: css[themes.DARK].color,
                        }}></i>
                    </Link>
                  </div>}
                    <div className='column is-12' style={{ minHeight: '75px' }}>
                    <button className={!this.state.focusMode ?
                      'button is-size-5 has-text-weight-bold is-outlined btn-tasks btn-work fat-border' :
                      'button is-size-5 is-outlined btn-tasks btn-work hide fat-border'}
                      data-type='work' onClick={this.onClickTaskType}>work</button>
                    <button className={!this.state.focusMode ?
                      'button is-size-5 has-text-weight-bold is-outlined btn-tasks btn-play fat-border' :
                      'button is-size-5 is-outlined btn-tasks btn-play hide fat-border'}
                      data-type='play' onClick={this.onClickTaskType}>play</button>
                    <button className={!this.state.focusMode ?
                      'button is-size-5 has-text-weight-bold is-outlined btn-tasks btn-learn fat-border' :
                      'button is-size-5 is-outlined btn-tasks btn-learn hide fat-border'}
                      data-type='learn' onClick={this.onClickTaskType}>learn</button>
                    <button className={!this.state.focusMode ?
                      'button is-size-5 has-text-weight-bold is-outlined btn-tasks btn-break fat-border' :
                      'button is-size-5 is-outlined btn-tasks btn-break hide fat-border'}
                      data-type='break' onClick={this.onClickTaskType}>break</button>
                    <div className={this.state.focusMode ? 'focus-controls' : 'hide'}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <span onClick={this.stopTimer}
                          className='icon stop'>
                          <i className='ion-ionic ion-md-close'></i>
                        </span>
                        <span className='is-size-5 has-text-weight-bold grey-text'>Press "Esc" to stop</span>
                      </div>
                      <div className='is-size-5 has-text-weight-bold grey-text'
                        style={{
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                        {'#' + this.state.mode}
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
                <div className={this.state.focusMode ?
                  'has-text-weight-bold is-size-5 invisible' :
                  'has-text-weight-bold is-size-5'}
                  style={{ width: '240px' }}>
                  <div>{this.state.slider} minutes</div>
                  <Slider onChange={this.onChangeSliderValue}
                    val={this.state.slider}
                    min='5'
                    max='90'
                    step='1' />
                </div>
                <div>
                  <CircleButton
                    className='button'
                    onClick={toggleTheme}
                    backgroundColor={css[theme].color}
                    size='1.5rem' />
                  {/* <a className={this.state.focusMode ?
                    'icon button is-primary hide' :
                    'icon is-primary button'}
                    href='#'>
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

const Navigation = ({ focusMode }) => {
  return (
    <div className={focusMode ? 'navbar-end invisible' : 'navbar-end'}>
      <div className='navbar-item'>
        <div className='field is-grouped'>
          <p className='control'>
            <Link to='/login' 
              className='button not-outlined has-text-weight-bold'>Login</Link>
          </p>
          <p className='control'>
            <Link to='/register' 
              className='button has-text-weight-bold fat-border'>Create a free account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Timer