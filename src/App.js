import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
// import { select, path } from 'd3';

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
    };
    this.addTask = this.addTask.bind(this);
  }

  addTask() {
    this.setState({
      tasks: [...this.state.tasks, {length: '25', start: this.state.currentTaskEnd === 0 ? this.state.markerX : this.state.currentTaskEnd }],
      currentTaskEnd: this.state.currentTaskEnd === 0 ? this.state.markerX + 25 : this.state.currentTaskEnd + 25,
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
      remainingSec: 60 - seconds,
    });

    setInterval(() => {
      this.setState((prevState) => {
        console.log(prevState.markerX + 0.01 );

        const currentDateTime = new Date();
        const hours = currentDateTime.getHours();
        const minutes = currentDateTime.getMinutes();
        const seconds = currentDateTime.getSeconds();

        return { 
          markerX: prevState.markerX + 0.01,
          remainingHours: 23 - hours,
          remainingMins: 60 - minutes,
          remainingSec: 60 - seconds,
        };
      });
    }, 1000);
  }

  render() {
    return (
      <div>
        <nav className='navbar is-fixed-top' role='navigation' aria-label='main navigation'>
          <div className='navbar-brand'>
            <a className='navbar-item' href='https://bulma.io'>
              <img src='' alt='' width='112' height='28' />
              Legato
            </a>

            <a role='button' className='navbar-burger' aria-label='menu' aria-expanded='false'>
              <span aria-hidden='true'></span>
              <span aria-hidden='true'></span>
              <span aria-hidden='true'></span>
            </a>
          </div>
          <div className='navbar-end'>
            <div className='navbar-item'>
              <div className='field is-grouped'>
                <p className='control'>
                  <a className='button is-link' href="#">Login</a>
                </p>
                <p className='control'>
                  <a className='button is-primary' href='https://github.com/jgthms/bulma/releases/download/0.7.1/bulma-0.7.1.zip'>
                    Create a free account
                  </a>
                </p>
              </div>
            </div>
          </div>
        </nav>
        <section className='section'>
          <div className='columns is-vcentered'>
            <div className='column is-12'>
              You have {this.state.remainingHours} hours, {this.state.remainingMins} minutes, {this.state.remainingSec} seconds 
            </div>
          </div>
            <div className='column is-12'>
              <svg viewBox='0 0 864 15'>
                <TimeBar />
                {/* <text x='0' y={27} fontFamily='sans-serif' fontSize='5px'>12AM</text> */}
                {/* <text x={864 / 2} y={27} fontFamily='sans-serif' fontSize='5px'>12PM</text> */}
                <rect x={this.state.markerX + 0.01} y='1.5' width={864 - this.state.markerX + 0.01 } height='20' fill='white' />
                {this.state.tasks.map((task, index) => <TaskBar key={index} length={task.length} start={task.start} />)}
                <rect x={this.state.markerX} y='1.5' width='0.5' height='20' fill='red' />
              </svg>
            </div>
            <div className='column is-12'>
              <button onClick={this.addTask}>#work</button>
              <button onClick={this.addTask}>#play</button>
              <button onClick={this.addTask}>#break</button>
              <button onClick={this.addTask}>+</button>
            </div>
          </div>
        </section>
        <footer className='footer'>
          <div className='content has-text-centered'>
            <p>
              Copyright {new Date().getFullYear()} <strong>Godspeed</strong>. All rights reserverd.
            </p>
          </div>
        </footer>
      </div>
    );
  }
}

const TaskBar = (props) => {
  return (
    <rect x={props.start} y='1.5' width={props.length} height='20' fill='blue' />
  );
}

const TimeBar = (props) => {
  return (
    <rect x='0' y='1.5' width='864' height='20' fill='#e4e4e4' />
  );
}

export default App;
