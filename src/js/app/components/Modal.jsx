import React, { Component } from 'react';
import { compose } from 'fun-util';
import { hideModal, toggleModalJSON, updateModalValue } from '../actions/modal';
import JSONEditor from './JSONEditor';
import { Modal, ModalHeader, ModalTitle, ModalClose, ModalBody, ModalFooter } from 'react-modal-bootstrap';

export default class MyModal extends Component {
  renderInput() {
    const { dispatch, jsonEditor, value } = this.props;
    const getTargetValue = ({ target }) => target.value;
    const onChange = value => dispatch(updateModalValue(value));
    if (jsonEditor) {
      return <JSONEditor id="socketMessage" value={value} onChange={onChange}/>
    }
    return <input className="form-control" id="socketMessage" value={value} onChange={compose(onChange, getTargetValue)}/>
  }

  render() {
    const { dispatch, jsonEditor, onPrimary, title, value, visible } = this.props;
    const onSend = () => onPrimary(value).then(hideModal).then(dispatch);
    return (
      <Modal isOpen={visible} onRequestHide={() => dispatch(hideModal())}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalClose onClick={() => dispatch(hideModal())}/>
        </ModalHeader>
        <ModalBody>
        <div className="form-check">
          <label className="form-check-label">
            <input type="checkbox" className="form-check-input" value={jsonEditor} onChange={() => dispatch(toggleModalJSON())}/>
            Use JSON Editor
          </label>
        </div>
          <div className="form-group">
            {this.renderInput()}
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-secondary" onClick={() => dispatch(hideModal())}>
            Close
          </button>
          <button className="btn btn-primary" onClick={onSend}>
            Send Message
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}
