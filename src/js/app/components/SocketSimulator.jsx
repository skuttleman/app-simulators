import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import clearMessages from '../actions/clearMessages';
import connectSimulator from '../store/connectors/connectSimulator';
import { messages } from '../../config/urls/views';
import { simulators } from '../../config/urls/simulators';

class SocketSimulator extends Component {
  render() {
    const { description, dispatch, name, path, sockets } = this.props;
    return (
      <tr className="simulator-row socketSimulator-row">
        <td className="name">
          <h4>{name}</h4>
          <div className="url">WS: {simulators(path)}</div>
        </td>
        <td className="description">
          <p>{description}</p>
          {sockets.length ? <p>Connections:</p> : null}
          <ul>
            {sockets.map((id, key) => <li key={key}>
              <span className="url">Connection-{key}: </span>
              <button className="button inlineForm">Send Message</button>
            </li>)}
          </ul>
        </td>
        <td className="buttons">
          <button className="button goToView" onClick={() => browserHistory.push(messages(path))}>
            View Messages
          </button>
          <button className="button api" onClick={() => dispatch(clearMessages(path))}>
            Clear Messsages
          </button>
        </td>
        <td className="buttons">
          <button className="button inlineForm">Broadcast Message</button>
        </td>
      </tr>
    );
  }
}

export default connectSimulator(SocketSimulator);
