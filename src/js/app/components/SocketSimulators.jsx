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
          <h2>Http Simulators</h2>
          <ul>
            {groups.map((group, key) => {
              return SimulatorGroup.group(SocketSimulator, simulators[group], group, key);
            })}
          </ul>
          <button>Broadcast Message</button>
        </div>
      );
    }
    return <div />;
  }
}

export default connectSimulators('socket')(SocketSimulators);
