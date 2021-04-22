import { connect} from 'react-redux'
import { Timer as TimerComponent } from '../routes/Timer'
import { 
  STOP_TIMER 
} from '../actions/timer'

const mapStateToProps = (state, ownProps) => ({
  tasksLog: state.tasksLog,
  currentTask: state.currentTask,
  timerDuration: state.timerDuration,
  showNotif: state.showNotif,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  stopTimer: () => dispatch({
    type: STOP_TIMER
  }),

  setTimerDuration: ({ target }) => dispatch({

  })
})

export const TimerContainer = connect(
  mapStateToProps, 
  mapDispatchToProps
)(TimerComponent)