#! /bin/bash

if [ -z $AWS_PROFILE ]; then
  export AWS_PROFILE=uda-bot
fi

if [ -z $WorkflowID ]; then
  WorkflowID=udapeople-kk1j287dhjppmz437
fi

aws cloudformation deploy \
  --template-file .circleci/files/cloudfront.yml \
  --stack-name InitialStack\
  --parameter-overrides WorkflowID=${WorkflowID}
