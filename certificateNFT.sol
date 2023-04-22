// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CertificateNFT is Ownable, ERC721 {

    event YouAreCertificate(address newCertificate);
    uint256 id = 0;
    mapping (address => bool) public whiteList;
    mapping(uint256 => bool) private _transfersDisabled;
    constructor() ERC721("CERTIFICATE", "CERTIFICATE") {}

    function setwhiteList(address studentId) onlyOwner public onlyOwner{
        whiteList[studentId] = true;
    }
    function mint() public{
        require( whiteList[msg.sender] == true, "you're not permitted");
        _safeMint(msg.sender, id);
        emit YouAreCertificate(msg.sender);
        _transfersDisabled[id] = true;
        id++;
    }
    function checkWhiteList()public view returns(string memory){
        if(whiteList[msg.sender] == true) return ("You are in the whiteList!");
        else{
            return("You ane NOT in the whiteList!");
        }
    }
    /////////////////////////
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        require(!_transfersDisabled[tokenId], "Transfer disabled");
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        require(!_transfersDisabled[tokenId], "Transfer disabled");
        super.safeTransferFrom(from, to, tokenId);
    }
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public override {
        require(!_transfersDisabled[tokenId], "Transfer disabled");
        super.safeTransferFrom(from, to, tokenId, _data);
    }

    function disableTransfer(uint256 tokenId) public onlyOwner{
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the token owner");
        _transfersDisabled[tokenId] = true;
    }
}