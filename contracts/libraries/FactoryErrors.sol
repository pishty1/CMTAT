//SPDX-License-Identifier: MPL-2.0

pragma solidity ^0.8.20;

library FactoryErrors {
    error CMTAT_Factory_AddressZeroNotAllowedForFactoryAdmin();
    error CMTAT_Factory_AddressZeroNotAllowedForBeaconOwner();
    error CMTAT_Factory_AddressZeroNotAllowedForLogicContract();
}
