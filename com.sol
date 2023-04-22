//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;


// this contract is for company to issue a hiring info. and let labors to apply
contract Company{
    address public owner;// should be company's address that issues this info
    string public job_title; 
    string public description;
    //mapping(uint256 => string) formWithExp;
    mapping (address applier => address cv_address ) public applications; // stores applier's applications


    // For companies to issue hiring info.
    function initialize(string memory _job_title, string memory _description)public{
        owner = msg.sender;
        description = _description;
        job_title = _job_title;
        //condition_num = _condition_num;
        //createForm(condition_num);
    }

    // For company to return appliers' applications
    function getApplications(address _cv_address) public returns (address[] memory, address[] memory){

    }
    


    /*function createForm(uint256 _condition_num) public {
        for (uint i = 0; i < _condition_num; i++) {
            formWithExp[i] = ;
        }
    }*/


    // UI functions:
    // to see the job title and descriptions
    function getJobTitle() public view returns(string memory _job_title){
        return job_title;
    }

    function getdescription() public view returns(string memory _description){
        return description;
    }

    function ApplyForJob(address _cv_address) public{
        applications[msg.sender] = _cv_address;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    } 
    
}
