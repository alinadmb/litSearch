import json
import os
import boto3

DYNAMODB_TABLE = os.environ['DYNAMODB_TABLE']
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    table = dynamodb.Table(DYNAMODB_TABLE)
    
    body = json.loads(event['body'])
    item = table.get_item(
        Key = {
            'book_id' : body['book_id']
        }
    )
    
    if not 'Item' in item:
        response = table.put_item(
            Item = {
                'book_id' : body['book_id'],
                'book_title': body['book_title'],
                'book_author': body['book_author'],
                'book_description': body['book_description'],
                'book_date': body['book_date'],
                'book_rate': body['book_rate'],
                'book_link': body['book_link']
            }
        )

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
    }
    