import React, { Component } from 'react';
import connectJSON from '../store/connectors/connectJSON';
import { getIn } from 'fun-util';
import getMessages from '../actions/getMessages';

class Messages extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    const path = getIn(this.props, 'location', 'query', 'path') || '';
    dispatch(getMessages(path));
  }

  render() {
    const path = getIn(this.props, 'location', 'query', 'path') || '';
    const { messages } = this.props;
    return (
      <div>
        <h1>Messages</h1>
        <div>WS: {path}</div>
        <pre>{messages}</pre>
      </div>
    );
  }
}

export default connectJSON('messages')(Messages);