import React, { Component } from 'react';
import { connect } from 'react-redux';
import getSimulators from '../actions/getSimulators';

class App extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getSimulators());
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default connect(state => state)(App);