// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Labor{
    string[] public experiences;
    string[] public showlist;
    address[] public NFTIhave;
    uint256 public index = 0;
    mapping(uint256=>bool) public show;
    mapping(address=>uint256) map;
    function Add(address company, string memory experience) external {
        experiences.push(experience);
        map[company] = index;
        index++;
    }

    function Verify() external {
        show[map[msg.sender]] = true;
    }


    function ShowExperience() external returns(string[] memory){
        
        
        for(uint i = 0; i < index; i++){
            if(show[i]){
                bytes memory str_b = abi.encodePacked(experiences[i], " ", "V");
                string memory str = string(bytes.concat(str_b));
                showlist.push(str);
            }
            else{
                bytes memory str_b = abi.encodePacked(experiences[i], " ", "X");
                string memory str = string(bytes.concat(str_b));
                showlist.push(str);
            }
            
        }
        return showlist;
    }

    function AddNFT(address NFT) external {
        NFTIhave.push(NFT);
    }

    function ShowNFT() public view returns(address[] memory){
        return NFTIhave;
    }


}