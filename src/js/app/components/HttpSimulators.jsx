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
          <h2>HTTP Simulators</h2>
          {groups.map((group, key) => (
            <div key={`http-${key}`} className="row">
              {SimulatorGroup.group(HttpSimulator, simulators[group], group)}
            </div>
          ))}
        </div>
      );
    }
    return <div />;
  }
}

export default connectSimulators('http')(HttpSimulators);
