// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./Vacancy_Template.sol";
import "./Vacancy_Proxy.sol";
import "./CV_Template.sol";
import "./CV_Proxy.sol";
// this is a factory contact that belongs to ZinKedin, other companies or job-seekers can use function to delploy contract.
contract Factory{

    address public owner;
    constructor(){
        owner=msg.sender;
    }

    address public vacancy_template_address; 
    address public vacancy_proxy_address;
    address public cv_template_address; 
    address public cv_proxy_address;

    // jobTitle => vacancy_address
    mapping(string => address[]) public JOB_POOL;

    function deployVacancyTemplate(string memory _jobTitle)public returns(address) {
        Vacancy_Template vacancy_template = new Vacancy_Template();
        vacancy_template_address=address(vacancy_template);
        // initialize the new vacancy contract
        vacancy_template.initialize(msg.sender,_jobTitle);
        // categorize the new vacancy contract
        JOB_POOL[_jobTitle].push(vacancy_template_address);
        return address(vacancy_template);
    }    

    function deployVacancyProxy()public returns(address){
        Vacancy_Proxy vacancy_proxy = new Vacancy_Proxy(msg.sender,vacancy_template_address);
        vacancy_proxy_address=address(vacancy_proxy);
        return address(vacancy_proxy);
    }

    function updateVacancyTemplate(address newImp) public{
        // only owner can update
        require(msg.sender==owner,"NOT owner!");
        vacancy_template_address=newImp;
    }

    function deployCVTemplate()public returns(address) {
        CV_Template cv_template = new CV_Template();
        cv_template_address=address(cv_template);
        return address(cv_template);
    }    

    function deployCVProxy()public returns(address){
        CV_Proxy cv_proxy = new CV_Proxy(msg.sender,cv_template_address);
        cv_proxy_address=address(cv_proxy);
        return address(cv_proxy);
    }

    function updateCVTemplate(address newImp) public{
        // only owner can update
        require(msg.sender==owner,"NOT owner!");
        cv_template_address=newImp;
    }

    // for job-seekers to find vacancies, here we assume there's only three job in the world,
    // which is dev, trader, auditor
    function findingVacancy(string memory _jobTitle) view external returns(address[] memory){
        return JOB_POOL[_jobTitle];
    }


/*
    function findingVacancy(string memory _jobTitle) external{

        uint256 size = deployVacanAddr.length;

        for (uint i = 0; i < size; i++) {
            address JOB = deployVacanAddr[i];
            
            Vacancy_Template vacancy = Vacancy_Template(JOB);
            vacancy.initialize(msg.sender,_job);
            
            string memory job = vacancy.getJobTitle();
            if (compareStrings(job, _job)) {
                emit Find (deployVacanAddr[i]);
            }
        }
    }

    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
*/
}
