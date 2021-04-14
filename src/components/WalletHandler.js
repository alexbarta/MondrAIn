import Web3 from "web3"

export const getEthAccounts = async () => {
    return await window.ethereum.request({ method: 'eth_requestAccounts' })
}

export const getNetworkId = async () => {
    return await window.ethereum.request({ method: 'net_version'})
}

export const getNetworkData = async (contractAbi) => {
    let networkId =  await getNetworkId()
    return contractAbi.networks[networkId]
}

export const getAbi = (contractAbi) => {
    return contractAbi.abi
}

export const getContractAddress = (networkData) => {
    return networkData.address
}

export const getContract = (abiCode, address) => {
    web3 = new Web3(window.ethereum);
    return new web3.eth.Contract(abiCode, address)
}

export const getTotalSupply = async (contract) => {
    return await contract.methods.totalSupply().call()
}

/*export const getTokens = async (contract) => {
    return await contract.eth
}*/

/*export const loadBlockchainData = async () => {

    const networkId = await web3.eth.net.getId()
    const networkData = Color.networks[networkId]
    if(networkData) {
      const abi = Color.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      //this.setState({ contract })
      const totalSupply = await contract.methods.totalSupply().call()
      //this.setState({ totalSupply })
      // Load Colors
      for (var i = 1; i <= totalSupply; i++) {
        const color = await contract.methods.colors(i - 1).call()
        this.setState({
          colors: [...this.state.colors, color]
        })
      }
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  };*/