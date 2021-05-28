// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract MondrainERC721 is ERC721URIStorage, AccessControl {
  
  modifier onlyAdmin {
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Not admin");
    _;
  }

  //send minting fee to this address
  address payable private _owner;
  address payable private _lotteryRunner;
  //what people pay on basis 
  uint mintingFee = 0.01 ether;
  uint lotteryFee = 0.001 ether;
  //list minted tokens  
  string[] public tokens;
  //token map
  mapping(string => uint) _tokenId;
  // counter
  uint private counter;

  constructor(address lotteryRunner) public ERC721("mondrain.xyz", "QUADRO") {
    //_setBaseURI("https://ipfs.infura.io/ipfs/");
    _owner = payable(msg.sender);
    _lotteryRunner = payable(lotteryRunner);
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }
  
  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
  
  function mint(string memory _token, string memory _tokenURI) public payable {
    require(msg.value == mintingFee, "Need to send a minting fee");
    bytes memory b = bytes(_token);
    require(testStrLength(_token), "Token length is zero or greater than 4295.");
    require(testStrNonEmptyFirstLastChar(_token), "Token cannot contain empty space at the beginning or at the end.");

    uint _id = uint(keccak256(b));
    _safeMint(msg.sender, _id);
    _setTokenURI(_id, _tokenURI);
    _lotteryRunner.transfer(lotteryFee);
    _owner.transfer(msg.value - lotteryFee);
    tokens.push(_token);
    _tokenId[_token] = _id;
  }

  function setRandomSeed(uint seed) public onlyAdmin {
     counter = seed;
  }

  //TO DO set mintingFee proportionally to amount of token owned
  function setMintingFee(uint amount) public onlyAdmin {
      require(amount > 0, "Amount must be greater than zero!");
      mintingFee = amount;
  }

  function getMintingFee() public view returns(uint) {
      return mintingFee;
  }

  //choose random tokens
  function getRandomTokenId() public returns(uint) {
    require(tokens.length > 0, "No ERC721 tokens have been minted yet.");
    uint randomNumber = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, msg.sender, counter))) % tokens.length;
    counter++;
    string memory _token = tokens[randomNumber]; 
    return _tokenId[_token];
  }

  function totalSupply() public view returns(uint) {
    return tokens.length;
  }

  function getTokenId(string memory _token) public view returns (uint) {
    return _tokenId[_token];
  }

  function testStrLength(string memory str) public pure returns (bool) {
    bytes memory b = bytes(str); 
    if(b.length == 0 || b.length > 4295) return false; //max alphanumeric qrcode chars 4296-1
    return true;
  }

  function testStrNonEmptyFirstLastChar(string memory str) public pure returns (bool) {
    bytes memory b = bytes(str);
    if(b[0] == 0x20 || b[b.length - 1] == 0x20 ) return false; //test first or last char to be non-empty
    return true;
  }

}

