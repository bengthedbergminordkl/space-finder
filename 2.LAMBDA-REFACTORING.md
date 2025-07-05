# Lambda Refactoring

Lets refactor the javascript lambda to a typescript lambda and bundle the code with required packages.

## Use Typescript

* install types     
    `npm i -D @types/aws-lambda`

* install esbuild as NodeJsFunction uses it      
    `npm i -D esbuild`


* rename the `hello.js` to `.ts` and update the content:
    ```ts
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
    ```
* Add a node package that we will use in the lambda

    `npm i uuid @types/uuid`


* Use `NodeJsFunction` in the LambdaStack

  In `LambdaSTack.ts` 
    ```ts
    import { Stack, StackProps } from 'aws-cdk-lib';
    import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
    import { Table } from 'aws-cdk-lib/aws-dynamodb';
    import { Runtime } from 'aws-cdk-lib/aws-lambda';
    import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
    import { Construct } from 'constructs';
    import { join } from 'path';

    interface LambdaStackProps extends StackProps {
        spacesTableName: Table
    }

    export class LambdaStack extends Stack {

        public readonly lambdaIntegration: LambdaIntegration;

        constructor(scope: Construct, id: string, props: LambdaStackProps) {
            super(scope, id, props);

            const helloLambda = new NodejsFunction(this, 'HelloLambda', {
                runtime: Runtime.NODEJS_22_X, // Specify the Node.js runtime
                handler: 'handler', // The file and exported function name
                // Path to the Lambda function code
                entry: join(__dirname, '..', '..', 'services', 'hello.ts'), 
                environment: {
                    // Add any environmen`t variables here if needed
                    TABLE_NAME: props.spacesTableName.tableName // Pass the table name to the Lambda function
                    }
                });
            this.lambdaIntegration = new LambdaIntegration(helloLambda);    
        }
    }
    ```

* Build the project

    `cdk synth`

* Deploy the project

    `cdk deploy --all`