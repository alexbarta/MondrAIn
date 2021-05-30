import React, {Component} from 'react';
import {Container, Row, Col, Form, Jumbotron, Button, Modal, Spinner, OverlayTrigger, Tooltip} from 'react-bootstrap';
import { getQRBuffer } from './QRcode';
import AppErrorModal from './AppErrorModal';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

class TokenCreationModal extends Component {
  
  MintingNftOnError = (props) => {
    console.log("Catched error:", this.props.onError)
    return(
      <>
        <Modal.Header closeButton>
        <div className="col text-center">
          <Modal.Title id="contained-modal-title-vcenter">
          Oops....
          </Modal.Title>
        </div>
        </Modal.Header>
        <Modal.Body>
        Something unexpected happened :( Please try once again.
        </Modal.Body>
     </>
    )
  }
  
  MintingNftOngoing = (props) => {
    return(
      <>
        <Modal.Header closeButton>
        <div className="col text-center">
          <Modal.Title id="contained-modal-title-vcenter">
          Be patient your NFT is on its way :)
          </Modal.Title>
        </div>
        </Modal.Header>
        <Modal.Body>
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status"> 
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
        </Modal.Body>
     </>
    )
  }

  MintingNftFinished = (props) => {

    return(
        <>
          <Modal.Header closeButton>
          <div className="col text-center">
            <Modal.Title id="contained-modal-title-vcenter">
              Congratulations your NFT is ready!
            </Modal.Title>
          </div>
          </Modal.Header>
          <div className="col text-center">
          <Modal.Body onClick={() => window.open(this.props.explorerURL +  this.props.tokenId)}>
            <OverlayTrigger
              key="bottom"
              placement="bottom"
              overlay={
                <Tooltip id="tooltip-carousel-newtoken">
                  Check me out on AVAX explorer!
                </Tooltip>
              }
            >
              <img
                src={this.props.IPFSBaseURL + this.props.tokenMetadata.image}
                alt="loading"
                style={{ cursor: "pointer" }}
              />
            </OverlayTrigger>
          </Modal.Body>
          </div>
        </>
    )
  }
  
  render(){

    return(
      <Modal show={this.props.showModal}
      onHide={this.props.hideModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      centered>
      {this.props.isMinting ? <this.MintingNftOngoing /> : 
      this.props.onError ? <this.MintingNftOnError/> : <this.MintingNftFinished/>}
      <Modal.Footer>
        <Button onClick={this.props.hideModal}>Close</Button>
      </Modal.Footer>
    </Modal>
     )
   }
}


class TokenMinter extends Component {

    
  state = {
        showWalletIsNotConnected: false,
        showTokenIsTooLongOrEmpty: false,
        showTokenMinting: false, 
        isMinting: false,
        tokenMetadata: {},
        tokenId: null,
        onError: null,
      }

  selectModalWalletIsNotConnected = () => {
    this.setState({showWalletIsNotConnected: !this.state.showWalletIsNotConnected}) // true/false toggle
  }

  selectModalTokenIsTooLongOrEmpty = () => {
    this.setState({showTokenIsTooLongOrEmpty: !this.state.showTokenIsTooLongOrEmpty}) // true/false toggle
  }

  selectModalTokenIsMinting = () => {
    this.setState({ showTokenMinting: !this.state.showTokenMinting}) // true/false toggle
  }

  mint = (metadataHashTable, metadataIpfsHash) => {
    this.props.contractERC721.methods.mint(metadataHashTable.name, metadataIpfsHash).send({ from: this.props.account, 
      value: 50000000000000000, gas: 300000, gasPrice: 300000000000})
    .once('receipt', (receipt) => {
      console.log('receipt:', receipt)
      let tokenId = this.props.contractERC721.methods.getTokenId(metadataHashTable.name).call()
      tokenId.then((id) => {
          //This should update token minting modal
          this.setState( {tokenId: id, tokenMetadata: metadataHashTable }, 
            () => {this.setState({ isMinting: false })
          })
          console.log("Saved new token")
        },
      (error) => {
        console.log('We have encountered an Error!'); // Log an error
        this.setState({ onError: error })
      })
    }).on('error', (error) => {console.log("I am in error:", error)
        this.setState({ onError: error, isMinting: false }) 
    })
/*     .on('transactionHash', (transactionHash) => {console.log("transaction hash", transactionHash)} )
    .on('confirmation', (confirmation) => {console.log("confirmation ", confirmation)})
    .catch(console.log('in catch')); */
  }

