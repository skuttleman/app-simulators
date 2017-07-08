import JSONEditor from './JSONEditor';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { compose, getIn, partial, silent, thread } from 'fun-util';
import connectAll from '../store/connectors/connectAll';
import getSimulatorResponse, { setResponse } from '../actions/getSimulatorResponse';
import { handleOnChange } from '../utils/event';
import { isValid, pretty } from '../utils/json';
import { noop } from '../utils/misc';
import updateResponse from '../actions/updateResponse';

class Update extends Component {
  componentDidMount() {
    const { method = '', path = '' } = getIn(this.props, 'location', 'query') || {};
    const { dispatch } = this.props;
    dispatch(getSimulatorResponse(method, path));
  }

  render() {
    const { method = '', path = '' } = getIn(this.props, 'location', 'query') || {};
    const { dispatch, response } = this.props;
    const onChange = compose(dispatch, setResponse);
    const reFormat = key => () => compose(onChange, into(key), pretty, silent(JSON.parse))(response[key]);
    return (
      <div>
        <h1>Update Response</h1>
        <p className="url">{method}: {path}</p>
        <form onSubmit={event => event.preventDefault()}>
          <fieldset>
            <label>Body:</label>
            <JSONEditor autoFocus={true} value={pretty(response.body)} onChange={compose(onChange, into('body'))} />
            <button className="button inlineForm" onClick={reFormat('body')}>Re-Format</button>
          </fieldset>
          <fieldset>
            <label>Status:</label>
            <input type="number" value={response.status} onChange={compose(onChange, into('status'), handleOnChange)} />
          </fieldset>
          <fieldset>
            <label>Delay:</label>
            <input type="number" value={response.delay} onChange={compose(onChange, into('delay'), handleOnChange)} />
          </fieldset>
          <fieldset>
            <label>Headers:</label>
            <JSONEditor value={pretty(response.headers)} onChange={compose(onChange, into('headers'))} />
            <button className="button inlineForm" onClick={reFormat('headers')}>Re-Format</button>
          </fieldset>
          <div className="buttons">
            <button className="button goToView" onClick={() => this._updateResponse()}>
              Update Response
            </button>
            <button className="button api" onClick={() => browserHistory.goBack()}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  _updateResponse() {
    const { method = '', path = '' } = getIn(this.props, 'location', 'query') || {};
    const { dispatch, response } = this.props;
    thread(
      response => ({ ...response, body: silent(JSON.parse)(response.body) }),
      response => ({ ...response, delay: response.delay ? Number(response.delay) || 0 : undefined }),
      response => ({ ...response, headers: silent(JSON.parse)(response.headers) }),
      response => ({ ...response, status: Number(response.status) || undefined }),
      partial(updateResponse, method, path),
      dispatch,
      promise => promise.then(() => browserHistory.goBack())
    )(response);
  }
}

const into = key => value => ({ [key]: value });

export default connectAll(Update);
