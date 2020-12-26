import json
import os
import boto3
from datetime import datetime

DYNAMODB_TABLE = os.environ['DYNAMODB_TABLE']
dynamodb = boto3.resource('dynamodb')

lambda_client = boto3.client('lambda')

def lambda_handler(event, context):
    table = dynamodb.Table(DYNAMODB_TABLE)
    
    params = json.loads(json.dumps(event['queryStringParameters']))
    
    response = table.get_item(
        Key = {
            'user_id' : params['user_id']
        }
    )
    result = {
        "user_id": response['Item']["user_id"],
        "name": response['Item']["username"],
        "email": response['Item']["email"],
        "favorites": response['Item']["favorites"]
    }
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps(result)
    }
    