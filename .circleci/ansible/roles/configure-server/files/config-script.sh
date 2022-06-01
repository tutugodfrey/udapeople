#! /bin/bash

apt update -y;
apt install -y gcc make git;
cd ~
curl -sL https://deb.nodesource.com/setup_13.x -o nodesource_setup.sh;
bash nodesource_setup.sh
apt install nodejs -y;
npm install pm2 -g;

# Clone the project repository
git clone https://github.com/tutugodfrey/udapeople /home/ubuntu/udapeople;
