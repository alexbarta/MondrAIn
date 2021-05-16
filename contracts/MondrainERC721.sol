// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract MondrainERC721 is ERC721URIStorage {
      
  address payable private _owner;
  uint mintingFee = 0.0001 ether;
  string[] public tokens;
  mapping(string => uint) _tokenId;

  constructor() public ERC721("mondrain.xyz", "QUADRO") {
    //_setBaseURI("https://ipfs.infura.io/ipfs/");
    _owner = payable(msg.sender);
  }
  
  function mint(string memory _token, string memory _tokenURI) public payable {
    require(msg.value == mintingFee, "Need to send a minting fee");
    bytes memory b = bytes(_token);
    require(b.length > 0, "Token cannot be empty.");
    require(testStrLength(_token), "Token length is greater than 4295." );
    require(testStrNonEmptyFirstLastChar(_token), "Token cannot contain empty space at the beginning or at the end.");

    uint _id = uint(keccak256(b));
    _safeMint(msg.sender, _id);
    _setTokenURI(_id, _tokenURI);
    _owner.transfer(msg.value);
    tokens.push(_token);
    _tokenId[_token] = _id;
  }

  //TO DO set mintingFee
  // function setMintingFee() public onlyAdmin {

  // }

  //TO DO create randomness
  function getRandomTokenId() view public returns(uint) {
    require(tokens.length > 0, "No ERC721 tokens have been minted yet.");
    string memory _token = tokens[0]; //not very random :D 
    return _tokenId[_token];
  }

  function test() view public returns (uint) {
    return mintingFee;
  }

  function totalSupply() view public returns(uint) {
    return tokens.length;
  }

  function getTokenId(string memory _token) public view returns (uint) {
    return _tokenId[_token];
  }

  function testStrLength(string memory str) public pure returns (bool) {
    bytes memory b = bytes(str); 
    if(b.length > 4295) return false; //max alphanumeric qrcode chars 4296-1
    return true;
  }

  function testStrNonEmptyFirstLastChar(string memory str) public pure returns (bool) {
    bytes memory b = bytes(str);
    if(b[0] == 0x20 || b[b.length - 1] == 0x20 ) return false; //test first or last char to be non-empty
    return true;
  }

}

