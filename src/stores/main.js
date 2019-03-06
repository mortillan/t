import { createStore } from 'redux'
import { reducers } from '../reducers/root'

export const store = createStore(reducers)