// src/services/spaces/PostSpaces.ts

import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { validateSpaceItem } from "../shared/DataValidator";
import { marshall } from "@aws-sdk/util-dynamodb";
import { createRandomId, parseJson } from "../shared/Utils";

export async function postSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

    const randomId = createRandomId();
    const item = parseJson(event.body!);
    item.id = randomId; // Ensure the item has an ID field

    validateSpaceItem(item); // Validate the item structure

    const result = await ddbClient.send(new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: marshall({
            ...item,
        })
    }));

    return {
        statusCode: 201,
        body: JSON.stringify({id: randomId})
    }
}