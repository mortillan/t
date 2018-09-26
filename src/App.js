import React, { Component } from 'react'
// import logo from './logo.svg'
import './App.css'
// import { select, path } from 'd3'
import 'bulma-slider/dist/js/bulma-slider'
import Slider from './component/Slider'

class App extends Component {
  constructor() {
    super()
    this.state = {
      remainingHours: 0,
      remainingMins: 0,
      remainingSec: 0,
      markerX: 0,
      tasksLog: JSON.parse(localStorage.getItem('logs')) || {},
      currentTask: null,
      currentTaskEnd: 0,
      slider: 5,
      focusMode: false,
      mode: '',
      taskTimer: null,
      nightMode: false,
    }
    this.onChangeSliderValue = this.onChangeSliderValue.bind(this)
    this.onClickTaskType = this.onClickTaskType.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
    this.onKeypress = this.onKeypress.bind(this)
    this.startTimer = this.startTimer.bind(this)
    this.toggleTheme = this.toggleTheme.bind(this)
  }

  startTimer(type) {
    let color

    switch(type) {
      case 'work':
        color = '#339AF0'
        break
      case 'play':
        color = '#FCC419'
        break
      case 'learn':
        color = '#51CF66'
        break
      default:
      case 'break':
        color ='#FA5252'
        break
    }

    const length = (this.state.slider * 60)

    //create timer for task
    const intervalId = setInterval(() => {
      if(this.state.currentTask.remainingSec <= 0){
        return this.stopTimer()
      }

      const sec = this.state.currentTask.remainingSec - 1
      
      this.setState({
        currentTask: {
          ...this.state.currentTask,
          remainingSec: sec,
        }
      })
      document.title = `${Math.trunc(sec / 60)}`.padStart(2, '0') + ':' + `${sec % 60}`.padStart(2, '0')
    }, 1000)

    //save task to state
    const newTask = {
      length: length, 
      start: this.state.markerX,
      color: color,
      type: type,
      remainingSec: length,
    }

    // console.log(newTask);

    // const { tasksLog } = this.state
    // const key = taskKey(new Date())
    // if(!tasksLog[key]){
    //   tasksLog[key] = []
    // }
    // tasksLog[key].push(newTask)

    this.setState({
      currentTask: newTask,
      currentTaskEnd: this.state.currentTaskEnd === 0 ? this.state.markerX + length : this.state.currentTaskEnd + length,
      focusMode: !this.state.focusMode,
      mode: type,
      taskTimer: intervalId,
      //tasksLog: tasksLog,
    })

    localStorage.setItem('logs', JSON.stringify(this.state.tasksLog))
  }

  stopTimer() {
    const { focusMode, taskTimer, tasksLog, currentTask, markerX } = this.state

    if(focusMode) {
      clearInterval(taskTimer)

      const length = markerX - currentTask.start

      const key = taskKey(new Date())
      if(!tasksLog[key]){
        tasksLog[key] = []
      }
      tasksLog[key].push({
        ...currentTask,
        length: length,
      })

      //TODO stop current task on current time
      this.setState({
        focusMode: !focusMode,
        currentTask: null,
        taskTimer: null,
        tasksLog: tasksLog,
      })

      document.title = 'Laegato'
    }
  }

  onKeypress(e) {
    const { key } = e

    if(key === 'Escape') {
      this.stopTimer()
    } 
  }

  onClickTaskType(e) {
    const { target } = e

    const { type }  = target.dataset

    this.startTimer(type);
  }

  onChangeSliderValue(e) {
    this.setState({
      slider: e.target.value
    })
  }

  toggleTheme() {
    const { nightMode } = this.state

    if(nightMode) {
      document.body.classList.remove('dark')
    } else {
      document.body.classList.add('dark')
    }

    this.setState({nightMode: !nightMode})
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeypress)

    const currentDateTime = new Date()
    const hours = currentDateTime.getHours()
    const minutes = currentDateTime.getMinutes()
    const seconds = currentDateTime.getSeconds()
    const total = ((hours * 60 * 60) + (minutes * 60) + seconds)

    // console.log(total)

    this.setState({
      markerX: total,
      remainingHours: 23 - hours,
      remainingMins: 59 - minutes,
    })

