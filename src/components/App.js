import React, { Component } from 'react';
import {Spinner} from 'react-bootstrap';
import AppErrorModal from './AppErrorModal';
import TopNavbar from './TopNavbar';
import TokenMinter from './TokenMinter';
import Social from './Social';
import NFTCarousel from './NFTCarousel';
import {getEthAccounts, getNetworkData, getAbi, getContractAddress, getContract, getTotalSupply} from './WalletHandler';
import Mondrain from '../abis/Mondrain.json';
import "../scss/App.scss";

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
      showWalletIsNotPresent: false,
      isWalletConnected: false,
      isWrongNetwork: false,
      showIsWrongNetwork: false,
      account: '',
      contract: null,
      contractAddress: '',
      totalSupply: 0,
      tokens: [],
      IPFSBaseURL: 'https://ipfs.infura.io/ipfs/',
      openSeaBaseURL: 'https://testnets.opensea.io/assets/mumbai',
      numberOfCarouselSlides: 4
    }
  }

  selectModalWalletIsNotPresent = (info) => {
    this.setState({showWalletIsNotPresent: !this.state.showWalletIsNotPresent}) // true/false toggle
  }
  
  selectModalIsWrongNetwork = (info) => {
    this.setState({showIsWrongNetwork: !this.state.showIsWrongNetwork}) // true/false toggle
  }

  checkWalletPresence = () => {
    if (!window.ethereum) {
      this.setState({ isWalletPresent : false, showWalletIsNotPresent: true})
    }
  }

  loadBlockchainData = async () => { 
    const networkData = await getNetworkData(Mondrain)
    console.log(networkData)
    if(!networkData) {
        this.setState({ isWrongNetwork : true , showIsWrongNetwork: true})
        return false
    }
    const abi = getAbi(Mondrain)
    const contractAddress = getContractAddress(networkData)
    const contract = getContract(abi, contractAddress)
    const totalSupply = await getTotalSupply(contract)
    this.setState({ contractAddress: contractAddress, contract: contract, totalSupply: totalSupply })
    console.log("contract:" + contractAddress)
    console.log("totalSupply:" + totalSupply)
    return true
  };

  loadIPFSImageData = async () => {
    var tokens = []
    for (var i = this.state.totalSupply - Math.min(this.state.numberOfCarouselSlides, this.state.totalSupply) + 1 ; i <= this.state.totalSupply; i++) { //show last numberOfSlides 
      const token = await this.state.contract.methods.tokens(i - 1).call()
      const tokenId = await this.state.contract.methods.getTokenId(token).call()
      const metadataURL = await this.state.contract.methods.tokenURI(tokenId).call()
      const tokenURIFetchResponse = await fetch(metadataURL)
      const tokenURIMetadataJson = await tokenURIFetchResponse.json()
      const tokenURI = tokenURIMetadataJson.image
      tokens.push({value: token, URI: this.state.IPFSBaseURL + tokenURI, openseaURL: this.state.openSeaBaseURL + '/' + this.state.contractAddress + '/' + tokenId})
      console.log("token:", token, tokenId, metadataURL , tokenURI)
    }

    this.setState({ tokens: tokens.reverse() })
  }

  async componentDidMount() {
    this.checkWalletPresence()
    if (window.ethereum) await this.loadBlockchainData()
    console.log("contract:", this.state.contract)
    if (this.state.contract && this.state.totalSupply > 0) await this.loadIPFSImageData()
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

/*   saveNewTokenCallback = (token, ipfsHash, id) => {
    this.setState({
      tokens: [{value: token, URI: this.state.IPFSBaseURL + ipfsHash, openseaURL: this.state.openSeaBaseURL + '/' + this.state.contractAddress + '/' + id}, ...this.state.tokens]
    })
  } */

  render() {
     
    return (
      <div className="root"> 
        <AppErrorModal showModal={this.state.showWalletIsNotPresent} hideModal={this.selectModalWalletIsNotPresent} 
          text="Non-Ethereum browser detected. You should consider trying MetaMask!"/>
        <AppErrorModal showModal={this.state.showIsWrongNetwork} hideModal={this.selectModalIsWrongNetwork} 
          text="Smart contract not deployed on selected Metamask network"/>
        <TopNavbar handler={this.getAccount} address={this.state.account}/>
        <TokenMinter isWalletConnected={this.state.isWalletConnected} 
          contract={this.state.contract}
          account={this.state.account} 
          openSeaContractURL={this.state.openSeaBaseURL + '/' + this.state.contractAddress} 
          IPFSBaseURL={this.state.IPFSBaseURL} />
         {this.state.tokens < Math.min(this.state.totalSupply, this.state.numberOfCarouselSlides) ? <div className="d-flex justify-content-center">
           <Spinner animation="border" role="status"/>
           </div> : <NFTCarousel tokens={this.state.tokens}/>}
        <Social contractAddress={this.state.contractAddress}/>
      </div>
    );
  }
}

export default App;