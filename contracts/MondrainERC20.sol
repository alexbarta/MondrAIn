// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract MondrainERC20 is ERC20Capped, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    uint256 maxTokens = 10000000000 * (10 ** 18); //10 billion tokens

    modifier onlyAdmin {
       require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Not admin");
       _;
    }

    modifier onlyMinter {
       require(hasRole(MINTER_ROLE, msg.sender), "Not admin");
       _;
    }

    modifier onlyBurner {
       require(hasRole(BURNER_ROLE, msg.sender), "Not admin");
       _;
    }

    constructor() public ERC20("mondrain", "MAI") ERC20Capped(maxTokens) {
        // Grant the contract deployer the default admin role: it will be able
        // to grant and revoke any roles
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        grantRole(MINTER_ROLE, msg.sender);
        grantRole(BURNER_ROLE, msg.sender);
    }

    function mint(address to, uint256 amount) public onlyMinter {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public onlyBurner {
        _burn(from, amount);
    }

    function grantMinterRole(address newMinter) public onlyAdmin {
        grantRole(MINTER_ROLE, newMinter);
    }
    
    function grantBurnerRole(address newBurner) public onlyAdmin {
        grantRole(BURNER_ROLE, newBurner);
    }

    function revokeMinterRole(address minter) public onlyAdmin {
        revokeRole(MINTER_ROLE, minter);
    }
    
    function revokeBurnerRole(address burner) public onlyAdmin {
        revokeRole(BURNER_ROLE, burner);
    }

}