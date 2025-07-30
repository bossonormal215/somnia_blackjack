// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SomResolver {
    mapping(string => address) public addresses;

    event AddressChanged(string indexed name, address indexed addr);

    function setAddress(string calldata name, address addr) external {
        addresses[name] = addr;
        emit AddressChanged(name, addr);
    }

    function addr(string calldata name) external view returns (address) {
        return addresses[name];
    }
}
