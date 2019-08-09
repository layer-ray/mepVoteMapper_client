import * as React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMW from 'redux-thunk';

import rootReducer from './redux/reducers';
import App from './App';

import './app-wide-scss/normalize.scss';
import './app-wide-scss/main.scss';

const store = createStore(rootReducer, applyMiddleware(thunkMW));
const mainDiv = document.getElementById('root');

ReactDOM.render(
    <Provider store={store} >
        <App />
    </Provider>
     , mainDiv);