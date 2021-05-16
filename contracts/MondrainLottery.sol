// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.0;

import "./MondrainERC721.sol";
import "./MondrainERC20.sol";

contract MondrainLottery {
    
    MondrainERC721 private erc721;
    MondrainERC20 private erc20;
    uint rewardAmount = 200000;
    address[] winners;
    mapping(address => uint) _wonAmount;
       

    event WinnerDeclared(address winnerAddress, uint tokenId, uint256 timestamp);
    event WinnerRewarded(address winnerAddress, uint tokenAmount, uint256 timestamp);

    constructor (address mondrainERC721Address, address mondrainERC20Address) {
        erc721 = MondrainERC721(mondrainERC721Address);
        erc20 = MondrainERC20(mondrainERC20Address);
    }
    
    function drawWinner() public returns(address) {
        uint _tokenId =  erc721.getRandomTokenId();
        address _owner = erc721.ownerOf(_tokenId);
        emit WinnerDeclared(_owner, _tokenId, block.timestamp);
        return _owner;
    }

    function rewardWinner() public {
        address _winner = drawWinner();
        erc20.mint(_winner, rewardAmount);
        winners.push(_winner);
        _wonAmount[_winner] += rewardAmount;
        emit WinnerRewarded(_winner, rewardAmount, block.timestamp);
    }

}