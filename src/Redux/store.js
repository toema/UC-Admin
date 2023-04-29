import { createStore, applyMiddleware } from "redux";
import { rootReducer } from "./RootReducer";

export const store = createStore(
	rootReducer /* preloadedState, */,
	+window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
