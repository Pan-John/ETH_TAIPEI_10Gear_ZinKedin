// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract CV_Template{
    address public owner;
    bool public isInitialized=false;
    string[] public EXPERIENCE;
    string[] public showlist;
    address[] public NFTIhave;
    uint256 public index = 0;
    mapping(uint256=>bool) public show;
    mapping(address=>uint256) map;
    mapping(address=>string) companyEmail;
    function initialize(address _applier_address)public{
        require(!isInitialized, "already initialized");
        // once it's initialize, set isInitialized = true and owner = company's address
        isInitialized = true;
        owner = _applier_address;
    }

    function AddExperience(address company, string memory experience) external {
        EXPERIENCE.push(experience);
        map[company] = index;
        index++;
    }

    function Verify() external {
        show[map[msg.sender]] = true;
    }

    function AddNFT(address NFT) external {
        NFTIhave.push(NFT);
    }

    function ShowNFT() public view returns(address[] memory){
        return NFTIhave;
    }

    function TakeRSAprivateKey(string memory emailAddress) external {
        companyEmail[msg.sender] = emailAddress;
    }

    function ShowCompanyEmail(address company) external view returns(string memory){
        return companyEmail[company];
    }

    function ShowExperience() external returns(string[] memory){
        
        for(uint i = 0; i < index; i++){
            if(show[i]){
                bytes memory str_b = abi.encodePacked(EXPERIENCE[i], " ", "V");
                string memory str = string(bytes.concat(str_b));
                showlist.push(str);
            }
            else{
                bytes memory str_b = abi.encodePacked(EXPERIENCE[i], " ", "X");
                string memory str = string(bytes.concat(str_b));
                showlist.push(str);
            }
            
        }
        return showlist;
    }


}
