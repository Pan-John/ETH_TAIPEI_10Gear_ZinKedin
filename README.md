# ZinKedin, a Linkedin service on web 3.0

ZinKedin is a web3.0 and ZK proof scenario of Linkedin. 

With ZinKedin,  all user data stores on chain and belongs to the user, only the user can decide who can see his own data. user can add verifiable experience and use RSA algorithm or zero-knowledge proof to encrypt their private data. Companies can post job hiring informations and achieve auto selection process on chain.

With ZinKedIn, we use POAP to issue certificates as NFT and utilize UniRep to make applying jobs in zero-knowledge proof. job seekers can prove that they meet the requirements of the position without providing private data.  

We all have fun during this ETHTaipei. Thank for holding this event for us!

## Problems
* Work experience on applier's CV may be fake or exaggerated.
* CV is stored on the server, which means it is at risk of being leaked.

## ZinkedIn features
* Every work experience are verified.
* Use NFTs to preserve certificates like TOEIC.
* With unirep, companies can verify that we achieve their requirenment by not revealing our whole CV.


## Abstractions about how it works

1. First, job seeker creates CV through `CV_Template` contract, which can be verified by... let's say ex-company. Relatively, company issues several hiring informations, incuding job title and several discriptions through `Vacancy_Template` contract.
<img width="567" alt="截圖 2023-04-22 下午11 11 42" src="https://user-images.githubusercontent.com/125814787/233792577-e4cfb024-c985-412b-bfb8-4c5f5621db2f.png">

2. Then, job seekers can search for job vacancies and chooose which job he or she wants to apply for. Company will then recieve CV.
<img width="567" alt="截圖 2023-04-22 下午11 22 37" src="https://user-images.githubusercontent.com/125814787/233793007-221153f2-2e5e-432c-82c0-d6d1013fe74c.png">

3. At last, Companies tell the job seeker whether he or she is admited or not.

## Contract address
### Chiado testnet
* cv_t:0x91b4b5d8690990f5d96b121ae0966cf579700146
* vc_t:0xEa0E929a34D7079f51782b62d8d58F2534F81B32
* cv_p:0xaBeC2F8231715D9Aea92d6D41Fa31A8Bf6f8ff7B
* vc_p:0xB3F81f9CD307f3fA30Ce1111C9151617d9bA94d9
* factory:0xd7c8E5981eAeb5Cd8727274CF07524C4CD918360
* CertificateNFT:0x8b76eD777A369279bc68f639aD3B319ebCfCef72
