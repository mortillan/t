import React, { Component } from 'react'
import './Timer.css'
import 'bulma-slider/dist/js/bulma-slider'

import Slider from '../component/Slider'
import TopBar from '../component/TopBar'
import Brand from '../component/Brand'
import OnlineCount from '../component/OnlineCount'

import worker from '../workers/timer.worker'
import HourCount from '../component/HourCount'
import MinCount from '../component/MinCount'
import TaskTimeRemaining from '../component/TaskTimeRemaining'
import { taskKey, calculateSecondsPastMidnight } from '../lib/common'
import { TASK_TYPES } from '../lib/constants'

const MAX_SECONDS = 86400
const MS_IN_DAY = 86400000
const LAEGATO = 'Laegato'

class Timer extends Component {
  constructor() {
    super()
    this.state = {
      tickHours: 0,
      tickMins: 0,
      tick: 0,
      tasksLog: JSON.parse(localStorage.getItem('logs')) || {},
      taskKey: taskKey(new Date()),
      currentTask: null,
      slider: 5,
      focusMode: false,
      mode: '',
      taskTimer: null,
      nightMode: false,
    }
    this.timerWorker = new Worker(URL.createObjectURL(new Blob(['(' + worker.toString() + ')()'])));
    this.onChangeSliderValue = this.onChangeSliderValue.bind(this)
    this.onClickTaskType = this.onClickTaskType.bind(this)
    this.startTimer = this.startTimer.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
    this.tickTimer = this.tickTimer.bind(this)
    this.onKeypress = this.onKeypress.bind(this)
    this.toggleTheme = this.toggleTheme.bind(this)
    this.onTimer = this.onTimer.bind(this)
  }

  startTimer(type = 'break') {
    const { tick, slider, focusMode } = this.state
    const length = slider * 60

    //create timer for task
    const intervalId = setInterval(this.tickTimer, 1000)

    //save task to state
    const newTask = {
      length: length,
      start: tick,
      end: tick + length,
      color: TASK_TYPES[type].color,
      type: type,
      tick: length,
      remaining: length,
      key: taskKey(new Date())
    }

    console.log(newTask)

    this.setState({
      currentTask: newTask,
      focusMode: !focusMode,
      mode: type,
      taskTimer: intervalId,
    })
    document.title = `${Math.trunc(length / 60)}`.padStart(2, '0') + ':' + `${length % 60}`.padStart(2, '0')
  }

