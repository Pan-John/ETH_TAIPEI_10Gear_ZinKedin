const hre = require("hardhat");
const { deployUnirep } = require("@unirep/contracts/deploy");
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require('hardhat')
const { UserState } = require("@unirep/core");
const { defaultProver } = require("@unirep/circuits/provers/defaultProver");
const { Identity } = require("@semaphore-protocol/identity");
const { genEpochKey } = require("@unirep/utils");



describe("ZK scenario in applying for jobs, zk prove that labor meet the job requirements without providing personal data", async () => {  
  let Zinkedin, labor, company, attester;  
  let unirep, factory, vacancy;
  let userState, identity;
  let err=""

  before(async () => {

    /****************************************
     * Set all the character in this zk apply scenario
     * Zinkedin: Zkinedin official
     * labor: job seeker in Zkinedin
     * company: job poster in Zkinedin
     * attester: the one that can prove the labor work experience, e.g. previous employer
    *****************************************/

    [Zinkedin, labor, company, attester] = await ethers.getSigners(); 
    
    // Deploy Unirep contract
    unirep = await deployUnirep(Zinkedin)
    // Get the Factory contract factory
    Factory = await ethers.getContractFactory("Factory");
    // Deploy an Factory contract with the owner address 
    factory = await Factory.connect(Zinkedin).deploy();

  });

  it("Company deploy Vacancy, and set job requirements ", async () => { 

    // Company deploy a Vacancy
    await factory.connect(company).deployVacancyTemplate("_jobTitle");
    const Vacancy = await factory.vacancy_template_address();
    vacancy = await ethers.getContractAt("Vacancy_Template",  Vacancy);
    const Hiring_Company = await vacancy.owner();
    expect(Hiring_Company == company.address);

    // Company set job requirements (job tenure should greater than 3)
    await vacancy.connect(company).AddHardLimit("job tenure", 3);


  });

  it("Attester sign up with wallet (real name)", async () => { 

    // define epoch length
    const epochLength = 300 // 300 seconds
  
    // send transaction
    const tx1 = await unirep.connect(attester).attesterSignUp(epochLength)
    await tx1.wait()
  });

  it("User sign up with semaphore identity (anonymous)", async () => { 
    // create semaphore Identity
    identity = new Identity()

    // generate user state
    userState =  new UserState({
      prover: defaultProver, // a circuit prover
      unirepAddress: unirep.address,
      provider: ethers.provider, // an ethers.js provider
    }, identity)


    // start and sync
    await userState.start()
    await userState.waitForSync()
  
    // generate signup proof
    const { publicSignals, proof } = await userState.genUserSignUpProof()

    // generate user signup proof
    await unirep.connect(attester).userSignUp(publicSignals, proof)
   
    // user can check if he signs up successfully

    await userState.waitForSync()
    expect(await userState.hasSignedUp()).to.equal(true);

  });


  it("labor generate epoch key ", async () => { 

    
    // get epoch from contract
    const epoch = await unirep.attesterCurrentEpoch(attester.address)
    // define nonce
    const nonce = 0 // it could be 0 to (NUM_EPOCH_KEY_NONCE - 1) per user

    // generate an epoch key
    const epochKey = genEpochKey(
        identity.secret,
        BigInt(attester.address),
        epoch,
        nonce
    )
  });
  
  
  it("labor gives the epoch key to the attester (e.g. previous employer), the attester can approve the experience", async () => { 

    // get epoch from contract
    const epoch = await unirep.attesterCurrentEpoch(attester.address)
    // define nonce
    const nonce = 0 // it could be 0 to (NUM_EPOCH_KEY_NONCE - 1) per user
    // generate an epoch key
    const epochKey = genEpochKey(
        identity.secret,
        BigInt(attester.address),
        epoch,
        nonce
    )

    // attester sends the tx
    const fieldIndex = 0 // the data field that the attester chooses to change
    const job_tenure = 5 // the duration of labor worked at the company(attester)

    const tx3 = await unirep.connect(attester).attest(epochKey, epoch, fieldIndex, job_tenure)
    await tx3.wait()
   
  });


  it("user state transition", async () => { 


    const fieldIndex = 0 
    const job_tenure = 5 

    await ethers.provider.send('evm_increaseTime', [300])
    await ethers.provider.send('evm_mine', [])


    // calling this to make sure the state is updated
    await userState.waitForSync()
    const { publicSignals, proof } = await userState.genUserStateTransitionProof({
        toEpoch: await userState.sync.loadCurrentEpoch(),
    })
    
    // submit it
    await unirep
        .connect(Zinkedin)
        .userStateTransition(publicSignals, proof)
        .then((t) => t.wait())
    
    await userState.waitForSync()
    {
      const data = await userState.getData()
      expect(data[fieldIndex].toString()).to.equal(job_tenure.toString())
      data.forEach((d, i) => {
          if (i === fieldIndex) return
          expect(d).to.equal(0)
      })
    }
    userState.sync.stop()

  });

/*
  it("labor proves that meeting the job requirements without providing personal data", async () => { 

    // calling this to make sure the state is updated
    await userState.waitForSync()

    // the data user wants to prove
    // If the user has 5, then he can choose to prove it is more than 3
    
    const proof = await userState.genProveReputationProof({
        minRep: 3
    })


    // check if proof is valid
    expect(await proof.verify()).to.equal(true);

  });
*/
  it("labor proves that he meets the job requirements without providing personal data", async () => { 
    
    // calling this to make sure the state is updated
    // await userState.waitForSync()
    const hard_limit = await vacancy.connect(labor).getHardLimit()
    
    const proof = await userState.genProveReputationProof({
        minRep: hard_limit
    })

    const result =  await proof.verify();
    // check if proof is valid
    // if proof is valid, then the address of labor is added to AppliedSuccess list to achieve zk proof & auto selection
    await vacancy.connect(labor).ZKApply(result);
    expect(await vacancy.connect(company).getAppliedSuccess(0)).to.equal(labor.address);

  });
  

});