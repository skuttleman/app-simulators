import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import clearRequests from '../actions/clearRequests';
import connectSimulator from '../store/connectors/connectSimulator';
import { requests, update } from '../../config/urls/views';
import resetResponse from '../actions/resetResponse';
import { simulators } from '../../config/urls/simulators';

class HttpSimulator extends Component {
  render() {
    const { description, dispatch, method, name, path } = this.props;
    return (
      <tr className="simulator-row httpSimulator-row">
        <td className="name">
          <h4>{name}</h4>
          <div className="url">{method}: {simulators(path)}</div>
        </td>
        <td className="description"><p>{description}</p></td>
        <td className="buttons">
          <button className="button goToView" onClick={() => browserHistory.push(requests(method, path))}>
            View Requests
            </button>
          <button className="button api" onClick={() => dispatch(clearRequests(method, path))}>
            Clear Requests
          </button>
        </td>
        <td className="buttons">
          <button className="button goToView" onClick={() => browserHistory.push(update(method, path))}>
            Update Response
          </button>
          <button className="button api" onClick={() => dispatch(resetResponse(method, path))}>
            Reset Response
          </button>
        </td>
      </tr>
    );
  }
}

export default connectSimulator(HttpSimulator);
