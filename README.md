## Note

- **DO NOT CHANGE THE FOLDER OR FILE NAME OF ANYTHING UNDER `your-challenge-name/` unless absolutely necessary**
- This includes `dist/`, `src/`, `challenge.yml`, `start.sh`, etc.

## How to submit your challenges

1) Fork this repository

### In your terminal:

2) Clone the forked repository
3) Open the directory on your favorite IDE

### In your favorite IDE:

4) Open your challenge's category folder
5) Inside, create a **``new folder 📂``** with the same name as your challenge (name should be in all **``lowercase``**) and spaces replaced with dash `-`
6) Your challenge folder generally should have the following structure:

   ```
   your-challenge-name
    ├── challenge.yml
    ├── README.md
    └── src
        ├── chall.py
        ├── flag.txt
        ├── solve.py
        └── start.sh
    └── dist
        ├── attachment2.py
        └── attachment1.txt
   ```

   - attachment1.txt : attachment file that will be given to player
   - attachment2.py : attachment file that will be given to player (you can add more attachment if needed)
   - challenge.yml : the challenge config file ([Click here for more details!](https://github.com/CTFd/ctfcli/blob/master/ctfcli/spec/challenge-example.yml)) or just look at the existing examples
   - README.md : the basic explanation of the challenge and the writeup
   - src/ : all of the file used for the challenge, regardless given or not given to the player
   - start.sh : the file used to start the challenge docker (only for nc or web challenge)
   - solve.py : the file used to solve the challenge (highly recommended to be included)
7) You can copy **``challenge.yml``** from the already existing examples and adjust the contents accordingly
8) If your challenge doesn't have any files to give to the players (e.g. a netcat-only challenge), then remove the ``files: `` section in **``challenge.yml``**
9) Add a tag for the difficulty of your challenges (easy, medium, hard) in the **``challenge.yml``** file (see example)
10) Refer to the example challenge folder as much as you can

### If your challenges requires hosting (web or nc)

10) Please create a docker for your challenge, for web challenge you can make your own Dockerfile, for nc challenge specifically, you can use the mondok template
11) **Create a start.sh file** that contains the command to run your challenge (unzipping, docker compose up, etc), and put it in the src/ folder, look at the existing examples for reference

### In your favourite browser :

12) Create a pull request to the main branch
13) A github action will automatically attempts to deploy your challenges to the test-server, make sure the checks is successful

### Extra :

14) Check the test server and make sure your challs are working properly
15) Once the pull request has been merged, check the prod server and make sure your challs are working properly
16) Put the ```Author``` part of ```challenge.yml``` inside your challenge description (refer to the example if you're confused)
17) Make sure you write the ```category:``` part of ```challenge.yml``` correctly, follow this list below :
    - Cryptography
    - Binary Exploitation
    - Reverse Engineering
    - Web Exploitation
    - Forensic
    - Misc
    - Other (specify yourself, pay attention to the naming format above)

## Format and Points Information

Flag format: `{flag_format}`

Initial Point : `{initial_point}`

Decay Point : `{decay_point}`

Minimum Point : `100`

## CTFd Server

CTFd: (contact the CTFd Manager)

### Testing Account

Username
```
username_dummy_ctfd
```
Password 
```
password_dummy_ctfd
```
If you need a higher privileged account for the CTFd, contact the CTFd Manager