  stopTimer() {
    const { focusMode, taskTimer, tasksLog, currentTask, tick } = this.state

    if (focusMode) {
      clearInterval(taskTimer)

      let length;
      const key = currentTask.key
      if (!tasksLog[key]) {
        tasksLog[key] = []
      }

      if (currentTask.end <= MAX_SECONDS) {
        tasksLog[key].push({
          ...currentTask,
          length: length,
        })
      } else {
        tasksLog[key].push({
          length: MAX_SECONDS - currentTask.start,
          start: currentTask.start,
          end: MAX_SECONDS,
          color: currentTask.color,
          type: currentTask.type,
        })
        const nextDay = new Date()
        nextDay.setTime(new Date(currentTask.key).getTime() + MS_IN_DAY)
        const nextKey = taskKey(nextDay)
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

    // console.log(currentTask);

    // const currentDateTime = new Date()
    // currentDateTime.setHours(0, 0, 0, 0)
    // currentDateTime.setSeconds()
    // const hours = currentDateTime.getHours()
    // const minutes = currentDateTime.getMinutes()
    // const seconds = currentDateTime.getSeconds()
    // const  = ((hours * 60 * 60) + (minutes * 60) + seconds) 
    const total = calculateSecondsPastMidnight(new Date())
    const tick = (total - currentTask.start) * (MAX_SECONDS / currentTask.length)
    const remaining = ((currentTask.start + currentTask.length) - total)
    // if(currentTask.tick <= 0){
    //   return this.stopTimer()
    // }

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

  toggleTheme() {
    const { nightMode } = this.state

    if (nightMode) {
      document.body.classList.remove('dark')
    } else {
      document.body.classList.add('dark')
    }

    this.setState({ nightMode: !nightMode })
  }

  onTimer(e) {
    const { timestamp, hrs, min, sec } = e.data
    const total = ((hrs * 60 * 60) + (min * 60) + sec)

    this.setState({
      tick: total,
      tickHours: 23 - hrs,
      tickMins: 59 - min,
      taskKey: taskKey(new Date(timestamp)),
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

  render() {
    const { tasksLog, taskKey, nightMode } = this.state
    const tasksToday = tasksLog[taskKey] || null

    return (
      <div className='vfull'>
        <TopBar brand={Brand(this.state)} mid={OnlineCount(this.state)} end={Navigation(this.state)} />
        <div className='container vfull'>
          <div className='columns is-vcentered vfull'>
            <div className='column columns is-multiline'>
              <div className='column is-12'>
                <h1 className={!this.state.focusMode ? 'is-size-2 has-text-weight-bold' : 'is-size-2 has-text-weight-bold hide'}>
                  You have <HourCount hr={this.state.tickHours} /> hours <MinCount min={this.state.tickMins} /> minutes today.
                </h1>
                {this.state.focusMode && <TaskTimeRemaining remaining={this.state.currentTask.remaining} focusMode={this.state.focusMode} mode={this.state.mode} />}
              </div>
              <div className='column is-12'>
                <svg width='100%' height='40' viewBox='0 0 86400 2320' preserveAspectRatio='none'>
                  <TimeBar fill={nightMode ? '#FFFFFF' : '#212529'} />
                  {tasksToday &&
                    tasksToday.map((task, i) => <TaskBar key={Date.now() + task.color + i} length={task.length} fill={task.color} start={task.start} />)}
                  <Marker x={this.state.tick} fill={nightMode ? '#FFFFFF' : '#212529'} />
                  {this.state.currentTask &&
                    <CountBar task={this.state.currentTask}
                      marker={<Marker x={this.state.currentTask.tick}
                        fill={nightMode ? '#FFFFFF' : '#212529'} />} />}
                </svg>
              </div>
              <div className='column is-12' style={{ minHeight: '75px' }}>
                <button className={!this.state.focusMode ? 'button is-outlined btn-tasks btn-work' : 'button is-outlined btn-tasks btn-work hide'}
                  data-type='work' onClick={this.onClickTaskType}>work</button>
                <button className={!this.state.focusMode ? 'button is-outlined btn-tasks btn-play' : 'button is-outlined btn-tasks btn-play hide'}
                  data-type='play' onClick={this.onClickTaskType}>play</button>
                <button className={!this.state.focusMode ? 'button is-outlined btn-tasks btn-learn' : 'button is-outlined btn-tasks btn-learn hide'}
                  data-type='learn' onClick={this.onClickTaskType}>learn</button>
                <button className={!this.state.focusMode ? 'button is-outlined btn-tasks btn-break' : 'button is-outlined btn-tasks btn-break hide'}
                  data-type='break' onClick={this.onClickTaskType}>break</button>
                <div className={this.state.focusMode ? 'focus-controls' : 'hide'}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span onClick={this.stopTimer} className='icon stop'><i className='ion-ionic ion-md-close'></i></span>
                    <span className='is-size-5 has-text-weight-bold grey-text'>Press "Esc" to stop</span>
                  </div>
                  <div className='is-size-5 has-text-weight-bold grey-text' style={{ display: 'flex', alignItems: 'center' }}>
                    {'#' + this.state.mode}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const Navigation = ({ focusMode }) => {
  return (
    <div className={focusMode ? 'navbar-end invisible' : 'navbar-end'}>
      <div className='navbar-item'>
        <div className='field is-grouped'>
          <p className='control'>
            <a className='button not-outlined has-text-weight-bold' href="/">Login</a>
          </p>
          <p className='control'>
            <a className='button has-text-weight-bold' href='/signup'>
              Create a free account
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

const TaskBar = (props) => {
  return (
    <rect x={props.start} y='0' width={props.length} height='2320' fill={props.fill} />
  )
}

const TimeBar = (props) => {
  return (
    <rect x='0' y='0' width='86400' height='2320' fill={props.fill} fillOpacity='.16' />
  )
}

const Marker = (props) => {
  return (
    <rect x={props.x} y='0' width='100' height='2320' fill={props.fill} />
  )
}

const CountBar = (props) => {
  const startTime = new Date()
  startTime.setHours(0, 0, 0, 0)
  startTime.setSeconds(props.task.start);

  const endTime = new Date()
  endTime.setHours(0, 0, 0, 0)
  endTime.setSeconds(props.task.start + props.task.length)

  return (
    <g>
      <rect x='0' y='0' width='86400' fill={props.task.color} height='2320' />
      {props.marker}
      <text x='864' y='1560'
        fontSize='1160'
        fill='#ffffff'>
        {startTime.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' })}
      </text>
      <text x='81300'
        y='1560'
        fontSize='1160'
        fill='#ffffff'>
        {endTime.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' })}
      </text>
    </g>
  )
}

// const taskKey = (date) => {
//   return date.toLocaleDateString();
// }

export default Timer