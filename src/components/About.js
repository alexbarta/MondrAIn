import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'

class About extends Component {
  render () {
    return (
      <Modal
        show={this.props.showModal}
        onHide={this.props.hideModal}
        dialogClassName='modal-90w'
        aria-labelledby='example-custom-modal-styling-title'
      >
        <Modal.Header closeButton>
          <Modal.Title id='example-custom-modal-styling-title'>
            MondrAIn Project
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Enter your text to get a personalised QR code coloured with a Mondrian-like touch and minted as NFT on the blockchain!</p>
          <p>Follow us @mondrainxyz on Twitter</p>
        </Modal.Body>
      </Modal>

    )
  }
}

export default About
