// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.0;

import "./MondrainERC721.sol";
import "./MondrainERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


contract MondrainLottery is AccessControl, Pausable {

    bytes32 public constant LOTTERY_ADMIN_ROLE = keccak256("BURNER_ROLE");

    modifier onlyAdmin {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Not admin");
        _;
    }

    modifier onlyLotteryAdmin {
        require(hasRole(LOTTERY_ADMIN_ROLE, msg.sender), "Not a lottery admin");
        _;      
    }
    
    MondrainERC721 private erc721;
    MondrainERC20 private erc20;
    uint rewardAmount = 1000;
    address[] winners;
    mapping(address => uint) wonAmount;
       

    event WinnerRewarded(address winnerAddress, uint tokenAmount, uint256 timestamp);

    constructor (address mondrainERC721Address, address mondrainERC20Address) {
        erc721 = MondrainERC721(mondrainERC721Address);
        erc20 = MondrainERC20(mondrainERC20Address);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        grantRole(LOTTERY_ADMIN_ROLE, msg.sender);
    }
    
    function drawWinner() private returns(address) {
        uint _tokenId =  erc721.getRandomTokenId();
        address _owner = erc721.ownerOf(_tokenId);
        return _owner;
    }

    function rewardWinner() public onlyLotteryAdmin whenNotPaused {
        address _winner = drawWinner();
        erc20.mint(address(this), rewardAmount);
        erc20.transfer(_winner, rewardAmount);
        winners.push(_winner);
        wonAmount[_winner] += rewardAmount;
        emit WinnerRewarded(_winner, rewardAmount, block.timestamp);
    }

    function setRewardAmount(uint amount) public onlyAdmin {
        require(amount > 0, "Amount must greater than zero!");
        rewardAmount = amount;
    }

    function getRewardAmount() public view returns(uint){
        return rewardAmount;
    }

    function getOverallWinnedAmount(address winner) public view returns(uint) {
        require(winners.length > 0, "No winners awarded yet.");
        return wonAmount[winner];
    }

    function grantLotteryAdminRole(address newLotteryAdmin) public onlyAdmin {
        grantRole(LOTTERY_ADMIN_ROLE, newLotteryAdmin);
    }

    function revokeLotteryAdminRole(address LotteryAdmin) public onlyAdmin {
        revokeRole(LOTTERY_ADMIN_ROLE, LotteryAdmin);
    }

    function pauseLottery() public onlyAdmin {
        _pause();
    }

    function unpauseLottery() public onlyAdmin {
        _unpause();
    }
}