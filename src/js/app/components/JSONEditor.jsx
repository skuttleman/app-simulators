import CodeMirror from 'react-codemirror';
import React, { Component } from 'react';
import { forEach } from 'fun-util';
import { isValid } from '../utils/json';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/lint/json-lint';
import 'codemirror/addon/edit/matchbrackets';

const normalize = string => string ? string.replace(/\r\n|\r/g, '\n') : string;

class JSONEditor extends CodeMirror {
  componentWillReceiveProps({ value, options }) {
    const oldValue = this.codeMirror.getValue();
    if (this.codeMirror && value !== undefined && normalize(value) !== normalize(oldValue)) {
      if (this.props.preserveScrollPosition) {
        var prevScrollPosition = this.codeMirror.getScrollInfo();
        this.codeMirror.setValue(value);
        this.codeMirror.scrollTo(prevScrollPosition.left, prevScrollPosition.top);
      } else {
        this.codeMirror.setValue(value);
      }
    }
    forEach(options, (value, key) => this.setOptionIfChanged(key, value));
  }
}

export default class extends Component {
  render() {
    return (
      <JSONEditor
        options={{ mode: 'application/json', matchBrackets: true }}
        className={`json json-input ${isValid(this.props.value) ? 'valid' : 'invalid'}`}
        {...this.props} />
    );
  }
}
