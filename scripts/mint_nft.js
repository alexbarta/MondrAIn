
const Web3 = require('web3');
const { setupLoader } = require('@openzeppelin/contract-loader');

const { NFTContract, NFTminter, privateKey, endpoint } = require('./secret_nft.json');
const HDWalletProvider = require('@truffle/hdwallet-provider');

const provider = new HDWalletProvider(privateKey, endpoint);

async function main() {
  // Set up web3 object
  const web3 = new Web3(provider);

  const loader = setupLoader({ provider: web3 }).web3;

  const token = loader.fromArtifact('MondrainERC721', NFTContract);

  const tx = await token.methods.mint('test','test').send({from: NFTminter, value: 50000000000000000, gas: 300000, gasPrice: 300000000000});
  console.log(tx);

  provider.engine.stop();
}

main();