    setInterval(() => {
      this.setState((prevState) => {
        const currentDateTime = new Date()
        const hours = currentDateTime.getHours()
        const minutes = currentDateTime.getMinutes()

        if(prevState.markerX + 1 > 86400) {
          return { 
            markerX: 0,
            remainingHours: 23 - hours,
            remainingMins: 60 - minutes,
          }
        }

        //console.log(prevState.markerX + 0.01)

        return { 
          markerX: prevState.markerX + 1,
          remainingHours: 23 - hours,
          remainingMins: 60 - minutes,
        }
      })
    }, 1000)
  }

  render() {
    const { tasksLog, nightMode } = this.state
    const key = taskKey(new Date())
    const tasksToday = tasksLog[key] || null

    return (
      <div className='vfull'>
        <nav className='navbar is-fixed-top' aria-label='main navigation'>
          <div className={this.state.focusMode ? 'navbar-brand invisible' : 'navbar-brand'}>
            <a className='navbar-item' href='https://laegato.com'>
              <img src='/img/logo-laegato.png' alt='' width='110' />
            </a>
            {/* <span className='is-size-4 has-text-weight-bold' style={{margin: 'auto'}}>Laegato</span> */}
          </div>
          <div className="navbar-menu">
            <div className={this.state.focusMode ? 'navbar-start invisible' : 'navbar-start'}>
            </div>
            <div style={{margin: 'auto', display: 'flex', alignItems: 'strect'}}>
              {/* <div>4,999 online users</div> */}
            </div>
            <div className={this.state.focusMode ? 'navbar-end invisible' : 'navbar-end'}>
              <div className='navbar-item'>
                <div className='field is-grouped'>
                  <p className='control'>
                    <a className='button not-outlined' href="#">Login</a>
                  </p>
                  <p className='control'>
                    <a className='button' href='#'>
                      Create a free account
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <section className='section vfull' style={{paddingLeft: '6rem', paddingRight: '6rem'}}>
          <div className='columns is-vcentered vfull'>
            <div className='column columns is-multiline'>
              <div className='column is-12'>
                <h1 className={!this.state.focusMode ? 'is-size-2 has-text-weight-bold' : 'is-size-2 has-text-weight-bold hide'}>
                You have {this.state.remainingHours} hours {this.state.remainingMins} minutes today.
                </h1>
                {this.state.currentTask && 
                <h1 className={this.state.focusMode ? 'is-size-2 has-text-weight-bold' : 'is-size-2 has-text-weight-bold hide'}>
                You have {`${Math.trunc(this.state.currentTask.remainingSec / 60)}`.padStart(2, '0')} minutes {`${this.state.currentTask.remainingSec % 60}`.padStart(2, '0')} seconds to #{this.state.mode}</h1>}
              </div>
              <div className='column is-12'>
                <svg width='100%' height='40' viewBox='0 0 86400 2320' preserveAspectRatio='none'>
                  <TimeBar fill={nightMode ? '#FFFFFF' : '#212529'} />
                  {tasksToday && 
                    tasksToday.map((task, i) => <TaskBar key={Date.now() + task.color + i} length={task.length} fill={task.color} start={task.start} />)}
                  <Marker x={this.state.markerX} fill={nightMode ? '#FFFFFF' : '#212529'} />
                  {this.state.currentTask && 
                    <CountBar task={this.state.currentTask}
                    marker={<Marker x={(this.state.currentTask.length - this.state.currentTask.remainingSec) * (86400 / this.state.currentTask.length)} fill={nightMode ? '#FFFFFF' : '#212529'}   />} />}
                </svg>
              </div>
              <div className='column is-12' style={{ minHeight: '75px'}}>              
                <button className={!this.state.focusMode ? 'button is-outlined btn-tasks btn-work' : 'button is-outlined btn-tasks btn-work hide'} 
                data-type='work' onClick={this.onClickTaskType}>work</button>
                <button className={!this.state.focusMode ? 'button is-outlined btn-tasks btn-play' : 'button is-outlined btn-tasks btn-play hide'} 
                data-type='play' onClick={this.onClickTaskType}>play</button>
                <button className={!this.state.focusMode ? 'button is-outlined btn-tasks btn-learn' : 'button is-outlined btn-tasks btn-learn hide'} 
                data-type='learn' onClick={this.onClickTaskType}>learn</button>
                <button className={!this.state.focusMode ? 'button is-outlined btn-tasks btn-break' : 'button is-outlined btn-tasks btn-break hide'} 
                data-type='break' onClick={this.onClickTaskType}>break</button>
                <div className={this.state.focusMode ? 'focus-controls' : 'hide'}>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <span onClick={this.stopTimer} className='icon stop'><i className='ion-ionic ion-md-close'></i></span>
                    <span className='is-size-5 has-text-weight-bold grey-text'>Press "Esc" to stop</span>
                  </div>
                  <div className='is-size-5 has-text-weight-bold grey-text' style={{display: 'flex', alignItems: 'center'}}>
                    { '#' + this.state.mode }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer className='footer'>
          <div className='content' style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
            <div>
              Copyright {new Date().getFullYear()} Godspeed. All rights reserverd.
            </div>
            <div className={this.state.focusMode ? 'has-text-weight-bold is-size-5 invisible' : 'has-text-weight-bold is-size-5'} style={{width: '240px'}}>
              <div>{this.state.slider} minutes</div>
              <Slider onChange={this.onChangeSliderValue} val={this.state.slider} min='5' max='90' step='1' />
            </div>
            <div>
              <button onClick={this.toggleTheme} className='button btn-circle theme' style={{ marginRight: '1rem' }}></button>
              <a className={this.state.focusMode ? 'icon button theme hide' : 'icon button theme'} href='#' style={{color: '#ffffff', backgroundColor: '#212529'}}>
                <i className='ion-ionic ion-md-help'></i>
              </a>
            </div>
          </div>
        </footer>
      </div>
    )
  }
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
  startTime.setHours(0)
  startTime.setMinutes(0)
  startTime.setSeconds(0)
  startTime.setMilliseconds(0)
  startTime.setSeconds(props.task.start);
  
  const endTime = new Date()
  endTime.setHours(0)
  endTime.setMinutes(0)
  endTime.setSeconds(0)
  endTime.setMilliseconds(0)
  endTime.setSeconds(props.task.start + props.task.length)

  return (
    <g>
      <rect x='0' y='0' width='86400' fill={props.task.color} height='2320' />
      {props.marker}
      <text x='864' y='1560' fontSize='1160' fill='#ffffff'>{startTime.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric'})}</text>
      <text x='81300' y='1560' fontSize='1160' fill='#ffffff'>{endTime.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric'})}</text>
    </g>
  )
}

const taskKey = (date) => {
  return date.toISOString().slice(0, 10).replace(/-/g, '')
}

export default App