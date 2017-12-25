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
      <div className="stored messages">
        <h1>Messages</h1>
        <div className="url"><span className="protocol">WS:</span> {path}</div>
        <div className="json"><pre><code>{messages}</code></pre></div>
      </div>
    );
  }
}

export default connectJSON('messages')(Messages);