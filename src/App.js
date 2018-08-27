import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { select, path } from 'd3';

class App extends Component {
  constructor() {
    super();
    this.state = {
      markerX: 0,
    }
  }

  componentDidMount() {
    const currentDateTime = new Date().toLocaleTimeString('en-US', { hour12: false });
    setInterval(() => {
      this.setState((prevState) => {
        return {markerX: prevState.markerX ++}
      });
    }, 1000);
  }

  render() {
    // const container = select('#root').append('svg').attr('viewBox', '0 0 100 100').attr('preserveAspectRatio', 'xMidyMid meet');
    // const rect = container.append('rect').attr('x', '0').attr('y', '0.5').attr('width', '100').attr('height', '2').attr('fill', '#e4e4e4');
    // const task1 = container.append('rect').attr('x', '24').attr('y', '0.5').attr('width', '20').attr('height', '2').attr('fill', 'blue');
    // container.append('rect').attr('ref', ).attr('fill', 'red').attr('x', '50').attr('y', '0').attr('height', '3').attr('width', '0.05');
    return (
      <svg viewBox='0 0 100 100'>
        <rect x='0' y='0.5' width='86400' height='2' fill='#e4e4e4' />
        <rect x={this.state.markerX} y='0' width='0.05' height='3' fill='red' />
      </svg>
    );
  }
}

export default App;
