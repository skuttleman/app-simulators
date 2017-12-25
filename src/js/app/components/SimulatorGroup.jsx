import React, { Component } from 'react';

export default class SimulatorGroup extends Component {
  static group(Simulator, simulators, name) {
    return <SimulatorGroup
      Simulator={Simulator}
      name={name}
      simulators={simulators} />;
  }

  render() {
    const { Simulator, name, simulators } = this.props;
    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th><h3>{name}</h3></th>
          </tr>
        </thead>
        <tbody>
          {simulators.map((simulator, key) => <Simulator key={`${name}-${key}`} {...simulator} />)}
        </tbody>
      </table>
    );
  }
}