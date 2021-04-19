import React, {Component} from 'react';
import { getQRBuffer } from './QRcode';

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


class TokenMinter extends Component {
  render() {
      return(
        <main role="main" className="col-lg-12 d-flex text-center">
        <div className="content-mr-auto ml-auto">
          <h1>Abstract Your Ideas</h1>
          <form onSubmit={async (event) => {
            event.preventDefault()
            if (this.props.account) {
              const token = this.token.value
              console.log("Generating QR code")
              const qr =  await getQRBuffer(token)
              console.log("Generated QR code:" + qr.split(",")[1])
              var QRblob = b64toBlob(qr.split(",")[1], "image/png");
              console.log("Saving QR on ipfs")
              ipfs.add(QRblob, (error, result) => {
                console.log('Ipfs image result', result[0].hash)
                if(error) {
                  console.error(error)
                  return
                }
                var metadataHashTable = {}
                metadataHashTable.name = this.token.value
                metadataHashTable.description = "QR code representing: " + this.token.value
                metadataHashTable.image = "https://ipfs.infura.io/ipfs/" + result[0].hash
                metadataHashTable.attributes = []
                console.log("Generated hash table:" + JSON.stringify(metadataHashTable))
                ipfs.add(JSON.stringify(metadataHashTable), (error,result) => {
                  console.log('Ipfs metadata result', result[0].hash)
                  if(error) {
                    console.error(error)
                    return
                  }
                  this.props.mint(token, result[0].hash)
                })
              })
            } else {
              window.alert("Connect your wallet first")
            }
          }}>
            <input
              type='text'
              className='form-control mb-1'
              placeholder='Your Amazing Words..'
              ref={(input) => { this.token = input }}
            />
            <input
              type='submit'
              className='btn btn-block btn-primary'
              value='I WANt My T0KEnZ N0w!'
            />
          </form>
        </div>
      </main>
      )

  }

}

export default TokenMinter