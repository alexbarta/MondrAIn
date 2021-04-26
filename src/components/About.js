import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

class About extends Component {
  render() {
  return (
  <Modal
  show={this.props.showModal}
  onHide={this.props.hideModal}
  dialogClassName="modal-90w"
  aria-labelledby="example-custom-modal-styling-title">
  <Modal.Header closeButton>
    <Modal.Title id="example-custom-modal-styling-title">
        MondrAIn Project
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p>
    Our project aims to revolutionise how digital content and messages are shared and protected in the digital world. 
      Here we allow users to convert any text (e.g. from a single word to an entire poem) into colourful and artistic QRcodes 
      (also known as QuadRo) instantly coloured by our algorithm in the manner of the artist Mondrian; a central figure in modern art and geometric abstraction. 
      We also make your QuadRo (and underlying text) unique by minting an NFT (Quadro token) on the polygon blockchain. 
      With the use of NFT we leverage blockchain technology to ensure originality, authentication and attribution of digital 
      contents as we also create the ecosystem for new models of collaboration and sharing.
    </p>
  </Modal.Body>
</Modal>

    )
  }
}

export default About;