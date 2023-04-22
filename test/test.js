const { expect } = require("chai");

describe("Factory", function(){
    this.beforeEach(async function(){
        // Get the owner, user and newImp signers
        [owner, user, imple_CV, imple_Vacan] = await ethers.getSigners();
        // Get the Factory contract factory
        Factory = await ethers.getContractFactory("Factory");
        // Deploy an instance of the Factory contract with the owner address as the constructor argument
        factory = await Factory.connect(owner).deploy(imple_CV.address, imple_Vacan.address);
    });

    // Check if the Factory contract is deployed with the correct owner
    describe("deployment", function () {
        it("should deploy Factory contract with correct owner", async function() {
            expect(await factory.owner()).to.equal(owner.address);
        });
    });

    describe("deploy Vacancy Template", async function () {
        it("the owner of new Vacancy contract is the caller of deployVacan", async function() {
            // Call the deploySafe function using the user account
            await factory.connect(user).deploy_Vacan();

            // Get the address of the newly deployed Safe contract
            VACAN_ADDRESS = await factory.deploy_Vacan();

            // Get the instance of the Safe contract using its address
            const VACAN = await ethers.getContractAt("Vacancy_Template", VACAN_ADDRESS);

            // Get the owner of the newly deployed Safe contract
            const VACAN_owner = await VACAN.owner();

            // Check if the owner of the new Safe contract is the caller of deploySafe
            expect(VACAN_owner == user.address);

            // this ain't right cuz when calling deploysafe, will also deploy a Safe contract instead of using factory
            // just a reminder for myself
            //await Factory.connect(owner).deploySafe();
            //Safe = await ethers.getContractFactory("Safe");
            //safe = await Safe.deploy(owner.address);
            //expect(await safe.owner()).to.equal(owner.address);  
        });
    });

    // as sama as deploySafe
    describe("deployCV", function () {
        it("the owner of new CV_template contract is the caller of deploy_CV", async function() {
            await factory.connect(user).deploy_CV();
            CV_ADDRESS=await Factory.deploy_CV();
            const CV = await ethers.getContractAt("SafeProxy",CV_ADDRESS);
            const SafeProxy_owner = await CV.owner();
            expect(SafeProxy_owner == user.address);
        });
    })
    describe("deployCV", function () {
        it("the owner of new CV_template contract is the caller of deploy_CV", async function() {
            await factory.connect(user).deploy_CV();
            CV_ADDRESS=await Factory.deploy_CV();
            const CV = await ethers.getContractAt("SafeProxy",CV_ADDRESS);
            const SafeProxy_owner = await CV.owner();
            expect(SafeProxy_owner == user.address);
        });
    })
/*
    describe("updateImplementation", function () {
        // Call updateImplementation function from user account and expect it to revert
        it("should not allow non-owner to update implementation", async function(){
            await expect(Factory.connect(user).updateImplementation(safe.address)).to.be.revertedWith("NOT owner!");
        });

        it("should allow owner to update implementation", async function(){
            // Call updateImplementation function from owner account to update the implementation of Factory contract
            await Factory.connect(owner).updateImplementation(safe.address);

            // Verify that the implementation has been updated
            expect(await Factory.safe_address()).to.equal(safe.address);
        });
    })
    */
})

describe("CV_Template",function(){

});


