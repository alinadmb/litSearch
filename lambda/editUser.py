from datetime import datetime
import json
import os
import boto3

DYNAMODB_TABLE = os.environ['DYNAMODB_TABLE']
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    table = dynamodb.Table(DYNAMODB_TABLE)
    
    body = json.loads(event['body'])
    response = table.update_item(
        Key = {
            'user_id' : body['user_id']
        },
        UpdateExpression="set username=:n", 
        ExpressionAttributeValues={
            ':n': body['name']
        },
        ReturnValues="UPDATED_NEW"
    )
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
    }
    