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
      currentTaskEnd: 0,
      slider: 5,
      focuseMode: false,
    };
    this.addTask = this.addTask.bind(this);
    this.onChangeSliderValue = this.onChangeSliderValue.bind(this);
  }

  addTask(e) {
    const { target } = e;

    const { type }  = target.dataset;

    let color;

    switch(type) {
      case 'work':
        color = 'red';
        break;
      case 'play':
        color = 'blue';
        break;
      default:
      case 'break':
        color ='gray';
        break;
    }

    const length = (this.state.slider * 60) / 100;

    this.setState({
      tasks: [...this.state.tasks, {
        length: length, 
        start: this.state.currentTaskEnd === 0 ? this.state.markerX : this.state.currentTaskEnd,
        color: color,
        type: type,
      }],
      currentTaskEnd: this.state.currentTaskEnd === 0 ? this.state.markerX + length : this.state.currentTaskEnd + length,
      focuseMode: !this.state.focuseMode,
    });
  }

  onChangeSliderValue(e) {
    this.setState({
      slider: e.target.value
    });
  }

  componentDidMount() {
    document.addEventListener('keydown', event => {
      if(this.state.focuseMode) {
        //TODO stop current task on curren time
        this.setState({
          focuseMode: !this.state.focuseMode,
        });
      }
    });

    const currentDateTime = new Date();
    const hours = currentDateTime.getHours();
    const minutes = currentDateTime.getMinutes();
    const seconds = currentDateTime.getSeconds();
    const total = ((hours * 60 * 60) + (minutes * 60) + seconds) / 100;

    // console.log(total);

    this.setState({
      markerX: total,
      remainingHours: 23 - hours,
      remainingMins: 60 - minutes,
    });

    setInterval(() => {
      this.setState((prevState) => {
        const currentDateTime = new Date();
        const hours = currentDateTime.getHours();
        const minutes = currentDateTime.getMinutes();

        if(prevState.markerX + 0.01 > 864) {
          return { 
            markerX: 0,
            remainingHours: 23 - hours,
            remainingMins: 60 - minutes,
          };  
        }

        console.log(prevState.markerX + 0.01);

        return { 
          markerX: prevState.markerX + 0.01,
          remainingHours: 23 - hours,
          remainingMins: 60 - minutes,
        };
      });
    }, 1000);
  }

  render() {
    return (
      <div className='vfull'>
        <nav className='navbar is-fixed-top' role='navigation' aria-label='main navigation'>
          <div className={this.state.focuseMode ? 'navbar-brand invisible' : 'navbar-brand'}>
            <a className='navbar-item' href='https://bulma.io'>
              <img src='https://via.placeholder.com/40x40' alt='' width='40' height='40' />
              <div>Legato</div>
            </a>
          </div>
          <div className="navbar-menu">
            <div className={this.state.focuseMode ? 'navbar-start invisible' : 'navbar-start'}>
            </div>
            <div style={{margin: 'auto', display: 'flex', alignItems: 'strect'}}>
              <div>4,999 online users</div>
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
              <div className='column is-12 is-size-2'>
                You have {this.state.remainingHours} hours, {this.state.remainingMins} minutes. Enjoy the day.
              </div>
              <div className='column is-12'>
                <svg viewBox='0 0 864 30'>
                  <TimeBar />
                  {/* <text x='0' y={27} fontFamily='sans-serif' fontSize='5px'>12AM</text> */}
                  {/* <text x={864 / 2} y={27} fontFamily='sans-serif' fontSize='5px'>12PM</text> */}
                  {/* <rect x={this.state.markerX + 0.01} y='1.5' width={864 - this.state.markerX + 0.01 } height='20' fill='white' /> */}
                  {this.state.tasks.map((task, index) => <TaskBar key={index} length={task.length} fill={task.color} start={task.start} />)}
                  <rect x={this.state.markerX} y='2.5' width='0.75' height='25' fill='#212529' />
                </svg>
              </div>
              <div className='column is-12'>              
                <button className={!this.state.focuseMode ? 'button is-outlined btn-tasks' : 'button is-outlined btn-tasks hide'} data-type='work' onClick={this.addTask}>#work</button>
                <button className={!this.state.focuseMode ? 'button is-outlined btn-tasks' : 'button is-outlined btn-tasks hide'} data-type='play' onClick={this.addTask}>#play</button>
                <button className={!this.state.focuseMode ? 'button is-outlined btn-tasks' : 'button is-outlined btn-tasks hide'} data-type='break' onClick={this.addTask}>#break</button>
                <div className={this.state.focuseMode ? '' : 'hide'}>
                  <span className='icon'><i className='ion-ionic ion-md-close'></i></span>Press "Esc" to stop
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
            <div style={{width: '240px'}}>
              <div>{this.state.slider} minutes</div>
              <Slider onChange={this.onChangeSliderValue} slider={this.state.slider} min='5' max='90' />
            </div>
            <div>
              <button className='button btn-circle'></button>
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
