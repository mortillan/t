import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
// import { select, path } from 'd3';
import 'bulma-slider/dist/js/bulma-slider';
import Slider from './component/Slider';

class App extends Component {
  constructor() {
    super();
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
    };
    this.onChangeSliderValue = this.onChangeSliderValue.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.startTime = this.startTime.bind(this);
    this.toggleTheme = this.toggleTheme.bind(this);
  }

  startTime(e) {
    const { target } = e;

    const { type }  = target.dataset;

    let color;

    switch(type) {
      case 'work':
        color = '#339AF0';
        break;
      case 'play':
        color = '#FCC419';
        break;
      case 'learn':
        color = '#51CF66';
        break;
      default:
      case 'break':
        color ='#FA5252';
        break;
    }

    const length = (this.state.slider * 60);

    //create timer for task
    const intervalId = setInterval(() => {
      if(this.state.currentTask.remainingSec <= 0){
        return clearInterval(this.state.taskTimer);
      }

      const sec = this.state.currentTask.remainingSec - 1;
      
      this.setState({
        currentTask: {
          ...this.state.currentTask,
          remainingSec: sec,
        }
      });
      document.title = `${Math.trunc(sec / 60)}`.padStart(2, '0') + ':' + `${sec % 60}`.padStart(2, '0');
    }, 1000);

    //save task to state
    const newTask = {
      length: length, 
      start: this.state.markerX,
      color: color,
      type: type,
      remainingSec: length,
    };

    const { tasksLog } = this.state;
    const key = taskKey(new Date());
    if(!tasksLog[key]){
      tasksLog[key] = [];
    }
    tasksLog[key].push(newTask);

    this.setState({
      currentTask: newTask,
      currentTaskEnd: this.state.currentTaskEnd === 0 ? this.state.markerX + length : this.state.currentTaskEnd + length,
      focusMode: !this.state.focusMode,
      mode: type,
      taskTimer: intervalId,
      tasksLog: tasksLog,
    });

    localStorage.setItem('logs', JSON.stringify(this.state.tasksLog));
  }

  stopTimer() {
    const { focusMode, taskTimer } = this.state;

    if(focusMode) {
      clearInterval(taskTimer);

      //TODO stop current task on current time
      this.setState({
        focusMode: !focusMode,
        currentTask: null,
        taskTimer: null,
      });

      document.title = 'Laegato';
    }
  }

  handleKeyPress(e) {
    const { key } = e;

    if(key === 'Escape') {
      this.stopTimer();
    }
  }

  onChangeSliderValue(e) {
    this.setState({
      slider: e.target.value
    });
  }

  toggleTheme() {
    const { nightMode } = this.state;

    if(nightMode) {
      document.body.classList.remove('dark');
    } else {
      document.body.classList.add('dark');
    }

    this.setState({nightMode: !nightMode});
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);

    const currentDateTime = new Date();
    const hours = currentDateTime.getHours();
    const minutes = currentDateTime.getMinutes();
    const seconds = currentDateTime.getSeconds();
    const total = ((hours * 60 * 60) + (minutes * 60) + seconds);

    // console.log(total);

    this.setState({
      markerX: total,
      remainingHours: 23 - hours,
      remainingMins: 59 - minutes,
    });

    setInterval(() => {
      this.setState((prevState) => {
        const currentDateTime = new Date();
        const hours = currentDateTime.getHours();
        const minutes = currentDateTime.getMinutes();

        if(prevState.markerX + 1 > 86400) {
          return { 
            markerX: 0,
            remainingHours: 23 - hours,
            remainingMins: 60 - minutes,
          }
        }

        //console.log(prevState.markerX + 0.01);

        return { 
          markerX: prevState.markerX + 1,
          remainingHours: 23 - hours,
          remainingMins: 60 - minutes,
        }
      });
    }, 1000);
  }

  render() {
    const { tasksLog } = this.state;
    const key = taskKey(new Date());
    const tasksToday = tasksLog[key] || null;

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
                    <a className='button is-outlined' href='#'>
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
                You have {this.state.remainingHours} hours, {this.state.remainingMins} minutes. Enjoy the day.
                </h1>
                {this.state.currentTask && 
                <h1 className={this.state.focusMode ? 'is-size-2 has-text-weight-bold' : 'is-size-2 has-text-weight-bold hide'}>
                You have {`${Math.trunc(this.state.currentTask.remainingSec / 60)}`.padStart(2, '0')} minutes {`${this.state.currentTask.remainingSec % 60}`.padStart(2, '0')} seconds to #{this.state.mode}</h1>}
              </div>
              <div className='column is-12'>
                <svg width='100%' height='40' viewBox='0 0 86400 2320' preserveAspectRatio='none'>
                  <TimeBar />
                  {tasksToday && 
                    tasksToday.map(task => <TaskBar length={task.length} fill={task.color} start={task.start} />)}
                  <Marker x={this.state.markerX} />
                  {this.state.currentTask && 
                    // <TaskBar length={this.state.currentTask.length} fill={this.state.currentTask.color} start={this.state.currentTask.start} />
                    // <g>
                    //   <rect x='0' y='0' width='86400' fill={this.state.currentTask.color} height='2320' />
                    //   <Marker x={86400 - ((86400 / 300) * this.state.currentTask.remainingSec)} />
                    //   <text x='0' y='1460' font-size='1160' fill='#ffffff'>12:58am</text>
                    //   <text x='81600' y='1460' font-size='1160' fill='#ffffff'>02:58am</text>
                    // </g>
                    <CountBar fill={this.state.currentTask.color} 
                    marker={<Marker x={(this.state.currentTask.length - this.state.currentTask.remainingSec) * (86400 / this.state.currentTask.length)} />} />}
                </svg>
              </div>
              <div className='column is-12' style={{ minHeight: '75px'}}>              
                <button className={!this.state.focusMode ? 'button is-outlined btn-tasks btn-work' : 'button is-outlined btn-tasks btn-work hide'} 
                data-type='work' onClick={this.startTime}>#work</button>
                <button className={!this.state.focusMode ? 'button is-outlined btn-tasks btn-play' : 'button is-outlined btn-tasks btn-play hide'} 
                data-type='play' onClick={this.startTime}>#play</button>
                <button className={!this.state.focusMode ? 'button is-outlined btn-tasks btn-learn' : 'button is-outlined btn-tasks btn-learn hide'} 
                data-type='learn' onClick={this.startTime}>#learn</button>
                <button className={!this.state.focusMode ? 'button is-outlined btn-tasks btn-break' : 'button is-outlined btn-tasks btn-break hide'} 
                data-type='break' onClick={this.startTime}>#break</button>
                <div className={this.state.focusMode ? 'focus-controls' : 'hide'}>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <span onClick={this.stopTimer} className='icon stop'><i className='ion-ionic ion-md-close'></i></span>
                    <span className='is-size-5 has-text-weight-bold' style={{ color: '#000000', opacity: '0.54' }}>Press "Esc" to stop</span>
                  </div>
                  <div className='is-size-5 has-text-weight-bold' style={{display: 'flex', alignItems: 'center', color: '#000000', opacity: '0.54'}}>
                    { '#' + this.state.mode }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer className={this.state.focusMode ? 'footer invisible' : 'footer'}>
          <div className='content' style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
            <div>
              Copyright {new Date().getFullYear()} <strong>Godspeed</strong>. All rights reserverd.
            </div>
            <div className='has-text-weight-bold is-size-5' style={{width: '240px'}}>
              <div>{this.state.slider} minutes</div>
              <Slider onChange={this.onChangeSliderValue} val={this.state.slider} min='5' max='90' step='1' />
            </div>
            <div>
              <button onClick={this.toggleTheme} className='button btn-circle' style={{ marginRight: '1rem' }}></button>
              <a className="icon button" href='#' style={{color: '#ffffff', backgroundColor: '#212529'}}>
                <i className='ion-ionic ion-md-help'></i>
              </a>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

const TaskBar = (props) => {
  return (
    <rect x={props.start} y='0' width={props.length} height='2320' fill={props.fill} />
  );
}

const TimeBar = (props) => {
  return (
    <rect x='0' y='0' width='86400' height='2320' fill='#212529' fill-opacity='.16' />
  );
}

const Marker = (props) => {
  return (
    <rect x={props.x} y='0' width='100' height='2320' fill='#212529' />
  );
}

const CountBar = (props) => {
  return (
    <g>
      <rect x='0' y='0' width='86400' fill={props.fill} height='2320' />
      {props.marker}
      <text x='0' y='1460' font-size='1160' fill='#ffffff'>12:58am</text>
      <text x='81600' y='1460' font-size='1160' fill='#ffffff'>02:58am</text>
    </g>
  );
}

const taskKey = (date) => {
  return date.toISOString().slice(0, 10).replace(/-/g, '');
}

export default App;