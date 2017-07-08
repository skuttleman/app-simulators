import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { compose, getIn, partial, silent, thread } from 'fun-util';
import connectJSON from '../store/connectors/connectJSON';
import getSimulatorResponse, { setResponse } from '../actions/getSimulatorResponse';
import { handleOnChange } from '../utils/event';
import { isValid, pretty } from '../utils/json';
import { noop } from '../utils/misc';
import updateResponse from '../actions/updateResponse';

class Update extends Component {
  componentDidMount() {
    const { method = '', path = '' } = getIn(this.props, 'location', 'query') || {};
    const { dispatch } = this.props;
    this.setState({ locked: true });
    dispatch(getSimulatorResponse(method, path))
      .catch(noop)
      .then(() => this.setState({ locked: false }));
  }

  render() {
    const { locked = false } = this.state || {};
    const { method = '', path = '' } = getIn(this.props, 'location', 'query') || {};
    const { dispatch, response } = this.props;
    const className = ['json', 'json-input', isValid(response) ? 'valid' : 'invalid'].join(' ');
    const onChange = compose(dispatch, setResponse, handleOnChange);
    const onClick = compose(dispatch, setResponse, pretty, silent(JSON.parse));
    return (
      <div>
        <h1>Update Response</h1>
        <p className="url">{method}: {path}</p>
        <textarea className={className} disabled={locked} value={response} onChange={onChange} />
        <div className="buttons">
          <button className="button api" onClick={() => onClick(response)}>Format</button>
        </div>
        <div className="buttons">
          <button className="button goToView" onClick={() => this._updateResponse()}>
            Update Response</button>
          <button className="button api" onClick={() => browserHistory.goBack()}>Cancel</button>
        </div>
      </div>
    );
  }

  _updateResponse() {
    const { method = '', path = '' } = getIn(this.props, 'location', 'query') || {};
    const { dispatch, response, status, delay } = this.props;
    thread(
      silent(JSON.parse),
      response => ({ response, status, delay }),
      partial(updateResponse, method, path),
      dispatch,
      promise => promise.then(() => browserHistory.goBack())
    )(response);
  }
}

export default connectJSON('response')(Update);
