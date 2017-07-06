import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import connectSimulator from '../store/connectors/connectSimulator';
import { messages } from '../../config/urls/views';

class SocketSimulator extends Component {
  render() {
    const { description, name, path } = this.props;
    return (
      <li>
        <h4>{name}</h4>
        <div>
          <div>WS: {path}</div>
          <div>{description}</div>
          <div>
            <button onClick={() => browserHistory.push(messages(path))}>View Messages</button>
            <button>Clear Messsages</button>
          </div>
          <div>
            <button>Send Message</button>
          </div>
        </div>
      </li>
    );
  }
}

export default connectSimulator(SocketSimulator);
