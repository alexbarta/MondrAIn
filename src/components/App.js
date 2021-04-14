import React, { Component, useState, useEffect } from 'react';
import Navbar from './Navbar';
import TokenMinter from './TokenMinter'
import {getEthAccounts, getNetworkData, getAbi, getContractAddress, getContract, getTotalSupply} from './WalletHandler';
import Mondrian from '../abis/Mondrian.json';
import { getQRBuffer } from './QRcode';


function waitForAccount() {
  console.log("checking account presence:" + window.ethereum._state.accounts)
  if(!window.ethereum._state.accounts[0]) {
     window.setTimeout(waitForAccount, 500); /* this checks the flag every 500 milliseconds*/
  }
}

function checkWindowEthereum() {
  if (!window.ethereum) {
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    return false
  } else {
    return true
  }
}

class App extends Component {


  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      tokens: [],
      buffer: ''
    }
    //this.loadBlockchainData = loadBlockchainData
    this.ethConnection = this.ethConnection.bind(this)
  }

  
  ethConnection = async() => {
    let windowEthereumExists = checkWindowEthereum()
    if(windowEthereumExists) { 
      waitForAccount()
      let accounts = await getEthAccounts()
      this.setState({ account: accounts[0] })
      let networkData = await getNetworkData(Mondrian)
      //console.log("network data:" + networkData)
      if(networkData) {
        let abi = getAbi(Mondrian)
        let contractAddress = getContractAddress(networkData)
        let contract = getContract(abi, contractAddress)
        this.setState({ contract })
        let totalSupply = await getTotalSupply(contract)
        this.setState({ totalSupply })
        //console.log("contract:" + contractAddress)
        for (var i = 1; i <= this.state.totalSupply; i++) {
          const token = await contract.methods.tokens(i - 1).call()
          //console.log(this.state.tokens.indexOf(token))
          if(this.state.tokens.indexOf(token) == -1){
              this.setState({
                tokens: [...this.state.tokens, token]
            })
          }
        console.log("tokens:" + JSON.stringify(this.state.tokens))
        break;
        }
        console.log("contract:" + JSON.stringify(contract.methods))
      } else {
        window.alert('Smart contract not deployed selected Metamask network. Rinkeby only for now :(')
      }
    }
  }


  mint = (token) => {
    this.state.contract.methods.mint(token).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({
        tokens: [...this.state.tokens, token]
      })
    })
  }


  render() {
    console.log("ciao") 

    return (
      <div> 
        <Navbar handler={this.ethConnection} address={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <TokenMinter account={this.state.account} mint={this.mint} />
            <h1>Your Tokens</h1>
            <div className="row text-center">
            { 
            /*  this.state.tokens.map((token, key) => {
            //        //getQRBuffer(token).then(data => this.setState({ buffer: data }))
                    let qr  = await getQRBuffer(token)
                    console.log("nel loop")
              return(
                <div key={key} className="col-md-3 mb-3" includeMargin="true">
                </div>)
          })*/}
          </div>
          </div>
          {/*<div className="row text-center">
            { this.state.tokens.map((token, key) => {
              return(
                <div key={key} className="col-md-3 mb-3">
                  <QRCode value={token}/>
                </div>
              )
            })}
          </div>*/}
        </div>
      </div>
    );
  }
}

//<img src={this.state.buffer} alt="loading"/>

export default App;