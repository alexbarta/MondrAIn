let MondrainERC721 = artifacts.require("MondrainERC721");
let MondrainERC20 = artifacts.require("MondrainERC20");
let MondrainLottery = artifacts.require("MondrainLottery");

module.exports = async(deployer) => {
  await deployer.deploy(MondrainERC721);
  await deployer.deploy(MondrainERC20);
  await deployer.deploy(MondrainLottery, MondrainERC721.address, MondrainERC20.address);
};