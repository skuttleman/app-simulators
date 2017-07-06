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
      <li>
        <h3>{name}</h3>
        <ul>
          {simulators.map((simulator, key) => <Simulator key={key} {...simulator} />)}
        </ul>
      </li>
    );
  }
}