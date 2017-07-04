import React, { Component } from 'react';
import { connect } from 'react-redux';

class Requests extends Component {
  render() {
    return <div>requests</div>;
  }
}

export default connect(state => state)(Requests);