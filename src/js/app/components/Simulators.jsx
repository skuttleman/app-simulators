import React, { Component } from 'react';
import { connect } from 'react-redux';

class Simulators extends Component {
  render() {
    return <div>simulators</div>;
  }
}

export default connect(state => state)(Simulators);