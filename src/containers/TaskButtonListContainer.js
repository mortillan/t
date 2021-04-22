import { connect} from 'react-redux'
import { TaskButtonList as TaskButtonListComponent } from '../components/TaskButtonList'
import { 
  START_TIMER 
} from '../actions/timer'
import { useClock } from '../hooks/useClock'

const mapStateToProps = (state, ownProps) => ({
  clock: useClock(),
  timerDuration: state.timerDuration,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  startTimer: () => dispatch({
    type: START_TIMER
  })
})

export const TaskButtonListContainer = connect(
  mapStateToProps, 
  mapDispatchToProps
)(TaskButtonListComponent)