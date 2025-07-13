// src/services/spaces/PostSpaces.ts

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { validateSpaceItem } from "../shared/DataValidator";
import { createRandomId, parseJson } from "../shared/Utils";

export async function postSpacesWithDoc(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

    const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

    const randomId = createRandomId();
    const item = parseJson(event.body!);
    item.id = randomId; // Ensure the item has an ID field

    validateSpaceItem(item); // Validate the item structure

    const result = await ddbDocClient.send(new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: item  // Ensure the item matches the SpaceItem interface
    }));

    return {
        statusCode: 201,
        body: JSON.stringify({id: randomId})
    };
}