import {Provider} from 'react-redux'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import myStore from './redux/AppStore'

var rootEl = document.getElementById('root');

ReactDOM.render(
    <Provider store={myStore}>
        <App />
    </Provider>
    ,
    rootEl
);

if (module.hot) {
    module.hot.accept('./App', () => {
        const NextApp = require('./App').default
        ReactDOM.render(
            <NextApp />,
            rootEl
        )
    })
}