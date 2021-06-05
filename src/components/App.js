import React, { Component } from 'react';
import {Spinner} from 'react-bootstrap';
import AppErrorModal from './AppErrorModal';
import TopNavbar from './TopNavbar';
import TokenMinter from './TokenMinter';
import Social from './Social';
import NFTCarousel from './NFTCarousel';
import Lottery from './Lottery';
import {getEthAccounts, getNetworkData, getAbi, getContractAddress, getContract, getTotalSupply} from './WalletHandler';
import MondrainERC721 from '../abis/avax/MondrainERC721.json';
import MondrainLottery from '../abis/avax/MondrainLottery.json';
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
      contractLottery: '',
      contractERC721: null,
      contractAddressERC721: '',
      totalSupplyERC721: 0,
      tokens: [],
      IPFSBaseURL: 'https://ipfs.infura.io/ipfs/',
      //openSeaBaseURL: 'https://testnets.opensea.io/assets/mumbai',
      explorerBaseURL: 'https://cchain.explorer.avax-test.network',
      numberOfCarouselSlides: 4,
      lotteryWinners: []
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
      console.log("wallet presence")
      this.setState({ isWalletPresent : false, showWalletIsNotPresent: true})
    }
  }

  loadBlockchainData = async () => { 
    const networkDataERC721 = await getNetworkData(MondrainERC721)
    const networkDataLottery = await getNetworkData(MondrainLottery)
    console.log(networkDataERC721, networkDataLottery)
    if(!networkDataERC721 || !networkDataLottery) {
        this.setState({ isWrongNetwork : true , showIsWrongNetwork: true})
        return false
    }
    const abiERC721 = getAbi(MondrainERC721)
    const contractAddressERC721 = getContractAddress(networkDataERC721)
    const contractERC721 = getContract(abiERC721, contractAddressERC721)
    const totalSupplyERC721 = await getTotalSupply(contractERC721)
    const abiLottery = getAbi(MondrainLottery)
    const contractAddressLottery = getContractAddress(networkDataLottery)
    const contractLottery = getContract(abiLottery, contractAddressLottery)    
    this.setState({ contractAddressERC721: contractAddressERC721, contractERC721: contractERC721, totalSupplyERC721: totalSupplyERC721, contractLottery: contractLottery })
    // console.log("contractERC721:" + contractAddressERC721)
    // console.log("totalSupplyERC721:" + totalSupplyERC721)
    // console.log("contractLottery:" + contractLottery)

    return true
  };

  loadIPFSImageData = async () => {
    var tokens = []
    for (var i = this.state.totalSupplyERC721 - Math.min(this.state.numberOfCarouselSlides, this.state.totalSupplyERC721) + 1 ; i <= this.state.totalSupplyERC721; i++) { //show last numberOfSlides 
      const token = await this.state.contractERC721.methods.tokens(i - 1).call()
      const tokenId = await this.state.contractERC721.methods.getTokenId(token).call()
      const metadataURL = await this.state.contractERC721.methods.tokenURI(tokenId).call()
      const tokenURIFetchResponse = await fetch(metadataURL)
      try {
          const tokenURIMetadataJson = await tokenURIFetchResponse.json()
          const tokenURI = tokenURIMetadataJson.image
          tokens.push({value: token, URI: this.state.IPFSBaseURL + tokenURI, explorerURL: this.state.explorerBaseURL + '/tokens/' + this.state.contractAddressERC721 + '/instance/' + tokenId})
          console.log("token:", token, tokenId, metadataURL , tokenURI)
      } catch(err) {
          console.error("Error fetching from IPFS tokenId:", tokenId)
      }
      this.setState({ tokens: tokens.reverse() })
    }
  }

  loadRewardedWinners = async () => {
    const winners = await this.state.contractLottery.getPastEvents('WinnerRewarded',  { fromBlock: 0, toBlock: 'latest' })
    this.setState({ lotteryWinners: winners })
  }

  async componentDidMount() {
    this.checkWalletPresence()
    if (window.ethereum) await this.loadBlockchainData()
    if (this.state.contractERC721 && this.state.totalSupplyERC721 > 0) await this.loadIPFSImageData()
    await this.loadRewardedWinners()
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
          text={["Currently, this website only operates with a dedicated blockchain testnet. ", <a href='https://docs.matic.network/docs/develop/metamask/testnet/' target='_blank'> Please configure Matic Mumbai testnet on your wallet</a>]}/>
        <TopNavbar handler={this.getAccount} address={this.state.account}/>
        <TokenMinter isWalletConnected={this.state.isWalletConnected} 
          contractERC721={this.state.contractERC721}
          account={this.state.account} 
          explorerURL={this.state.explorerBaseURL + '/tokens/' + this.state.contractAddressERC721 + '/instance/'} 
          IPFSBaseURL={this.state.IPFSBaseURL} />
         {this.state.tokens < Math.min(this.state.totalSupplyERC721, this.state.numberOfCarouselSlides) ? <div className="d-flex justify-content-center" style={{ height: '1000px' }}>
           <Spinner animation="border" role="status"/>
           </div> : <NFTCarousel tokens={this.state.tokens}/>}
        <Lottery winners={this.state.lotteryWinners}/>
        <Social explorerURL={this.state.explorerBaseURL} contractAddressERC721={this.state.contractAddressERC721}/>
      </div>
    );
  }
}

export default App;