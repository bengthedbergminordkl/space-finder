import { DynamoDBClient, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function getSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {


    if (event.queryStringParameters) {
        if (event.queryStringParameters.id) {
            // If an ID is provided, we can implement a specific get by ID logic here.
            const id = event.queryStringParameters.id;
            const key = marshall({ id });
            const result = await ddbClient.send(new GetItemCommand({
                TableName: process.env.TABLE_NAME,
                Key: key
            }));
            if (result.Item) {
                const unmarshalledItems = unmarshall(result.Item);
                return {
                    statusCode: 200,
                    body: JSON.stringify(unmarshalledItems)
                };
            }
            // If no item is found, we can return a 404 Not Found response.
            return {    
                statusCode: 404,
                body: JSON.stringify({ message: "Space not found." })
            };
        }
        else {
            // If an ID is not provided, we can return a message or handle it accordingly.
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "ID parameter is required." })
            };
        }
    }
    else {
        // If no ID is provided, we will return all spaces.
        const result = await ddbClient.send(new ScanCommand({
            TableName: process.env.TABLE_NAME,
        }));

        const unmarshalledItems = result.Items ? result.Items.map(item => unmarshall(item)) : [];   
        return {
            statusCode: 200,
            body: JSON.stringify(unmarshalledItems)
        }
    }
}