// File: src/services/spaces/handler.ts

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { postSpaces } from "./PostSpaces";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { getSpaces } from "./GetSpaces";
import { postSpacesWithDoc } from "./PostSpacesWithDoc";
import { updateSpace } from "./UpdateSpace";
import { deleteSpace } from "./DeleteSpace";

const ddbClient = new DynamoDBClient({});

async function handler(event : APIGatewayProxyEvent, context: Context) : Promise<APIGatewayProxyResult> {

    let message: string;
    switch (event.httpMethod) {
        case "GET":
            const getResponse = getSpaces(event, ddbClient);
            return getResponse;
        case "POST":
            const response = postSpacesWithDoc(event, ddbClient);
            return response;
        case "PUT":
            const updateResponse = await updateSpace(event, ddbClient);
            return updateResponse;    
        case "DELETE":
            const deleteResponse = await deleteSpace(event, ddbClient);
            return deleteResponse;    
        default:
            // Handle other HTTP methods
            message = `Unsupported method: ${event.httpMethod}`;
            return {
                statusCode: 405,
                body: JSON.stringify({ message }),
            } as APIGatewayProxyResult;
    }

    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify({message: message}),
    };

    return response;
}

export { handler };