  onFormSubmit = async (e) => {
    e.preventDefault()
    if(this.props.isWalletConnected && this.props.contractERC721) {
    const formData = new FormData(e.target),
    formDataObj = Object.fromEntries(formData.entries())
    const token = formDataObj.tokenInput.trim()
    
    if (token.length > 4295 || token.length === 0){
      this.setState({showTokenIsTooLongOrEmpty: true})
      return null
    }
    // Let Modal Appear
    this.setState({ showTokenMinting: true, isMinting: true })
    
    // Generate QRCode
    console.log("Generating QR code",token)
    const qr =  await getQRBuffer(token)
    console.log("Generated QR code")
    var QRblob = b64toBlob(qr.split(",")[1], "image/png")
    console.log("Saving QR on ipfs")
    
    ipfs.add(QRblob, (error, QRBlobSaveResult) => {
      // saving QR BLOB on IPFS, returns hash value pointer
      if(error) {
        console.log("ipfs add:", error)
        this.setState({ onError: error , isMinting: false })
        return null
      }
      console.log('Ipfs image result', QRBlobSaveResult[0].hash)
      
      // defining metadata JSON to be saved on blockchain, returns hash value pointer
      var metadataHashTable = {}
      metadataHashTable.name = token
      metadataHashTable.description = "QR code representing: " + token
      metadataHashTable.image = QRBlobSaveResult[0].hash
      metadataHashTable.attributes = []
      console.log("Generated hash table:" + JSON.stringify(metadataHashTable))

      // saving metadata JSON on IPFS, return hash value pointer and mints a new token
      ipfs.add(JSON.stringify(metadataHashTable), (error, metadataSaveResult) => {
        if(error) {
          console.error(error)
          this.setState({ onError: error, isMinting: false })
          return null 
        }
        console.log('Ipfs metadata result', this.props.IPFSBaseURL + metadataSaveResult[0].hash)
        this.mint(metadataHashTable, this.props.IPFSBaseURL + metadataSaveResult[0].hash)
      })
    })
  } else {
      this.setState({ showWalletIsNotConnected: true })
    }
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

  render() {

    return(
      <Jumbotron>
        <AppErrorModal showModal={this.state.showWalletIsNotConnected} hideModal={this.selectModalWalletIsNotConnected} 
        text="Please connect your wallet first"/>
        <AppErrorModal showModal={this.state.showTokenIsTooLongOrEmpty} hideModal={this.selectModalTokenIsTooLongOrEmpty} 
        text="Empty input or too many words (max 4295 chars)"/>
        <TokenCreationModal 
        showModal={this.state.showTokenMinting}
        hideModal={this.selectModalTokenIsMinting}
        isMinting={this.state.isMinting}
        onError={this.state.onError}
        tokenMetadata={this.state.tokenMetadata}
        tokenId={this.state.tokenId}
        IPFSBaseURL={this.props.IPFSBaseURL}
        explorerURL={this.props.explorerURL}/>
        <Container>
          <Row>
            <Col className="col text-center">
            <h2>Abstract your words</h2> 
            </Col>
          </Row>
          <Form onSubmit={this.onFormSubmit}>
              <Form.Control type="text" name="tokenInput" placeholder='Your Amazing Words..'/>
              <Button className="btn btn-primary w-100" type="submit">Mint it!</Button>
          </Form>
        </Container>
      </Jumbotron>
      )

  }

}

export default TokenMinter


