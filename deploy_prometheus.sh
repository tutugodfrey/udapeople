#! /bin/bash

if [ -z $AWS_PROFILE ]; then
  export AWS_PROFILE=uda-bot
fi

aws cloudformation deploy \
  --template-file .circleci/files/prometheus.yml \
  --stack-name udapeople-prometheus --capabilities CAPABILITY_IAM
