import React, { Component } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalClose, ModalBody, ModalFooter } from 'react-modal-bootstrap';
import { hideModal } from '../actions/modal';

export default class MyModal extends Component {
  render() {
    const { content, value, dispatch, onPrimary, title, visible } = this.props;
    return (
      <Modal isOpen={visible} onRequestHide={() => dispatch(hideModal())}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalClose onClick={() => dispatch(hideModal())}/>
        </ModalHeader>
        <ModalBody>
          <label htmlFor="socketMessage">Message:</label>
          <input name="socketMessage" value={value} onChange={({ target: { value } }) => dispatch({ type: 'asdfdsf', value })}/>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-secondary" onClick={() => dispatch(hideModal())}>
            Close
          </button>
          <button className="btn btn-primary" onClick={() => onPrimary({ value: 'value' }).then(hideModal).then(dispatch).catch(console.log)}>
            Send Message
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}
