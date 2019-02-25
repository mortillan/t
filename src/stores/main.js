import { createStore } from 'redux'
import { reducers } from '../reducers/main'

export const store = createStore(reducers)