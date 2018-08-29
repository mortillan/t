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
    };
    this.addTask = this.addTask.bind(this);
  }

  addTask() {
    this.setState({tasks: [...this.state.tasks, {length: '25', start: this.state.markerX}]});
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
        console.log(prevState.markerX + 0.1 );
        return { markerX: prevState.markerX + 0.1 };
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
          <rect x={this.state.markerX} y='1.5' width='1' height='20' fill='red' />
          <rect x={this.state.markerX + 0.1} y='1.5' width={864 - this.state.markerX + 0.1 } height='20' fill='white' />
          {this.state.tasks.map(task => <TaskBar length={task.length} start={task.start} />)}
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