describe("Vacancy_Template", function(){
    this.beforeEach(async function(){
        [company, applier1, cv1, applier2, cv2] = await ethers.getSigners();
        Vacancy_Template = await ethers.getContractFactory("Vacancy_Template");
        vacancy_template = await Vacancy_Template.deploy();  
        await vacancy_template.connect(company).initialize(company.address,"engineer");
        await vacancy_template.connect(company).AddDiscription("description1");
        await vacancy_template.connect(company).AddDiscription("description2");
    });

    describe("deployment", function () {
        it("should deploy Vacancy_Template contract with correct owner and jobTitle", async function() {
            expect(await vacancy_template.owner()).to.equal(company.address);
            expect(await vacancy_template.getJobTitle()).to.equal("engineer");
        });
    });

    describe("Appliers prospect:", function(){
        it("should get correct job Descriptions", async function() {
            expect(vacancy_template.DESCRIPTION[1]=="description1");
            expect(vacancy_template.DESCRIPTION[2]=="description2");
        });
        
        it("should be able to ApplyForJob and have CV address record in APPLICATIONS correctly", async function() {
            await vacancy_template.connect(applier1).ApplyForJob(cv1.address);
            await vacancy_template.connect(applier2).ApplyForJob(cv2.address);
            expect(vacancy_template.connect(company).getApplications==cv1.address,cv2.address);
            /*
            it("just change the existing cv contract to new one if applier already applied ", async function() {
                
            });
            it("record new applier & cv contract address and give applier an ID if applier is new", async function() {
                
            });
            */
        });


    })

    
});
//////////
describe("Vacancy_Proxy", function () {
    this.beforeEach(async function(){
        [company, user, newimp] = await ethers.getSigners();
        Vacancy_Template = await ethers.getContractFactory("Vacancy_Template");
        vacancy_template = await Vacancy_Template.deploy();  
        await vacancy_template.connect(company).initialize(company.address,"engineer");

        Vacancy_Proxy= await ethers.getContractFactory("Vacancy_Proxy");
        vacancy_proxy = await Vacancy_Proxy.deploy(company.address,vacancy_template.address);  
    });

    describe("deployment", function () {
        it("should deploy Vacancy_Proxy contract with correct owner", async function() {
            expect(await vacancy_proxy._getOwner()).to.equal(company.address);
        });

        it("should point to an implement contract", async function() {
            expect(await vacancy_proxy._getImplementation()).to.equal(vacancy_template.address);
        });
    });

    // test delegate call
    describe("Companies prospect (delegatecall):", function(){
        // check if delegate call can initialize the implemetation, the current implementation is vacancy_template
        // it's worth mentioned that array isn'table to set as ABI, so I change it into a function
        it("proxy delegatecall to 1.initialize implementaion 2.ensure owner and jobTitle is right 3.AddDiscription 4.check if DESCRIPTION is right", async function(){
            await vacancy_proxy.setImplementation(vacancy_template.address);

            // Set ABI for Vacancy_Proxy and Vacancy_Template contracts
            const abi=["function initialize(address _company_address, string memory _job_title)public",
                       "function _getOwner() public view returns (address)",
                       "function getJobTitle() public view returns(string memory _job_title)",
                       "function AddDiscription(string memory _condidtion) public", // delete onlyOwner
                       "function DESCRIPTION(uint256) public view returns (string)"];

            // Create a proxied contract with Vacancy_Proxy address and abi
            const proxied = new ethers.Contract(vacancy_proxy.address, abi, company);
            // Call initialize function on proxied contract
            await proxied.initialize(company.address, "engineer") 
            // ensure the proxied owner is the caller
            expect (await proxied._getOwner()).to.eq(company.address);
            //ensure jobTitle is set right
            expect (await proxied.getJobTitle()).to.eq("engineer");
            //test AddDiscription
            await proxied.AddDiscription("discription1");
            await proxied.AddDiscription("discription2");
            expect (await proxied.DESCRIPTION[1]=="discription1");
            expect (await proxied.DESCRIPTION[2]=="discription2");
        });
    });

/*
    describe("update",function(){
        // ensure non-owner cannot upgrade the implementation of the proxy.
        it("non-Owner won't able to upgrade implementaion of proxy",async function(){
            await expect(vacancy_proxy.connect(user).upgradeTo(newimp.address)).to.be.revertedWith("NOT owner!");
        });

        // ensure the new implementation must be a contract address.
        it("new implementation should be a contact",async function(){
            //use a 0 address to test
            await expect(vacancy_proxy.connect(owner).upgradeTo("0x0000000000000000000000000000000000000000")).to.be.revertedWith("implementation is not contract");
        });

        // ensure the owner can successfully upgrade the implementation of the proxy.
        it("Owner should be able to upgrade implementaion of proxy",async function(){
            await vacancy_proxy.connect(owner).upgradeTo(safeupgradeable_v2.address);
            expect(await vacancy_proxy._getImplementation()).to.equal(safeupgradeable_v2.address);
        });

    });
*/
});
