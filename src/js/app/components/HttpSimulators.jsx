import HttpSimulator from './HttpSimulator';
import React, { Component } from 'react';
import SimulatorGroup from './SimulatorGroup';
import connectSimulators from '../store/connectors/connectSimulators';

class HttpSimulators extends Component {
  render() {
    const { simulators } = this.props;
    const groups = Object.keys(simulators);
    if (groups.length) {
      return (
        <div>
          <h2>Http Simulators</h2>
          <ul>
            {groups.map((group, key) => {
              return SimulatorGroup.group(HttpSimulator, simulators[group], group, key);
            })}
          </ul>
        </div>
      );
    }
    return <div />;
  }
}

export default connectSimulators('http')(HttpSimulators);
