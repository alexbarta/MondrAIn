const MondrainERC721 = artifacts.require("MondrainERC721");

module.exports = function (deployer) {
  deployer.deploy(MondrainERC721);
};
