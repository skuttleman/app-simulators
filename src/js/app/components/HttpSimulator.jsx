import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import connectSimulator from '../store/connectors/connectSimulator';
import { requests } from '../../config/urls/views';

class HttpSimulator extends Component {
  render() {
    const { method, path, name, description } = this.props;
    return (
      <li>
        <h4>{name}</h4>
        <div>
          <div>{method}: {path}</div>
          <div>{description}</div>
          <div>
            <button onClick={() => browserHistory.push(requests(method, path))}>View Requests</button>
            <button>Clear Requests</button>
          </div>
          <div>
            <button>Update Response</button>
            <button>Reset Response</button>
          </div>
        </div>
      </li>
    );
  }
}

export default connectSimulator(HttpSimulator);
