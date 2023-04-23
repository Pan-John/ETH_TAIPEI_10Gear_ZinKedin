# ZinKedin, a Linkedin service on web 3.0

ZinKedin is a Dapp and it's similar to "Linkedin" in web2. However, ZinKedin possesses several advantages. For example, it protects user data with ZK proof from leaking to others who doesn't be permitted. Furthermore, it can also save some time for company HR, because it can utilize Unirep to automatically select CV with simple conditions.
Moreover, the experience user claim they have can finally get verified on our Dapp！
We will provide a service which can support Certification issuer and Company deploy their own NFT certificate, the Web3 immutable Certificate. There are more technical detail we want to share with participants. Thank for holding this event.

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
