import App from './components/App';
import { Provider } from 'react-redux';
import React from 'react';
import Messages from './components/Messages';
import Requests from './components/Requests';
import Simulators from './components/Simulators';
import Update from './components/Update';
import appReducer from './store/reducers/appReducer';
import { applyMiddleware, createStore } from 'redux';
import { browserHistory, Router, Route, IndexRoute } from 'react-router';
import { compose } from 'fun-util';
import enhancers from './store/enhancers';
import { syncHistoryWithStore } from 'react-router-redux';
import middleware from './store/middleware';

const store = createStore(appReducer, compose(...enhancers, applyMiddleware(...middleware)));
const history = syncHistoryWithStore(browserHistory, store);

export default (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Simulators} />
        <Route path="/sims" component={Simulators} />
        <Route path="/sims/update" component={Update} />
        <Route path="/sims/requests" component={Requests} />
        <Route path="/sims/messages" component={Messages} />
      </Route>
    </Router>
  </Provider>
);