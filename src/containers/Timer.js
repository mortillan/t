import { connect} from 'react-redux'
import { Timer as TimerComponent } from '../routes/Timer'
import { tickClock } from '../actions/main'
import { 
  START_TIMER, STOP_TIMER 
} from '../actions/timer'

const mapStateToProps = (state, ownProps) => ({
  clock: state.clock,
  taskKey: state.taskKey,
  tasksLog: state.tasksLog,
  currentTask: status.currentTask,
  slider: state.slider,
  focusMode: state.focusMode,
  taskWebWorker: state.taskWebWorker,
  showNotif: state.showNotif,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  
})

export const Timer = connect(mapStateToProps, mapDispatchToProps)(TimerComponent)