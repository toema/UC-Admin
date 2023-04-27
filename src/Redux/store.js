import { createStore, applyMiddleware } from "redux";
import {rootReducer} from "./RootReducer"
import { composeWithDevTools } from 'redux-devtools-extension';
import {thunk} from "redux-thunk"


export const store = createStore(
    rootReducer, /* preloadedState, */
 +  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )