import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import clearMessages from '../actions/clearMessages';
import { showModal } from '../actions/modal';
import sendMessage from '../actions/sendMessage';
import connectSimulator from '../store/connectors/connectSimulator';
import { messages } from '../../config/urls/views';
import { simulators } from '../../config/urls/simulators';

class SocketSimulator extends Component {
  render() {
    const { description, dispatch, name, path, sockets } = this.props;
    const onPrimary = body => dispatch(sendMessage(path, body));
    const openBroadcast = () => dispatch(showModal({ onPrimary, title: 'Broadcast WebSocket Message'}));
    return (
      <tr className="simulator-row socketSimulator-row">
        <td className="name">
          <h4>{name}</h4>
          <div className="url"><span className="protocol">WS:</span> {simulators(path)}</div>
        </td>
        <td className="description">
          <p>{description}</p>
          {sockets.length ? <p>Connections:</p> : null}
          <ul>
            {sockets.map(id => {
              const onPrimary = body => dispatch(sendMessage(path, body, id));
              const onClick = () => dispatch(showModal({ onPrimary, title: 'Send WebSocket Message'}));
              return (
                <li key={`connection-${id}`}>
                  <span className="url">{id}: </span>
                  <button className="btn btn-info" onClick={onClick}>
                    Send Message
                  </button>
                </li>
              );
            })}
          </ul>
        </td>
        <td className="buttons">
          <button className="btn btn-primary" onClick={() => browserHistory.push(messages(path))}>
            View Messages
          </button>
          <button className="btn btn-danger" onClick={() => dispatch(clearMessages(path))}>
            Clear Messsages
          </button>
        </td>
        <td className="buttons">
          <button className={`btn btn-info${!sockets.length ? ' disabled' : ''}`} disabled={!sockets.length} onClick={openBroadcast}>
            Broadcast
          </button>
        </td>
      </tr>
    );
  }
}

export default connectSimulator(SocketSimulator);
