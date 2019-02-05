import React from 'react'
import ReactDOM from 'react-dom'
import Timer from '../Timer'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { log, taskKey } from '../../lib/common'
import { BrowserRouter } from 'react-router-dom'
import { GlobalContext } from '../../lib/context'
import moment from 'moment'
import { TASK_KEY_FORMAT } from '../../lib/constants'

Enzyme.configure({ adapter: new Adapter() })
jest.useFakeTimers()

const realDate = Date

beforeAll(() => {
  //bind real Date global to Date inside describe
  //seems like describe functions are not bound to global scope
  global.Date = realDate
  //Worker API are mocked by jest w/o terminate
  Worker.prototype.terminate = jest.fn()
})

afterAll(() => {

})

describe('Timer', () => {

  it('componentDidMount', () => {
    const wrapper = shallow(<Timer />)
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const seconds = now.getSeconds()

    expect(wrapper.state('tick')).toBe(((hours * 60 * 60) + (minutes * 60) + seconds))
  })

  it('calculates remaining time', () => {
    const wrapper = shallow(<Timer />)

    wrapper.instance().onTimer({
      data: {
        timestamp: Date.now(),
        hrs: 21,
        min: 30,
        sec: 0,
        ms: 0,
      }
    })

    expect(wrapper.state('tickHours')).toBe(23 - 21)
  })

  // it('creates timer thread for task')

  it('timebar changes after midnight', () => {
    const wrapper = shallow(<Timer />)

    wrapper.instance().onTimer({
      data: {
        timestamp: 1514822399000, //Jan 01 2018 23:59:59
        hrs: 23,
        min: 59,
        sec: 59,
        ms: 0,
      }
    })
    expect(wrapper.state('taskKey')).toBe('20180101')

    
    wrapper.instance().onTimer({
      data: {
        timestamp: 1514822400000, //Jan 02 2018 00:00:09
        hrs: 0,
        min: 0,
        sec: 0,
        ms: 0,
      }
    })
    expect(wrapper.state('taskKey')).toBe('20180102')
  })

  it('time overflow to next day', () => {
    const wrapper = shallow(<Timer />)
    const now = moment()
    const key = now.format(TASK_KEY_FORMAT)
    
    wrapper.instance().onTimer({
      data: {
        timestamp: now.valueOf(),
        hrs: 23,
        min: 55,
        sec: 0,
        ms: 0,
      }
    })

    wrapper.setState({
      slider: 10
    })
    // log(wrapper.state())
    wrapper.instance().startTimer()
    // log(wrapper.state())

    let { currentTask, taskKey: tKey } = wrapper.state()
    expect(currentTask.start).toBe(86100)
    expect(currentTask.end).toBe(86700)
    expect(currentTask).toBeDefined()
    expect(currentTask).toBeInstanceOf(Object)
    expect(tKey).toBe(key)

    wrapper.instance().onTimer({
      data: {
        timestamp: now.valueOf(),
        hrs: 0,
        min: 5,
        sec: 0,
        ms: 0,
      }
    })
    
    wrapper.instance().stopTimer()
    // log(wrapper.state())
    expect(wrapper.state().currentTask).toBeNull()
    expect(wrapper.state().tasksLog).toHaveProperty(key)
    const tomorrow = now.add(1, 'd')
    // dt.setTime(ts +  86400000)
    // const overflowKey = taskKey(new Date(dt.getTime()))
    const overflowKey = tomorrow.format(TASK_KEY_FORMAT)
    expect(wrapper.state().tasksLog).toHaveProperty(overflowKey)
    expect(wrapper.state().focusMode).toBe(false)
    expect(wrapper.state().tasksLog[overflowKey][0].start).toBe(0)
    expect(wrapper.state().tasksLog[overflowKey][0].end).toBe(5 * 60)
    expect(wrapper.state().tasksLog[overflowKey][0].length).toBe(5 * 60)
  })

  it('startTimer creates task', () => {
    const wrapper = shallow(<Timer />)

    wrapper.instance().startTimer()
    expect(wrapper.state().currentTask).toHaveProperty('key')
  })

  it('stops timer when time elapsed greater than length', () => {
    const wrapper = shallow(<Timer />)
    const now = moment()
    const key = now.format(TASK_KEY_FORMAT)

    //set to 10minutes length
    wrapper.setState({
      slider: 10
    })

    wrapper.instance().startTimer()

    const mockDate = moment().add(15, 'minutes').utc().unix();
    console.log(new Date(mockDate * 1000))
    //updateCurrentTak
    
    wrapper.instance().onTimer({
      data: {
        timestamp: now.valueOf(),
        hrs: 23,
        min: 55,
        sec: 0,
        ms: 0,
      }
    })

    wrapper.setState({
      slider: 10
    })
    // log(wrapper.state())
    wrapper.instance().startTimer()
    // log(wrapper.state())

    let { currentTask, taskKey: tKey } = wrapper.state()
    expect(currentTask.start).toBe(86100)
    expect(currentTask.end).toBe(86700)
    expect(currentTask).toBeDefined()
    expect(currentTask).toBeInstanceOf(Object)
    expect(tKey).toBe(key)

    wrapper.instance().onTimer({
      data: {
        timestamp: now.valueOf(),
        hrs: 0,
        min: 5,
        sec: 0,
        ms: 0,
      }
    })
    
    wrapper.instance().stopTimer()
    // log(wrapper.state())
    expect(wrapper.state().currentTask).toBeNull()
    expect(wrapper.state().tasksLog).toHaveProperty(key)
    const tomorrow = now.add(1, 'd')
    // dt.setTime(ts +  86400000)
    // const overflowKey = taskKey(new Date(dt.getTime()))
    const overflowKey = tomorrow.format(TASK_KEY_FORMAT)
    expect(wrapper.state().tasksLog).toHaveProperty(overflowKey)
    expect(wrapper.state().focusMode).toBe(false)
    expect(wrapper.state().tasksLog[overflowKey][0].start).toBe(0)
    expect(wrapper.state().tasksLog[overflowKey][0].end).toBe(5 * 60)
    expect(wrapper.state().tasksLog[overflowKey][0].length).toBe(5 * 60)
  })

  it('spawns a web worker for timer', () => {
    const wrapper = shallow(<Timer />)

    expect(wrapper.instance().timerWorker).toBeInstanceOf(Worker)
  })

  // it('toggle night mode')

  // it('save task')

  // it('handles click task')

  // it('handles close task')

  // it('handles slider change')

  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<BrowserRouter>
      <Timer />
    </BrowserRouter>, div)
    ReactDOM.unmountComponentAtNode(div)
  })

})