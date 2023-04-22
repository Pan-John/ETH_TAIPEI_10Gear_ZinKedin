//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
// this is a logic contract for company to issue a hiring info and let labors to deliver there appliocations
contract Vacancy_Template {
    // should be company's address that issues this info
    address public owner;
    bool public isInitialized=false;

    string private job_title;
    // stores descriptions 1./2./3. ...
    string[] public DESCRIPTION; 
    //uint256 private description_index;
    uint256 private numOfDescription;
    uint256 public numOfApplications; 

    // stores cv contracts' addresses
    address[] private APPLICATIONS;
    // stores appliers' addresses
    address[] private APPLIERS;
    //stores applier's idea
    mapping (address => uint256)  APPLIER_ID;

    // For companies to issue hiring info, incuding job title and set num of descriptions,
    // the excact descriptions is set in `function AddDiscription`
    function initialize(address _company_address, string memory _job_title)public{
        require(!isInitialized, "already initialized");
        // once it's initialize, set isInitialized = true and owner = company's address
        isInitialized = true;
        owner = _company_address;

        job_title = _job_title;
        //numOfDescription = _numOfDescription;
        //description_index=0;
        numOfApplications=0;
    }
    
    // for companies to set discription of this job vacancy
    function AddDiscription(string memory _condidtion) public onlyOwner{ 
        //require(description_index < numOfDescription,"exceeds the description num limit!");
        DESCRIPTION.push(_condidtion);
        //description_index++;
    }

    // For company to return appliers' applications
    function getApplications() public view onlyOwner returns (address[] memory) { 
        return APPLICATIONS;
    }


    // applier functions:
    function getJobTitle() public view returns(string memory _job_title){
        return job_title;
    }

    function getDescription() public view returns(string[] memory _description){
        return DESCRIPTION;
    }

    // for applier to apply for this job
    function ApplyForJob(address _cv_address) public{
        // check if applier already applied
        if(APPLIER_ID[msg.sender]!=0){
            // just change the existing cv contract to new one
            APPLICATIONS[APPLIER_ID[msg.sender]-1] = _cv_address;
        }
        else{
            // push new applier and cv contract address, and give applier an ID
            APPLIERS.push(msg.sender);
            APPLICATIONS.push(_cv_address);
            numOfApplications++;
            APPLIER_ID[msg.sender] = numOfApplications;
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    } 
    
}
