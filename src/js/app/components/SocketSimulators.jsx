import React, { Component } from 'react';
import SimulatorGroup from './SimulatorGroup';
import SocketSimulator from './SocketSimulator';
import connectSimulators from '../store/connectors/connectSimulators';

class SocketSimulators extends Component {
  render() {
    const { simulators } = this.props;
    const groups = Object.keys(simulators);
    if (groups.length) {
      return (
        <div className="simulators socketSimulators">
          <h2>Socket Simulators</h2>
          {groups.map((group, key) => (
            SimulatorGroup.group(SocketSimulator, simulators[group], group, key)
          ))}
        </div>
      );
    }
    return <div />;
  }
}

export default connectSimulators('socket')(SocketSimulators);
