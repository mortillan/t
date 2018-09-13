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
      tasks: [],
      currentTask: null,
      currentTaskEnd: 0,
      slider: 5,
      focuseMode: false,
      mode: '',
      taskTimer: null,
    };
    this.onChangeSliderValue = this.onChangeSliderValue.bind(this);
    this.onClickStopFocusMode = this.onClickStopFocusMode.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.startTime = this.startTime.bind(this);
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

    const length = (this.state.slider * 60) / 100;

    const intervalId = setInterval(() => {
      this.setState({
        currentTask: {
          ...this.state.currentTask,
          remainingSec: this.state.currentTask.remainingSec - 1
        }
      });
    }, 1000);

    this.setState({
      currentTask: {
        length: length, 
        start: this.state.markerX,
        color: color,
        type: type,
        remainingSec: this.state.slider * 60,
      },
      currentTaskEnd: this.state.currentTaskEnd === 0 ? this.state.markerX + length : this.state.currentTaskEnd + length,
      focuseMode: !this.state.focuseMode,
      mode: type,
      taskTimer: intervalId,
    });
  }

  onClickStopFocusMode() {
    if(this.state.focuseMode) {
      clearInterval(this.state.taskTimer);

      //TODO stop current task on curren time
      this.setState({
        focuseMode: !this.state.focuseMode,
        currentTask: null,
        taskTimer: null,
      });
    }
  }

  handleKeyPress(e) {
    const { key } = e;

    if(key === 'Escape') {
      this.onClickStopFocusMode();
    }
  }

  onChangeSliderValue(e) {
    this.setState({
      slider: e.target.value
    });
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);

    const currentDateTime = new Date();
    const hours = currentDateTime.getHours();
    const minutes = currentDateTime.getMinutes();
    const seconds = currentDateTime.getSeconds();
    const total = ((hours * 60 * 60) + (minutes * 60) + seconds) / 100;

    // console.log(total);

    this.setState({
      markerX: total,
      remainingHours: 23 - hours,
      remainingMins: 59 - minutes,
    });

    setInterval(() => {
      this.setState((prevState) => {
        if(prevState.currentTask &&  prevState.markerX >= prevState.currentTask.start + prevState.currentTask.length) {
          this.onClickStopFocusMode();
        }

        const currentDateTime = new Date();
        const hours = currentDateTime.getHours();
        const minutes = currentDateTime.getMinutes();

        if(prevState.markerX + 0.01 > 864) {
          return { 
            markerX: 0,
            remainingHours: 23 - hours,
            remainingMins: 60 - minutes,
          }
        }

        //console.log(prevState.markerX + 0.01);

        return { 
          markerX: prevState.markerX + 0.01,
          remainingHours: 23 - hours,
          remainingMins: 60 - minutes,
        }
      });
    }, 1000);
  }

  render() {
    return (
      <div className='vfull'>
        <nav className='navbar is-fixed-top' role='navigation' aria-label='main navigation'>
          <div className={this.state.focuseMode ? 'navbar-brand invisible' : 'navbar-brand'}>
            <a className='navbar-item' href='https://bulma.io'>
              <img src='/img/logo-laegato.png' alt='' width='110' />
            </a>
            {/* <span className='is-size-4 has-text-weight-bold' style={{margin: 'auto'}}>Laegato</span> */}
          </div>
          <div className="navbar-menu">
            <div className={this.state.focuseMode ? 'navbar-start invisible' : 'navbar-start'}>
            </div>
            <div style={{margin: 'auto', display: 'flex', alignItems: 'strect'}}>
              {/* <div>4,999 online users</div> */}
            </div>
            <div className={this.state.focuseMode ? 'navbar-end invisible' : 'navbar-end'}>
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
                <h1 className={!this.state.focuseMode ? 'is-size-2 has-text-weight-bold' : 'is-size-2 has-text-weight-bold hide'}>You have {this.state.remainingHours} hours, {this.state.remainingMins} minutes. Enjoy the day.</h1>
                {this.state.currentTask && <h1 className={this.state.focuseMode ? 'is-size-2 has-text-weight-bold' : 'is-size-2 has-text-weight-bold hide'}>You have {Math.trunc(this.state.currentTask.remainingSec / 60)}  minutes {this.state.currentTask.remainingSec % 60} seconds to #{this.state.mode}</h1>}
              </div>
              <div className='column is-12'>
                <svg viewBox='0 0 864 30'>
                  <TimeBar />
                  {this.state.currentTask ? <TaskBar length={this.state.currentTask.length} fill={this.state.currentTask.color} start={this.state.currentTask.start} /> : null}
                  <rect x={this.state.markerX} y='1' width='0.75' height='30' fill='#212529' />
                </svg>
              </div>
              <div className='column is-12' style={{ minHeight: '75px'}}>              
                <button className={!this.state.focuseMode ? 'button is-outlined btn-tasks btn-work' : 'button is-outlined btn-tasks btn-work hide'} 
                data-type='work' onClick={this.startTime}>#work</button>
                <button className={!this.state.focuseMode ? 'button is-outlined btn-tasks btn-play' : 'button is-outlined btn-tasks btn-play hide'} 
                data-type='play' onClick={this.startTime}>#play</button>
                <button className={!this.state.focuseMode ? 'button is-outlined btn-tasks btn-learn' : 'button is-outlined btn-tasks btn-learn hide'} 
                data-type='learn' onClick={this.startTime}>#learn</button>
                <button className={!this.state.focuseMode ? 'button is-outlined btn-tasks btn-break' : 'button is-outlined btn-tasks btn-break hide'} 
                data-type='break' onClick={this.startTime}>#break</button>
                <div className={this.state.focuseMode ? 'focus-controls' : 'hide'}>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <span onClick={this.onClickStopFocusMode} className='icon stop'><i className='ion-ionic ion-md-close'></i></span>
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
        <footer className={this.state.focuseMode ? 'footer invisible' : 'footer'}>
          <div className='content' style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
            <div>
              Copyright {new Date().getFullYear()} <strong>Godspeed</strong>. All rights reserverd.
            </div>
            <div className='has-text-weight-bold is-size-5' style={{width: '240px'}}>
              <div>{this.state.slider} minutes</div>
              {/* <Slider onChange={this.onChangeSliderValue} slider={this.state.slider} min='5' max='90' /> */}
              <input className='slider is-fullwidth' onChange={this.onChangeSliderValue} slider={this.state.slider} min='5' max='90' step='1' type='range' />
            </div>
            <div>
              <button className='button btn-circle' style={{ marginRight: '1rem' }}></button>
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
    <rect x={props.start} y='5' width={props.length} height='20' fill={props.fill} />
  );
}

const TimeBar = (props) => {
  return (
    <rect x='0' y='5' width='864' height='20' fill='#212529' style={{fillOpacity: '.16'}} />
  );
}



export default App;
