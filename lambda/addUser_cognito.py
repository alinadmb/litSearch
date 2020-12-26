#trigger pre sign-up function for AWS Cognito
from datetime import datetime
import json
import os
import boto3
import uuid

DYNAMODB_TABLE = os.environ['DYNAMODB_TABLE']
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    
    table = dynamodb.Table(DYNAMODB_TABLE)
    
    # Confirm the user
    event['response']['autoConfirmUser'] = True

    # Set the email as verified if it is in the request
    if 'email' in event['request']['userAttributes']:
        event['response']['autoVerifyEmail'] = True

    
    body = json.loads(json.dumps(event['request']['userAttributes']))
    
    response = table.put_item(
        Item = {
            'user_id' : event['userName'],
            'email': body['email'],
            'username': '',
            'favorites': [],
            'date_of_creating': str(datetime.now())
        }
    )
    
    # Return to Amazon Cognito
    return event
