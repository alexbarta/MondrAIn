// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Mondrian is ERC721 {
  
  string[] public tokens;
  mapping(string => uint) _tokenId;

  constructor() public ERC721("Stijl", "STIJL") {}
  
  function mint(string memory _token, string memory _tokenURI) public {
    bytes memory b = bytes(_token);
    require(b.length > 0, "Token cannot be empty.");
    //test string length
    require(testStrLength(_token), "Token length is greater than 4295." );
    //test for empty chars
    require(testStrNonEmptyFirstLastChar(_token), "Token cannot contain empty space at the beginning or at the end.");
    //create id 
    uint _id = uint(keccak256(b));
    //mint token
    _safeMint(msg.sender, _id);
    //set metadata URI
    _setTokenURI(_id, _tokenURI);
    //save token into array
    tokens.push(_token);
    //save token id
    _tokenId[_token] = _id;
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

