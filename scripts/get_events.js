const Web3 = require('web3');
const { setupLoader } = require('@openzeppelin/contract-loader');

const { lotteryContract, lotteryRunner, privateKey, endpoint } = require('./secret_lottery.json');
const HDWalletProvider = require('@truffle/hdwallet-provider');

const provider = new HDWalletProvider(privateKey, endpoint);

async function main() {
  const web3 = new Web3(provider);

  const loader = setupLoader({ provider: web3 }).web3;

  const address = lotteryContract;
  const token = await loader.fromArtifact('MondrainLottery', address);
  
  const tx = await token.getPastEvents('WinnerRewarded', {fromBlock: 0})
  console.log(tx);

  provider.engine.stop();
}

main();