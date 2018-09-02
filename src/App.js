import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
// import { select, path } from 'd3';
import 'bulma-slider/dist/js/bulma-slider';

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
      slider: 0,
    };
    this.addTask = this.addTask.bind(this);
    this.onChangeSliderValue = this.onChangeSliderValue.bind(this);
  }

  addTask() {
    this.setState({
      tasks: [...this.state.tasks, {length: '25', start: this.state.currentTaskEnd === 0 ? this.state.markerX : this.state.currentTaskEnd }],
      currentTaskEnd: this.state.currentTaskEnd === 0 ? this.state.markerX + 25 : this.state.currentTaskEnd + 25,
    });
  }

  onChangeSliderValue(e) {
    this.setState({
      slider: e.target.value
    });
  }

  componentDidMount() {
    const currentDateTime = new Date();
    const hours = currentDateTime.getHours();
    const minutes = currentDateTime.getMinutes();
    const seconds = currentDateTime.getSeconds();
    const total = ((hours * 60 * 60) + (minutes * 60) + seconds) / 100;

    console.log(total);

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
          <div className='navbar-brand'>
            <a className='navbar-item' href='https://bulma.io'>
              <img src='https://via.placeholder.com/40x40' alt='' width='40' height='40' />
              <div>Legato</div>
            </a>
          </div>
          <div id="navbarExampleTransparentExample" className="navbar-menu">
            <div className='navbar-start'>
            </div>
            <div style={{margin: 'auto', display: 'flex', alignItems: 'strect'}}>
              <div>4,999 online users</div>
            </div>
            <div className='navbar-end'>
              <div className='navbar-item'>
                <div className='field is-grouped'>
                  <p className='control'>
                    <a className='button' href="#">Login</a>
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
              <div className='column is-12 is-size-3'>
                You have {this.state.remainingHours} hours, {this.state.remainingMins} minutes. Enjoy the day.
              </div>
              <div className='column is-12'>
                <svg viewBox='0 0 864 30'>
                  <TimeBar />
                  {/* <text x='0' y={27} fontFamily='sans-serif' fontSize='5px'>12AM</text> */}
                  {/* <text x={864 / 2} y={27} fontFamily='sans-serif' fontSize='5px'>12PM</text> */}
                  {/* <rect x={this.state.markerX + 0.01} y='1.5' width={864 - this.state.markerX + 0.01 } height='20' fill='white' /> */}
                  {this.state.tasks.map((task, index) => <TaskBar key={index} length={task.length} start={task.start} />)}
                  <rect x={this.state.markerX} y='2.5' width='0.75' height='25' fill='#212529' />
                </svg>
              </div>
              <div className='column is-12'>
                <button className='button is-outlined' onClick={this.addTask}>#work</button>
                <button className='button is-outlined' onClick={this.addTask}>#play</button>
                <button className='button is-outlined' onClick={this.addTask}>#break</button>
                <button className='button is-outlined' onClick={this.addTask}>+</button>
              </div>
            </div>
          </div>
        </section>
        <footer className='footer'>
          <div className='content' style={{display: 'flex', justifyContent: 'space-between'}}>
            <div>
              Copyright {new Date().getFullYear()} <strong>Godspeed</strong>. All rights reserverd.
            </div>
            <div style={{width: '240px'}}>
              <input onChange={this.onChangeSliderValue} className="slider is-fullwidth is-circle" step="1" min="0" max="100" value={this.state.slider} type="range" style={{margin: '0'}} />
            </div>
            <div>
              <button className='button btn-circle'></button>
              <span className="icon">
                <i className='ion-ionic ion-help'></i>
              </span>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

const TaskBar = (props) => {
  return (
    <rect x={props.start} y='5' width={props.length} height='20' fill='#212529' style={{fillOpacity: '.38'}} />
  );
}

const TimeBar = (props) => {
  return (
    <rect x='0' y='5' width='864' height='20' fill='#212529' style={{fillOpacity: '.16'}} />
  );
}

export default App;
