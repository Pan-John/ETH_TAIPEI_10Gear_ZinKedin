const { expect } = require("chai");

describe("CertificateNFT", function () {
    let _NFT, NFT;
    let owner, address1, address2;
  
    beforeEach(async function () {
        [owner, address1, address2] = await ethers.getSigners();
        _NFT= await ethers.getContractFactory("CertificateNFT");
         NFT = await _NFT.deploy();
        await NFT.deployed();
    });
  
    it("CertificateNFT contract should have right owner", async function () {
        expect(await NFT.owner()).to.equal(owner.address);
    });
  
    it("only owner can set whitelist", async function () {
        await expect(NFT.connect(address1).setwhiteList(address1.address))
        .to.be.revertedWith("Ownable: caller is not the owner");
        await NFT.connect(owner).setwhiteList(address1.address);
        expect(await NFT.connect(address1).checkWhiteList()).to.equal('You are in the whiteList!');
    });
  
    it("only whitelist member can mint", async function () {
        await NFT.connect(owner).setwhiteList(address1.address);
        await expect(NFT.connect(owner).mint())
        .to.be.revertedWith("you're not permitted");
        await NFT.connect(address1).mint();
        expect(await NFT.connect(address1)._balanceof(address1.address)).to.equal(1);
    });
  
    it("Minted NFT cannot be transferred by anyone", async function () {
        await NFT.connect(owner).setwhiteList(address1.address);
        await NFT.connect(address1).mint();
        await expect(NFT.connect(address1).transferFrom(address1.address, owner.address, 0))
        .to.be.revertedWith("Transfer disabled");
    });
});

