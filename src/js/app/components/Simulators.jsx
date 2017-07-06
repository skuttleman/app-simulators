import HttpSimulators from './HttpSimulators';
import React, { Component } from 'react';
import SocketSimulators from './SocketSimulators';
import connectAll from '../store/connectors/connectAll';

class Simulators extends Component {
  render() {
    if (this.props.simulators.length) {
      return (
        <div>
          <h1>Simulators</h1>
          <HttpSimulators />
          <SocketSimulators />
          <button>Reset All</button>
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
