How to merge ur changes to a branch
---------------------------------------------
Step 1: save your changes
Step 2: click on the + icon for the files you want to merge and stage ur changes

![image](https://github.com/global-learning-festival/test/assets/82433697/372e6d78-04b3-4cae-9f20-37b7134cdc4f)


Step 3: At the bottom left click on main


![image](https://github.com/global-learning-festival/test/assets/82433697/40ee4464-517a-4b96-8d74-3363dc045be1)


Step 4: At the top click on Create new Branch from


![image](https://github.com/global-learning-festival/test/assets/82433697/8faaf603-8c76-497a-a1a5-92dc55f44224)


Step 5: Choose Main


![image](https://github.com/global-learning-festival/test/assets/82433697/74bf2b8b-0f97-4a22-8a9b-37775416ee95)


Step 6: Type in any branch name


![image](https://github.com/global-learning-festival/test/assets/82433697/7177830e-6de9-4c14-96d8-c214908e2fd7)


Step 7: At the bottom left ensure the Branch name is the one you have typed in step 6


![image](https://github.com/global-learning-festival/test/assets/82433697/b7716615-1392-4d7d-99d8-45f8e22243fc)

Step 8: Type in your commit message and click on commit


![image](https://github.com/global-learning-festival/test/assets/82433697/67cb41ac-ff59-4a8c-9364-f1eaaf3f9f19)

Step 9: Click on publish branch

![image](https://github.com/global-learning-festival/test/assets/82433697/78a71e71-6edb-4da2-bb4b-52f47a0ebe67)

Step 10: Head to github and you should see an option compare 7 pull request click on it

![image](https://github.com/global-learning-festival/test/assets/82433697/1fdcc003-8d95-4ef3-8712-32fd206f891d)

Step 11: fill in the neccessary fields and click on Create pull request 

![image](https://github.com/global-learning-festival/test/assets/82433697/1e03517a-189e-492a-b71d-72b10a218925)

Done





How to go back to main branch
--------------------------------

git checkout main

git pull ( to retrieve latest codes update)




How to remove local Branch after merge is completed
------------------------------------------------------

Step 1: install this module
npm i git-removed-branches

Step 2: ensure you are on the main branch run the following commands

git checkout main

git fetch -p

Step 3: Removing the All Local branches run the following command

git removed-branches --prune (Delete all branches)

git branch -d "Branch Name" (Manually deletes one branch at a time)

Step 4: U can check if all ur local branches by clicking main on ur bottom left and there will be a pop up at the top to show all ur local branches


It should look something similar to this image below


![image](https://github.com/global-learning-festival/test/assets/82433697/ffa00071-2301-4a2b-8310-a74e3be3c5d0)