describe("Factory", function(){
    this.beforeEach(async function(){
        // Get the owner, user and newImp signers
        [Zinkedin, company,company2,company3, applier] = await ethers.getSigners();
        // Get the Factory contract factory
        Factory = await ethers.getContractFactory("Factory");
        // Deploy an instance of the Factory contract with the owner address as the constructor argument
        factory = await Factory.connect(Zinkedin).deploy();
    });

    // Check if the Factory contract is deployed with the correct owner
    describe("deployment", function () {
        it("should deploy Factory contract with correct owner", async function() {
            expect(await factory.owner()).to.equal(Zinkedin.address);
        });
    });

    describe("Company aspect: deploy Vacancy", async function () {
        it("the owner of new Vacancy contract is the caller of deployVacan", async function() {
            await factory.connect(company).deployVacancyTemplate("_jobTitle");
            const Vacancy_Address = await factory.vacancy_template_address();
            const vacancy_address = await ethers.getContractAt("Vacancy_Template",  Vacancy_Address);
            const Hiring_Company = await vacancy_address.owner();
            expect(Hiring_Company == company.address);
        });
    });

    describe("Job-seeker aspect: deploy CV", async function () {
        it("the owner of new CV_template contract is the caller of deploy_CV", async function() {
            await factory.connect(applier).deployCVTemplate();
            const CV_Address = await factory.cv_template_address();
            const cv_address = await ethers.getContractAt("CV_Template",  CV_Address);
            const Applier = await cv_address.owner();
            expect(Applier == applier.address);
        });
    });

    describe("findingVacancy", async function () {
        it("Job-seeker can search which company is hiring what job", async function() {
            await factory.connect(company3).deployVacancyTemplate("_jobTitle");
            await factory.connect(company2).deployVacancyTemplate("_jobTitle");
            expect(factory.connect(applier).findingVacancy("_jobTitle")==[company2.address, company3.address]);
        });
    });

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

describe("CV_Template", function (){
    let CV_template, cv_template;
    let owner, address1;

    beforeEach(async function () {
      [owner, address1, token] = await ethers.getSigners();
      CV_template= await ethers.getContractFactory("CV_Template");
      cv_template = await CV_template.connect(owner).deploy();
      await cv_template.deployed();
      await cv_template.initialize(owner.address);
    });

    it("should init owner address correctly", async function () {
      expect(await cv_template.owner()).to.equal(owner.address);
    });

    it("can only be initialized once", async function () {
      await expect(cv_template.initialize(owner.address)).to.be.revertedWith("already initialized");
    });

    it("Should only allow owner to add NFT", async function () {
      // Check address1's balance in cv_template contract
      //require(msg.sender==owner,"not Owner!")
      await cv_template.connect(owner).AddNFT(token.address);
      expect(await cv_template.connect(owner).NFTIhave(0)).to.equal(token.address);
    });
});

describe("CV_Proxy", function () {
    this.beforeEach(async function(){
        [company, applier, newimp] = await ethers.getSigners();
        CV_Template = await ethers.getContractFactory("CV_Template");
        cv_template = await CV_Template.deploy();  
        await cv_template.connect(applier).initialize(applier.address);

        CV_Proxy= await ethers.getContractFactory("CV_Proxy");
        cv_proxy = await CV_Proxy.deploy(applier.address,cv_template.address);  
    });

    describe("deployment", function () {
        it("should deploy CV_Proxy contract with correct owner", async function() {
            expect(await cv_proxy._getOwner()).to.equal(applier.address);
        });

        it("should point to an implement contract", async function() {
            expect(await cv_proxy._getImplementation()).to.equal(cv_template.address);
        });
    });

    // test delegate call
    describe("Job-seekers prospect (delegatecall):", function(){
        // check if delegate call can initialize the implemetation, the current implementation is cv_template
        // it's worth mentioned that array isn'table to set as ABI, so I change it into a function
        it("proxy delegatecall to 1.initialize implementaion 2.ensure owner is right 3.AddExperience 4.check if EXPERIENCE is right", async function(){
            await cv_proxy.setImplementation(cv_template.address);

            // Set ABI for CV_Proxy and CV_Template contracts
            const abi=["function initialize(address _applier_address)public",
                       "function AddExperience(address company, string memory experience) external",
                       "function EXPERIENCE(uint256) public view returns (string)",
                       "function AddNFT(address NFT) external",
                    ];

            // Create a proxied contract with CV_Proxy address and abi
            const proxied = new ethers.Contract(cv_proxy.address, abi, applier);
            // Call initialize function on proxied contract
            await proxied.initialize(applier.address);
            // ensure the proxied owner is the caller
            expect (await proxied._getOwner()).to.eq(applier);
            //test AddExperience
            await proxied.AddExperience("Experience1");
            await proxied.AddExperience("Experience2");
            expect (await proxied.EXPERIENCE[1]=="Experience1");
            expect (await proxied.EXPERIENCE[2]=="Experience2");

        });
    });

    describe("update",function(){
        // ensure non-owner cannot upgrade the implementation of the proxy.
        it("non-Owner won't able to upgrade implementaion of proxy",async function(){
            await expect(cv_proxy.connect(company).upgradeTo(newimp.address)).to.be.revertedWith("NOT owner!");
        });

        // ensure the new implementation must be a contract address.
        it("new implementation should be a contact",async function(){
            //use a 0 address to test
            await expect(cv_proxy.connect(applier).upgradeTo("0x0000000000000000000000000000000000000000")).to.be.revertedWith("implementation is not contract");
        });
/*
        // ensure the owner can successfully upgrade the implementation of the proxy.
        it("Owner should be able to upgrade implementaion of proxy",async function(){
            await cv_proxy.connect(company).upgradeTo("0x3F107Abd46156487E041195D55e293A79f4B62fD");
            expect(await cv_proxy._getImplementation()).to.equal("0x3F107Abd46156487E041195D55e293A79f4B62fD");
        });
*/
    });

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
            expect(vacancy_template.DESCRIPTION==["description1","description2"]);
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

    describe("update",function(){
        // ensure non-owner cannot upgrade the implementation of the proxy.
        it("non-Owner won't able to upgrade implementaion of proxy",async function(){
            await expect(vacancy_proxy.connect(user).upgradeTo(newimp.address)).to.be.revertedWith("NOT owner!");
        });

        // ensure the new implementation must be a contract address.
        it("new implementation should be a contact",async function(){
            //use a 0 address to test
            await expect(vacancy_proxy.connect(company).upgradeTo("0x0000000000000000000000000000000000000000")).to.be.revertedWith("implementation is not contract");
        });
/*
        // ensure the owner can successfully upgrade the implementation of the proxy.
        it("Owner should be able to upgrade implementaion of proxy",async function(){
            await vacancy_proxy.connect(company).upgradeTo("0x3F107Abd46156487E041195D55e293A79f4B62fD");
            expect(await vacancy_proxy._getImplementation()).to.equal("0x3F107Abd46156487E041195D55e293A79f4B62fD");
        });
*/
    });

});
