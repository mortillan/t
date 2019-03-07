import { applyMiddleware, createStore, compose } from 'redux'
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { reducers } from '../reducers/root'
import { sagas } from '../sagas/root'

const sagaMiddleware  = createSagaMiddleware()

const store = createStore(
  reducers, 
  compose (
    applyMiddleware(sagaMiddleware), 
    applyMiddleware(logger)
  )
)

sagaMiddleware.run(sagas)

export { store }