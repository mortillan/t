import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { select, path } from 'd3';

class App extends Component {
  constructor() {
    super();
    this.state = {
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

    this.setState({markerX: total});

    setInterval(() => {
      this.setState((prevState) => {
        console.log(prevState.markerX + 0.01 );
        return { markerX: prevState.markerX + 0.01 };
      });
    }, 1000);
  }

  render() {
    return (
      <div>
        <svg viewBox='0 0 864 100'>
          <rect x='0' y='1.5' width='864' height='20' fill='#e4e4e4' />
          <text x='0' y={27} fontFamily="sans-serif" fontSize='5px'>12AM</text>
          <text x={864 / 2} y={27} fontFamily="sans-serif" fontSize='5px'>12PM</text>
          <rect x={this.state.markerX + 0.01} y='1.5' width={864 - this.state.markerX + 0.01 } height='20' fill='white' />
          {this.state.tasks.map((task, index) => <TaskBar key={index} length={task.length} start={task.start} />)}
          <rect x={this.state.markerX} y='0' width='0.5' height='25' fill='red' />
        </svg>
        <button onClick={this.addTask}>Add Task</button>
      </div>
    );
  }
}

const TaskBar = (props) => {
  return <rect x={props.start} y='1.5' width={props.length} height='20' fill='blue' />
}

export default App;
