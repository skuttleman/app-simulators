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
        <div>
          <h2>WebSocket Simulators</h2>
          {groups.map((group, key) => (
            <div key={`ws-${key}`} className="row">
              {SimulatorGroup.group(SocketSimulator, simulators[group], group)}
            </div>
          ))}
        </div>
      );
    }
    return <div />;
  }
}

export default connectSimulators('socket')(SocketSimulators);
