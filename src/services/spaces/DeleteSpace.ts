// src/services/spaces/DeleteSpace.ts

import { DeleteItemCommand, DynamoDBClient} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function deleteSpace(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

    if (event.queryStringParameters && event.queryStringParameters.id) {
        // If an ID is provided, we can implement a specific delete by ID logic here.
        const id = event.queryStringParameters.id;
        await ddbClient.send(new DeleteItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: {
                'id': { S: id }     
            }
        }));
        return {
                statusCode: 200,
                    body: JSON.stringify({ message: "Space deleted." })
        };
    } 

    return {
            statusCode: 400,
            body: JSON.stringify({message: 'Bad Request: Please provide a valid ID to delete.'})
        }
}