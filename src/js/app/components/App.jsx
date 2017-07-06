import React, { Component } from 'react';
import connectAll from '../store/connectors/connectAll';
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

export default connectAll(App);