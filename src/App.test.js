import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import moment from 'moment';

Enzyme.configure({ adapter: new Adapter() });
jest.useFakeTimers();

describe('App', () => {

  it('componentDidMount', () => {
    const now = new Date();
    now.setHours(23, 59, 59);
    
    global.Date = jest.fn(() => now);

    const wrapper = shallow(<App />)

    wrapper.instance().componentDidMount();
    //wrapper.setState({ markerX: 86399 });
    console.log(new Date());
    // let dateTomorrow = new Date();
    // dateTomorrow.setDate(dateTomorrow.getDate() + 1);
    jest.runTimersToTime(1000);

    //expect(wrapper.state('markerX')).toBe(0);
    console.log(new Date());
    // expect(wrapper.state('taskKey')).toBe(dateTomorrow.toISOString().slice(0, 10).replace(/-/g, ''));
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

});