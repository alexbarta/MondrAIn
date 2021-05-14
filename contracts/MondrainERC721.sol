// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.0;

//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


contract MondrainERC721 is ERC721URIStorage, AccessControl {
    
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  // bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
  
  string[] public tokens;
  mapping(string => uint) _tokenId;

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
  }

  constructor(address mondrainERC721Sale) public ERC721("quadro", "QUADRO") {
    //_setBaseURI("https://ipfs.infura.io/ipfs/");
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    grantRole(MINTER_ROLE, msg.sender);
    grantRole(MINTER_ROLE, mondrainERC721Sale);
  }
  
  
  
  function mint(string memory _token, string memory _tokenURI) public {
    require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
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

