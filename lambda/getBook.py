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
            'book_id' : params['book_id']
        }
    )
    result = {
        "book_id": params['book_id'],
        "book_title": response['Item']["book_title"],
        "book_author": response['Item']["book_author"],
        "book_description": response['Item']["book_description"],
        "book_date": response['Item']["book_date"],
        "book_rate": response['Item']["book_rate"],
        "book_link": response['Item']["book_link"]
    }
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET, DELET'
        },
        'body': json.dumps(result)
    }
