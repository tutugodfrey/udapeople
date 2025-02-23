#! /bin/bash

if [ -z $AWS_PROFILE ]; then
  export AWS_PROFILE=uda-bot
fi

EMAIL_PASSWORD=${EMAIL_PASSWORD}

# Use user profile to get credential and store in secret store
ACCESS_KEY_ID=$(aws configure get aws_access_key_id)
SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key)
SECRET_STRING="{\"access-key-id\" : \"$ACCESS_KEY_ID\", \"secret-access-key\" : \"$SECRET_ACCESS_KEY\", \"email-password\" : \"$EMAIL_PASSWORD\"}"

aws secretsmanager create-secret --name aws-access-key \
  --description "AWS credential" \
  --secret-string "{\"access-key-id\" : \"$ACCESS_KEY_ID\", \"secret-access-key\" : \"$SECRET_ACCESS_KEY\", \"email-password\" : \"$EMAIL_PASSWORD\"}" || aws secretsmanager put-secret-value --secret-id aws-access-key --secret-string "{\"access-key-id\" : \"$ACCESS_KEY_ID\", \"secret-access-key\" : \"$SECRET_ACCESS_KEY\", \"email-password\" : \"$EMAIL_PASSWORD\"}"

# aws secretsmanager put-secret-value
