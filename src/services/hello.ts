// File: src/services/hello.ts

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4 } from 'uuid'
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";  

// Best practise is to initialise the client outside the handler
// so that it can be reused across invocations
// This reduces the cold start time of the Lambda function
const s3Client = new S3Client({ });

async function handler(event : APIGatewayProxyEvent, context: Context) {

    const data = await s3Client.send(new ListBucketsCommand({}));
    console.log("S3 Buckets: ", data.Buckets);

    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify({
            message: `Hello from Lambda! I will use the DynamoDB table ${process.env.TABLE_NAME} with and id ${v4()}`,
            buckets: data.Buckets,
        }),
    };
    console.log("Event: ", event);

    return response;
}

export { handler };