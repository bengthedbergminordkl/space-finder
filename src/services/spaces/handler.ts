// File: src/services/spaces/handler.ts

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { postSpaces } from "./PostSpaces";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { getSpaces } from "./GetSpaces";
import { postSpacesWithDoc } from "./PostSpacesWithDoc";
import { updateSpace } from "./UpdateSpace";
import { deleteSpace } from "./DeleteSpace";
import { InvalidFieldTypeError, MissingFieldError } from "../shared/DataValidator";
import { InvalidJsonError } from "../shared/Utils";

const ddbClient = new DynamoDBClient({});

async function handler(event : APIGatewayProxyEvent, context: Context) : Promise<APIGatewayProxyResult> {

    let message: string;
    
    try {
        switch (event.httpMethod) {
            case "GET":
                const getResponse = await getSpaces(event, ddbClient);
                return getResponse;
            case "POST":
                const postResponse = await postSpacesWithDoc(event, ddbClient);
                return postResponse;
            case "PUT":
                const updateResponse = await updateSpace(event, ddbClient);
                return updateResponse;    
            case "DELETE":
                const deleteResponse = await deleteSpace(event, ddbClient);
                return deleteResponse;    
            default:
                break;
        }
    }
    catch (error) {
        if (error instanceof MissingFieldError || error instanceof InvalidJsonError || error instanceof InvalidFieldTypeError) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: error.message }),
            } as APIGatewayProxyResult;
        }
        // For other errors, return a generic error message
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'An unexpected error occurred' }),
        } as APIGatewayProxyResult;
    }

    // Handle other HTTP methods
    message = `Unsupported method: ${event.httpMethod}`;
    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify(message)
    }

    return response;

}

export { handler };