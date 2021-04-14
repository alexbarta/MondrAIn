import React, {Component} from 'react';
import { getQRBuffer } from './QRcode';


class TokenMinter extends Component {
  render() {
      return(
        <main role="main" className="col-lg-12 d-flex text-center">
        <div className="content-mr-auto ml-auto">
          <h1>Abstract Your Ideas</h1>
          <form onSubmit={(event) => {
            event.preventDefault()
            if (this.props.account) {
              const token = this.token.value
              this.props.mint(token);
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