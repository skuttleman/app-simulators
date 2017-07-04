import App from './components/App';
import Requests from './components/Requests';
import Simulator from './components/Simulator';
import { Provider } from 'react-redux';
import React from 'react';
import Simulators from './components/Simulators';
import Update from './components/Update';
import appReducer from '../store/appReducer';
import { applyMiddleware, createStore } from 'redux';
import { browserHistory, Router, Route, IndexRoute } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import thunk from 'redux-thunk';

const store = createStore(appReducer, applyMiddleware(thunk));
const history = syncHistoryWithStore(browserHistory, store);

export default (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Simulators} />
        <Route path="/sims" component={Simulators} />
        <Route path="/sims/:path" component={Simulator} />
        <Route path="/sims/update/:path" component={Update} />
        <Route path="/sims/requests/:path" component={Requests} />
      </Route>
    </Router>
  </Provider>
);