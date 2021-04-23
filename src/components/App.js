import React, { Component } from 'react';
import Modal from './Modal';
import Navbar from './Navbar';
import TokenMinter from './TokenMinter';
import Social from './Social';
import {getEthAccounts, getNetworkData, getAbi, getContractAddress, getContract, getTotalSupply} from './WalletHandler';
import Mondrain from '../abis/Mondrain.json';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

function waitForAccount() {
  console.log("checking account presence:" + window.ethereum._state.accounts)
  if(!window.ethereum._state.accounts[0]) {
     window.setTimeout(waitForAccount, 500); /* this checks the flag every 500 milliseconds*/
  }
}

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isWalletPresent: true,
      isWalletConnected: false,
      isWrongNetwork: false,
      account: '',
      contract: null,
      contractAddress: '',
      totalSupply: 0,
      tokens: [],
      baseURI: 'https://ipfs.infura.io/ipfs/',
      openSeaBaseURI: 'https://testnets.opensea.io/assets'
    }
  }

  checkWalletPresence = () => {
    if (!window.ethereum) {
      this.setState({ isWalletPresent : false })
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  loadBlockchainData = async () => { 
    const networkData = await getNetworkData(Mondrain)
    console.log(networkData)
    if(!networkData) {
        this.setState({ isWrongNetwork : true })
        window.alert('Smart contract not deployed selected Metamask network. Rinkeby only for now :(')
        return false
    }
    const abi = getAbi(Mondrain)
    const contractAddress = getContractAddress(networkData)
    const contract = getContract(abi, contractAddress)
    const totalSupply = await getTotalSupply(contract)
    this.setState({ contractAddress })
    this.setState({ contract })
    this.setState({ totalSupply })
    console.log("contract:" + contractAddress)
    console.log("totalSupply:" + totalSupply)
    return true
  };

  loadIPFSImageData = async () => {
    var tokens = []
    var numberOfSlides = 3
    for (var i = this.state.totalSupply - (numberOfSlides - 1) ; i <= this.state.totalSupply; i++) { //show last numberOfSlides 
      const token = await this.state.contract.methods.tokens(i - 1).call()
      const tokenId = await this.state.contract.methods.getTokenId(token).call()
      const metadataURI = await this.state.contract.methods.tokenURI(tokenId).call()
      const tokenURIFetchResponse = await fetch(this.state.baseURI + metadataURI)
      const tokenURIMetadataJson = await tokenURIFetchResponse.json()
      const tokenURI = tokenURIMetadataJson.image
      tokens.push({value: token, URI: tokenURI, openseaURI: this.state.openSeaBaseURI + '/' + this.state.contractAddress + '/' + tokenId})
      console.log("token:", token, tokenId, this.state.baseURI + metadataURI , tokenURI)
    }

    this.setState({ tokens: tokens })
  }

  async componentDidMount() {
    console.log("pre isWalletPresent:",  this.state.isWalletPresent)
    this.checkWalletPresence()
    console.log("post isWalletPresent:", this.state.isWalletPresent)
    if (this.state.isWalletPresent) await this.loadBlockchainData()
    if (this.state.contract && this.state.totalSupply) await this.loadIPFSImageData()
  }

  getAccount = async () => {
    if(this.state.isWalletPresent) { 
      waitForAccount()
      let accounts = await getEthAccounts()
      this.setState({ account: accounts[0] })
      this.setState({ isWalletConnected: true })
    }
    console.log("isWalletConnected post:", this.state.isWalletConnected)
  }

  mint = (token, ipfsHash) => {
    this.state.contract.methods.mint(token, ipfsHash).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({
        tokens: [...this.state.tokens, token]
      })
    })
  }


  render() {


    return (
      <div> 
        <Navbar handler={this.getAccount} address={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <TokenMinter isWalletConnected={this.state.isWalletConnected} mint={this.mint} />
            <h1>Last Minted Tokens</h1>
            <div className="row text-center">
            <Carousel>
            {this.state.tokens.map((token, key) => {
              return(
                <div key={key} className="col-md-3 mb-3" includeMargin="true" onClick={() => window.open(token.openseaURI)}>
                   <img src={token.URI} alt="loading"/>
                </div>)
             })}
           </Carousel>
          </div>
          </div>
        </div>
        <Social />
      </div>
    );
  }
}

export default App;