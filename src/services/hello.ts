// File: src/services/hello.ts

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4 } from 'uuid'

async function handler(event : APIGatewayProxyEvent, context: Context) {
    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify({
            message: `Hello from Lambda! I will use the DynamoDB table ${process.env.TABLE_NAME} with and id ${v4()}`,
            input: event,
        }),
    };
    console.log("Event: ", event);
    return response;
}

export { handler };