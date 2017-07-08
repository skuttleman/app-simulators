import React, { Component } from 'react';

export default class SimulatorGroup extends Component {
  static group(Simulator, simulators, name, key) {
    return <SimulatorGroup
      Simulator={Simulator}
      key={key}
      name={name}
      simulators={simulators} />;
  }

  render() {
    const { Simulator, name, simulators } = this.props;
    return (
      <table className="simulatorGroup">
        <thead>
          <tr>
            <th><h3>{name}</h3></th>
          </tr>
        </thead>
        <tbody>
          {simulators.map((simulator, key) => <Simulator key={key} {...simulator} />)}
        </tbody>
      </table>
    );
  }
}