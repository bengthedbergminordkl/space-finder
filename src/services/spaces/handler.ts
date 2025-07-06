// File: src/services/spaces/handler.ts

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

async function handler(event : APIGatewayProxyEvent, context: Context) : Promise<APIGatewayProxyResult> {

    let message: string;
    switch (event.httpMethod) {
        case "GET":
            // Handle GET request
            message = "Handling GET request";
            break;
        case "POST":
            // Handle POST request
            message = "Handling POST request";
            break;
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