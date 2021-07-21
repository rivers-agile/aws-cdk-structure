#!/bin/bash
yum update -y

# Node application location
mkdir /home/ec2-user/test-app
cd /home/ec2-user/test-app

sudo su

# Install node
# Documentation can be found at https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html
cd /home/ec2-user/
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node

# Installation for CodeDeploy services
yum install ruby wget -y
cd /home/ec2-user
# Please note you will have to change to your EC2 settings below is an example in North Virginia AZ...
# Region Name	bucket-name	region-identifier
# US East (Ohio)	aws-codedeploy-us-east-2	us-east-2
# US East (N. Virginia)	aws-codedeploy-us-east-1	us-east-1
# US West (N. California)	aws-codedeploy-us-west-1	us-west-1
# US West (Oregon)	aws-codedeploy-us-west-2	us-west-2
# Canada (Central)	aws-codedeploy-ca-central-1	ca-central-1
# Europe (Ireland)	aws-codedeploy-eu-west-1	eu-west-1
# Europe (London)	aws-codedeploy-eu-west-2	eu-west-2
# Europe (Paris)	aws-codedeploy-eu-west-3	eu-west-3
# wget https://bucket-name.s3.region-identifier.amazonaws.com/latest/install
wget https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/latest/install
chmod +x ./install
./install auto
