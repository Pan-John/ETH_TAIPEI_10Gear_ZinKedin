//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Company{
    address public owner; 
    uint256 public work_num;
    //mapping(uint256 => string) formWithExp;

    function initialize(uint256 _work_num, string memory _description)public{
        owner = msg.sender;
        string memory description = _description;
        work_num = _work_num;
        //condition_num = _condition_num;
        //createForm(condition_num);
    }

    /*function createForm(uint256 _condition_num) public {
        for (uint i = 0; i < _condition_num; i++) {
            formWithExp[i] = ;
        }
    }*/
    /*
    function getdescription() public returns(string memory _description){
        description = _description;
        return description;
    }*/

    function getWorkNum() public view returns(uint256){
        return work_num;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    } 
    
}