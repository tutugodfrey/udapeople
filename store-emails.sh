#! /bin/bash

# Store emails to be used for alert managers in aws ssm

if [ -z $AWS_PROFILE ]; then
  export AWS_PROFILE=uda-bot
fi

ALERT_RECEIVER=${ALERT_RECEIVER_EMAIL}
ALERT_SENDER=${ALERT_SENDER_EMAIL}

aws ssm put-parameter --name alert-sender-email --value $ALERT_SENDER --type SecureString
aws ssm put-parameter --name alert-receiver-email --value  $ALERT_RECEIVER --type SecureString
