import React, { Component } from 'react';
import { connect } from 'react-redux';

class Update extends Component {
  render() {
    return <div>update</div>;
  }
}

export default connect(state => state)(Update);