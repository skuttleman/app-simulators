import HttpSimulators from './HttpSimulators';
import React, { Component } from 'react';
import SocketSimulators from './SocketSimulators';
import connectAll from '../store/connectors/connectAll';
import resetAll from '../actions/resetAll';

class Simulators extends Component {
  render() {
    const { dispatch, simulators } = this.props;
    if (simulators.length) {
      return (
        <div>
          <h1>Simulators</h1>
          <HttpSimulators />
          <SocketSimulators />
          <button className="btn btn-danger" onClick={() => dispatch(resetAll())}>Reset All</button>
        </div>
      );
    }
    return (
      <div>
        <h1>No Simulators</h1>
      </div>
    );
  }
}

export default connectAll(Simulators);
