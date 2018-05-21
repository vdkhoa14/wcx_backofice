
import './assets/template/font-awesome-4.7.0/css/font-awesome.css'
import './assets/template/ionicons/css/ionicons.min.css'
import './assets/template/adminLTE/css/AdminLTE.min.css'
import './assets/template/adminLTE/css/skins/_all-skins.min.css'
import './assets/template/bootstrap/css/bootstrap.min.css'
import './assets/css/app.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import registerServiceWorker from './registerServiceWorker'
import reducers from './app/reducers'
import App from './app'
import store from './app/store'

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById('root'))
registerServiceWorker()
