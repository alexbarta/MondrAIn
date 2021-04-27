import Web3 from 'web3'

export const getEthAccounts = async () => {
  return await window.ethereum.request({ method: 'eth_requestAccounts' })
}

export const getNetworkId = async () => {
  return await window.ethereum.request({ method: 'net_version' })
}

export const getNetworkData = async (contractAbi) => {
  const networkId = await getNetworkId()
  return contractAbi.networks[networkId]
}

export const getAbi = (contractAbi) => {
  return contractAbi.abi
}

export const getContractAddress = (networkData) => {
  return networkData.address
}

export const getContract = (abiCode, address) => {
  web3 = new Web3(window.ethereum)
  return new web3.eth.Contract(abiCode, address)
}

export const getTotalSupply = async (contract) => {
  return await contract.methods.totalSupply().call()
}
