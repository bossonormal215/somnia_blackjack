// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SomRegistry {
    event NameRegistered(
        string indexed name,
        address indexed owner,
        uint256 expires,
        string metadata
    );
    event NameRenewed(string indexed name, uint256 expires);
    event NameTransferred(string indexed name, address indexed newOwner);
    event MetadataUpdated(string indexed name, string metadata);
    event PriceChanged(uint256 newPrice);
    event Withdrawn(address indexed to, uint256 amount);

    struct NameRecord {
        address owner;
        address resolver;
        uint256 expires;
        string metadata;
    }

    mapping(string => NameRecord) public records;
    mapping(address => string[]) public ownerToNames;

    uint256 public constant DURATION = 365 days;
    uint256 public price = 1 ether;
    address public admin;

    modifier onlyOwner(string memory name) {
        require(records[name].owner == msg.sender, "Not owner");
        _;
    }
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function setPrice(uint256 newPrice) external onlyAdmin {
        price = newPrice;
        emit PriceChanged(newPrice);
    }

    function withdraw(address payable to) external onlyAdmin {
        uint256 bal = address(this).balance;
        require(bal > 0, "No funds");
        to.transfer(bal);
        emit Withdrawn(to, bal);
    }

    function register(
        string calldata name,
        address resolver,
        string calldata metadata
    ) external payable {
        require(records[name].expires < block.timestamp, "Name not expired");
        require(msg.value >= price, "Insufficient fee");
        records[name] = NameRecord(
            msg.sender,
            resolver,
            block.timestamp + DURATION,
            metadata
        );
        ownerToNames[msg.sender].push(name);
        emit NameRegistered(name, msg.sender, records[name].expires, metadata);
    }

    function renew(string calldata name) external payable onlyOwner(name) {
        require(records[name].expires >= block.timestamp, "Name expired");
        require(msg.value >= price, "Insufficient fee");
        records[name].expires += DURATION;
        emit NameRenewed(name, records[name].expires);
    }

    function transfer(
        string calldata name,
        address newOwner
    ) external onlyOwner(name) {
        // Remove name from current owner's list
        _removeNameFromOwner(msg.sender, name);
        // Add name to new owner's list
        ownerToNames[newOwner].push(name);
        records[name].owner = newOwner;
        emit NameTransferred(name, newOwner);
    }

    function setResolver(
        string calldata name,
        address resolver
    ) external onlyOwner(name) {
        records[name].resolver = resolver;
    }

    function setMetadata(
        string calldata name,
        string calldata metadata
    ) external onlyOwner(name) {
        records[name].metadata = metadata;
        emit MetadataUpdated(name, metadata);
    }

    function ownerOf(string calldata name) external view returns (address) {
        return records[name].owner;
    }

    function resolverOf(string calldata name) external view returns (address) {
        return records[name].resolver;
    }

    function expiresAt(string calldata name) external view returns (uint256) {
        return records[name].expires;
    }

    function metadataOf(
        string calldata name
    ) external view returns (string memory) {
        return records[name].metadata;
    }

    function getNamesOfOwner(
        address owner
    ) external view returns (string[] memory) {
        return ownerToNames[owner];
    }

    function _removeNameFromOwner(address owner, string memory name) internal {
        string[] storage names = ownerToNames[owner];
        for (uint256 i = 0; i < names.length; i++) {
            if (keccak256(bytes(names[i])) == keccak256(bytes(name))) {
                names[i] = names[names.length - 1];
                names.pop();
                break;
            }
        }
    }
}
