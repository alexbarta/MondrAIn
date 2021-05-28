let MondrainERC721 = artifacts.require("MondrainERC721");
let MondrainERC20 = artifacts.require("MondrainERC20");
let MondrainLottery = artifacts.require("MondrainLottery");
const lotteryRunner = '0xB1e6dc2bCc85780E208a168d5E961542c4963a80';


module.exports = async(deployer) => {
  await deployer.deploy(MondrainERC721, lotteryRunner);
  await deployer.deploy(MondrainERC20);
  await deployer.deploy(MondrainLottery, MondrainERC721.address, MondrainERC20.address);
};