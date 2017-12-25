import React, { Component } from 'react';
import connectAll from '../store/connectors/connectAll';
import getSimulators from '../actions/getSimulators';
import Modal from './Modal';

class App extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getSimulators());
  }

  render() {
    return (
      <div className="container">
        <Modal dispatch={this.props.dispatch} {...this.props.modal} />
        {this.props.children}
      </div>
    );
  }
}

export default connectAll(App);