import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { select, path } from 'd3';

class App extends Component {
  render() {
    const container = select('#root').append('svg').attr('viewBox', '0 0 100 100').attr('preserveAspectRatio', 'xMidYMid meet');
    const rect = container.append('rect').attr('x', 0).attr('y', 0).attr('width', '100').attr('height', '2').attr('fill', '#e4e4e4');
    return (
      <div>

      </div>
    );
  }
}

export default App;
