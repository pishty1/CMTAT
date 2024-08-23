//SPDX-License-Identifier: MPL-2.0
pragma solidity ^0.8.20;

import "../../../../openzeppelin-contracts-upgradeable/contracts/access/AccessControlUpgradeable.sol";
import "../../../../openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";
import "../../security/AuthorizationModule.sol";

abstract contract RightsModule is Initializable, ContextUpgradeable, AuthorizationModule {
    bytes32 public constant RIGHTS_ROLE = keccak256("RIGHTS_ROLE");
    // an integer that represents the ratio of rights to offered shares e.g. 1:10
    uint256 public first;
    uint256 public second;
    // an integer to hold the price in usdc
    uint256 private pricePerShare;

    function __RightsModule_init_unchained() internal onlyInitializing {
        // nothing to init
    }

    function setRightsRatio(uint256 _first, uint256 _second) public onlyRole(RIGHTS_ROLE) {
        first = _first;
        second = _second;
    }

    function getRightsRatio() public view returns (uint256, uint256) {
        return (first, second);
    }

    function setPricePerShare(uint256 _pricePerShare) public onlyRole(RIGHTS_ROLE) {
        pricePerShare = _pricePerShare;
    }

    function getPricePerShare() public view returns (uint256) {
        return pricePerShare;
    }

    uint256[50] private __gap;
}
