// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// this contract is only used to declare this StorageSlot library
// StorageSlot is used to store implement and owner 
library StorageSlot {
    struct AddressSlot {
        address value;
    }

    function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) {
        assembly {
            r.slot := slot
        }
    }

}
