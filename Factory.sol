// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 引進合約實例
import "./labor.sol";
//import "./laborProxy.sol";
import "./job_posting_template.sol";
//import "./TransparentProxy.sol";

contract Factory {
    
    // Address of the owner of the factory contract
    address private owner;
    // Address of CV
    address public imple_CV;
    // Address of Vacancy form
    address public imple_Vacan;

    address[] private deployCVAddr;

    address[] private deployVacanAddr;

    event Create_CV(address _contract);
    event Create_Vacan(address _contract);

    event deployCV(address _contract);
    event deployVacan(address _contract);
    
    event Imple_CV_Updated(address newImplementation);  
    event Imple_Vacan_Updated(address newImplementation);  

    event Find(address VacancyAddress);


    constructor(address _imple_CV, address _imple_Vacan) {
        owner = msg.sender;
        imple_CV = _imple_CV;
        imple_Vacan = _imple_Vacan;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }

    function update_CV_Imple(address _newImpl) external onlyOwner {
        require(msg.sender == owner, "Only owner can update implementation");
        require(_newImpl != address(0),"New implementation address cannot be zero.");
        imple_CV = _newImpl;
        emit Imple_CV_Updated(imple_CV);
    }

    function update_Vacan_Imple(address _newImpl) external onlyOwner {
        require(msg.sender == owner, "Only owner can update implementation");
        require(_newImpl != address(0),"New implementation address cannot be zero.");
        imple_Vacan = _newImpl;
        emit Imple_CV_Updated(imple_Vacan);
    }

// 未修改
    function deploy_CV_Proxy() external returns (address) {
        
         // 創建合約實例
        emit Create_CV(address(labor));
        deployCVAddr.push(address(labor));
        return address(labor);
    }

// 未修改
    function deploy_Vacan_Proxy() external returns (address) {
        
         // 創建合約實例
        emit Create_Vacan(address(com));
        deployVacanAddr.push(address(com));
        return address(com);
    }

// 未修改
    function deploy_CV() external returns (address){

        Labor labor = new Labor(imple_CV);
        emit deployCV(address(labor));
        return address(labor);
    }

// 未修改
    function deploy_Vacan() external returns (address){
        Company com = new Company(imple_Vacan);
        emit deployVacan(address(com));
        return address(com);
    }

    function findingVacancy(string _job) external{

        uint256 memory size = deployVacanAddr.length;

        for (uint i = 0; i < size; i++) {
            Company company = new Company(msg.sender);
            address JOB = deployVacanAddr[i];
            uint256 memory job = company.getWorkNum(JOB);
            if (job == _job) {
                emit Find (deployVacanAddr[i]);
            }
        }
    }

}