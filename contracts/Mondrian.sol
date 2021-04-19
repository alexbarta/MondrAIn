pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Mondrian is ERC721 {
  string[] public tokens;
  mapping(string => uint) _tokenId;

  constructor() public ERC721("Stijl", "STIJL") {}
  
  // E.G. color = "#FFFFFF"
  function mint(string memory _token, string memory _tokenURI) public {
    uint _id = uint(keccak256(bytes(_token)));
    _safeMint(msg.sender, _id);
    _setTokenURI(_id, _tokenURI);
    tokens.push(_token);
    _tokenId[_token] = _id;
  }
  
  function getTokenId(string memory _token) public view returns(uint) {
    return _tokenId[_token];
  }
}