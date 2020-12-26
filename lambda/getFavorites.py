import json
import os
import boto3

DYNAMODB_TABLE = os.environ['DYNAMODB_TABLE']
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    table = dynamodb.Table(DYNAMODB_TABLE)
    
    params = json.loads(json.dumps(event['queryStringParameters']))
    
    response = table.get_item(
        Key = {
            'user_id' : params['user_id']
        }
    )
    result = {
        "favorites": response['Item']["favorites"],
    }
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,DELETE'
        },
        'body': json.dumps(result)
    }
    