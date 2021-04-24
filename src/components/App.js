import React, { Component } from 'react';
import Modal from './Modal';
import Navbar from './Navbar';
import TokenMinter from './TokenMinter';
import Social from './Social';
import NFTCarousel from './NFTCarousel';
import {getEthAccounts, getNetworkData, getAbi, getContractAddress, getContract, getTotalSupply} from './WalletHandler';
import Mondrain from '../abis/Mondrain.json';

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
      IPFSbaseURI: 'https://ipfs.infura.io/ipfs/',
      openSeaBaseURI: 'https://testnets.opensea.io/assets/mumbai'
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
    var numberOfSlides = 4
    for (var i = this.state.totalSupply - Math.min(numberOfSlides, this.state.totalSupply) + 1 ; i <= this.state.totalSupply; i++) { //show last numberOfSlides 
      const token = await this.state.contract.methods.tokens(i - 1).call()
      const tokenId = await this.state.contract.methods.getTokenId(token).call()
      const metadataURL = await this.state.contract.methods.tokenURI(tokenId).call()
      const tokenURIFetchResponse = await fetch(metadataURL)
      const tokenURIMetadataJson = await tokenURIFetchResponse.json()
      const tokenURI = tokenURIMetadataJson.image
      tokens.push({value: token, URI: this.state.IPFSbaseURI + tokenURI, openseaURI: this.state.openSeaBaseURI + '/' + this.state.contractAddress + '/' + tokenId})
      console.log("token:", token, tokenId, metadataURL , tokenURI)
    }

    this.setState({ tokens: tokens.reverse() })
  }

  async componentDidMount() {
    console.log("pre isWalletPresent:",  this.state.isWalletPresent)
    try {
    this.checkWalletPresence()
    }
    catch(e) {
      alert(e);
   }
    console.log("post isWalletPresent:", this.state.isWalletPresent)
    if (this.state.isWalletPresent) await this.loadBlockchainData()
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

  mint = (token, ipfsHash) => {
    this.state.contract.methods.mint(token, ipfsHash).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      console.log("Nuovo token:", this.state.IPFSbaseURI + ipfsHash)
      let tokenId = this.state.contract.methods.getTokenId(token).call()
      tokenId.then(
        (id) => {
          this.setState({
            tokens: [{value: token, URI: this.state.IPFSbaseURI + ipfsHash, openseaURI: this.state.openSeaBaseURI + '/' + this.state.contractAddress + '/' + id}, ...this.state.tokens]
          })
          console.log("Tokens post:", this.state.tokens)
        },
      (error) => {
        // As the URL is a valid one, this will not be called.
        console.log('We have encountered an Error!'); // Log an error
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
            <NFTCarousel tokens={this.state.tokens}/>
          </div>
        </div>
        <Social />
      </div>
    );
  }
}

export default App;