# Step-by-Step Setup Guide
TL;DR
- Set up a server for CTFd
- Set up a server for deploying challenges
- Create and configure a repository

Run 2 server IPs:
- CTFd Server IP : x.x.x.x
- Challenge Server IP : x.x.x.x

Preparation Checklist:
- Event Name:
- Start Date:
- Event Duration:
- Number of Challenges:
- Mode (Individual/Team):
- CTFD Website Admin Credentials:
- CTFD Server IP Address:
- CTFD Server Credentials:
- Challenge Server IP Address:
- Challenge Server Credentials:
- Decay Points:
- Initial Points:
- Flag Format:
- Account Creation Data:

## 1. Setting Up CTFd Server
1.1 Install Required Packages (Docker)

Run the following commands to install Docker:
```sh
curl -fsSL https://test.docker.com -o test-docker.sh
sudo sh test-docker.sh
```

1.2 Deploy CTFd

Run the CTFd container:
```sh
sudo docker run -p 80:8000 -d -it ctfd/ctfd
```

1.3 Initial Setup

Access your CTFd instance and configure:
- Event Name
- Event Description
- Competition Mode (Team Mode / User Mode)
- Private Registration (Enable if you want to manually create accounts)
- Admin Credentials (Set username, email, and password)
- Branding (Upload logo, banner, and icon if available)
- Event Schedule (Set start and end times)

1.4 Get CTFd Access Token

Log in as the CTF admin.

Navigate to Settings > Access Token.

Set the expiration date and generate a new token.

Example Credentials & Access Details:
```yaml
Admin Username: <admin-username>
Admin Email: <admin-email>
Admin Password: <strong-random-password>
CTFd URL: https://<your-ctfd-domain>
Access Token: ctfd_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
## 2. Creating & Configuring a Repository
2.1 Create a New Repository
- Go to GitHub and create a new repository.
- Choose Template `CTF-Template`
- Set a repository name.
- Choose Private.

2.2 Configure Secret Variables
You can choose to authenticate SSH using either a user password or a private key.
Navigate to: Settings > Secrets and Variables > Actions > New Repository Secret
- SSH_HOST_CHALL → IP Server Chall
- SSH_PRIVATE_KEY_CHALL → SSH Private Key
- SSH_PASSWORD_CHALL → SSH Password user

2.3 Setup Template File
- Clone the repository and navigate to its directory.
- Insert define values into the init.sh file.
- Run the initialization script:
```sh
./init.sh -a
```
flag
```
-a : Perform all replacements.
-p : Use this if you don’t have an IP for deployment but still want to initialize the repository first.
```

## 3. Setting Up Challenge Deployment Server
3.1 Install Required Packages (Docker & ctfcli)

Run the following commands:
```sh
# Install Docker
curl -fsSL https://test.docker.com -o test-docker.sh
sudo sh test-docker.sh

# Install pipx and ctfcli
sudo apt install pipx -y
pipx install ctfcli
pipx ensurepath
```

3.2 Clone the Repository & Store Git Credentials

Run the following:
```sh
git config --global credential.helper store
git clone https://github.com/Username/Repository-Name.git
```
When prompted, enter your GitHub username and personal access token.

# Tools

Download All Challenge : https://github.com/hanasuru/CTFdScraper

Scoring WU : https://github.com/kisanakkkkk/CTFd-Scoring-Sheet-Generator