import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
jest.useFakeTimers();

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('App', () => {

  it('componentDidMount', () => {
    const wrapper = shallow(<App />)

    wrapper.instance().componentDidMount();
    wrapper.setState({ markerX: 86399 });

    let dateTomorrow = new Date();
    dateTomorrow.setDate(dateTomorrow.getDate() + 1);
    jest.runTimersToTime(1000);

    expect(wrapper.state('markerX')).toBe(0);
    expect(wrapper.state('taskKey')).toBe(dateTomorrow.toISOString().slice(0, 10).replace(/-/g, ''));
  });
});