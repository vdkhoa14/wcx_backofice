import { createStore, applyMiddleware, compose } from 'redux'
import reducers from './reducers'
import thunk from 'redux-thunk'

const middlewares = [
    thunk
]

let store = createStore(reducers, {},
    compose(
        applyMiddleware(...middlewares),
        process.env.NODE_ENV === "development" && window.devToolsExtension ? window.devToolsExtension() : f => f
    )
)
export default store