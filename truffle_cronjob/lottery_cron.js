
const Web3 = require('web3');
const { setupLoader } = require('@openzeppelin/contract-loader');

const { lotteryContract, lotteryRunner, privateKey, endpoint } = require('./secret.json');
const HDWalletProvider = require('@truffle/hdwallet-provider');

const provider = new HDWalletProvider(privateKey, endpoint);

async function main() {
  // Set up web3 object
  const web3 = new Web3(provider);

  const loader = setupLoader({ provider: web3 }).web3;

  // Set up a web3 contract, representing a deployed ERC20, using the contract loader
  const address = lotteryContract;
  const token = loader.fromArtifact('MondrainLottery', address);

  const tx = await token.methods.rewardWinner().send({from: lotteryRunner});
  console.log(tx);

  provider.engine.stop();
}

main();