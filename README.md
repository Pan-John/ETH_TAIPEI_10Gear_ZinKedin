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

1. With ZinKedin, job-seekers can create CV through `CV_Template` contract, including experience that can be verified by previous employer and NFT certificate like TOFIL. Relatively, companies can issue hiring informations, incuding job title, several discriptions and requirement like job tenure through `Vacancy_Template` contract.
<img width="567" alt="截圖 2023-04-22 下午11 11 42" src="https://user-images.githubusercontent.com/125814787/233792577-e4cfb024-c985-412b-bfb8-4c5f5621db2f.png">

2. The basic idea is that job-seekers can apply for the job they want and the company will get their applications (in this scenerio, applier’s CV contract address). It’s worth mention that with UniRep, a company can confirm an applier have met there requirement by not revealing applier's whole CV.

<img width="567" alt="截圖 2023-04-22 下午11 22 37" src="https://user-images.githubusercontent.com/125814787/233793007-221153f2-2e5e-432c-82c0-d6d1013fe74c.png">

3. At last, Companies tell the job seeker whether he or she is admited or not.
