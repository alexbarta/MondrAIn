pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Mondrian is ERC721 {
  string[] public tokens;
  mapping(string => bool) _tokenExists;

  constructor() public ERC721("Stijl", "STIJL") {}
  
  // E.G. color = "#FFFFFF"
  function mint(string memory _token) public {
    require(!_tokenExists[_token]);
    uint _id = uint(keccak256(bytes(_token)));
    tokens.push(_token);
    _mint(msg.sender, _id);
    _tokenExists[_token] = true;
  }

}