import React,{Component} from "react";
import { Modal } from "react-bootstrap";


class  AppErrorModal extends Component {
    render() {
      return (
      <>
        <Modal show={this.props.showModal} onHide={this.props.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Oops... :(</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.props.text}</Modal.Body>
        </Modal>
      </>
    );
  }
}

export default AppErrorModal;