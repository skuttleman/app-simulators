import React, { Component } from 'react';
import { connect } from 'react-redux';

class Simulator extends Component {
  render() {
    return <div>simulator</div>;
  }
}

export default connect(state => state)(Simulator);