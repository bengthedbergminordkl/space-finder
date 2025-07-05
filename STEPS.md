# Steps

## Bootstrap Project

- Create a node application

   `npm init -y`

- Add `.gitignore`    

   `Invoke-WebRequest -Uri "https://github.com/aws/aws-cdk/raw/main/.gitignore" -OutFile .gitignore`

- Install dependencies

    - AWS CDK 
    
    `npm i -D aws-cdk aws-cdk-lib constructs`  

    - Typescript
    
    `npm i -D ts-node typescript @types/node`

   > Note: This is not difference between dev dependencies and runtime dependecies in a CDK solution. It is all Dev dependencies

- Setup Typescript

    The tsconfig.json file is a crucial component in a TypeScript project. It specifies the root files and the compiler options required to compile the projec

    - Add `tsconfig.json` 

      `npx tsc --init`

    - Modify `tsconfig.json`

        Change the `compilerOptions:target` to `es2022`  

- Setup project

    - Create `src` folder
    - Create `src\iac` folder that holds infrastructure as code files.
    - Create `src\iac\stacks` that holds all the CDK stacks in the solution.
    - Create a first stack called `src\iac\stacks\DataStack.ts`

    ```ts
    import { Stack, StackProps } from 'aws-cdk-lib';
    import { Construct } from 'constructs';

    export class DataStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        }
    }
    ``` 
    - Create `src\iac\Launcher.ts` 
    ```ts
    import { App } from "aws-cdk-lib"
    import { DataStack } from "./stacks/DataStack"

    const app = new App()
    new DataStack(app, "DataStack");

    ```
    - Create the `cdk.json` file
    ```json
    {
        "app": "npx ts-node src/iac/Launcher.ts"
    }
    ```
* Build the project

    `cdk synth`

* Deploy the project

    `cdk deploy`

## Create a Lambda

* Create `src\services` folder
* Create `src\services\hello.js` with the content
    ```js
    // File: src/services/hello.js
    exports.main = async function(event, context) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Hello from Lambda!",
                input: event,
            }),
        };
    }        
    ```
* Create `src\iac\stacks\LambdaStack.ts` 
    ```ts
    import { Stack, StackProps } from 'aws-cdk-lib';
    import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
    import { Construct } from 'constructs';
    import { join } from 'path';

    export class LambdaStack extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        new LambdaFunction(this, 'HelloLambda', {
            runtime: Runtime.NODEJS_22_X, // Specify the Node.js runtime
            handler: 'hello.main', // The file and exported function name
            // Path to the Lambda function code
            code: Code.fromAsset(join(__dirname, '..', '..', 'services')), 
            environment: {
                // Add any environmen`t variables here if needed
                }
            });
        }
    }
    ```
* Add Lambda Stack to launcher
    ```ts
    import { App } from "aws-cdk-lib"
    import { DataStack } from "./stacks/DataStack"
    import { LambdaStack } from "./stacks/LambdaStack";

    const app = new App()
    new DataStack(app, "DataStack");
    new LambdaStack(app, "LambdaStack");
    ```
* Build the project

    `cdk synth`

* Deploy the project

    `cdk deploy --all`

## Add Rest API

* Create a new stack `src\iac\stacks\ApiStack.ts`
    ```ts
    import { Stack, StackProps } from 'aws-cdk-lib';
    import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
    import { Construct } from 'constructs';

    interface SpacesApiProps extends StackProps {
        lambdaIntegration : LambdaIntegration; // ARN of the Lambda function to integrate with
    }

    export class ApiStack extends Stack {

        constructor(scope: Construct, id: string, props: SpacesApiProps) {
            super(scope, id, props);

            const api = new RestApi(this, 'SpacesApi');
            const spacesResource = api.root.addResource('spaces');
            spacesResource.addMethod('GET', props.lambdaIntegration); // GET /spaces
        }
        
    }
    ```
* Update the `LambdaStack.ts` so it exports the LambdaIntegration
    ```ts
    import { Stack, StackProps } from 'aws-cdk-lib';
    import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
    import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
    import { Construct } from 'constructs';
    import { join } from 'path';

    export class LambdaStack extends Stack {

        public readonly lambdaIntegration: LambdaIntegration;

        constructor(scope: Construct, id: string, props?: StackProps) {
            super(scope, id, props);

            const helloLambda = new LambdaFunction(this, 'HelloLambda', {
                runtime: Runtime.NODEJS_22_X, // Specify the Node.js runtime
                handler: 'hello.main', // The file and exported function name
                // Path to the Lambda function code
                code: Code.fromAsset(join(__dirname, '..', '..', 'services')), 
                environment: {
                    // Add any environmen`t variables here if needed
                    }
                });
            this.lambdaIntegration = new LambdaIntegration(helloLambda);    
        }
    }
    ```
* Update the `Launcher` :
    ```ts
    import { App } from "aws-cdk-lib"
    import { DataStack } from "./stacks/DataStack"
    import { LambdaStack } from "./stacks/LambdaStack";
    import { ApiStack } from "./stacks/ApiStack";

    const app = new App()
    new DataStack(app, "DataStack");
    const lambda = new LambdaStack(app, "LambdaStack");
    new ApiStack(app, "ApiStack", {
        lambdaIntegration: lambda.lambdaIntegration
    });
    ```
* Build the project

    `cdk synth`

* Deploy the project

    `cdk deploy --all`

* Add a `spaces.http` file (use the extension REST Client for Visual Studio Code)
    ```http
    GET https://cdduc91q5k.execute-api.ap-southeast-2.amazonaws.com/prod/spaces
    ###
    ```
    > Note: use the SpacesApiEndpoint from the CDK Deploy output.

## Add DynamoDB Table

* Add a `src\iac\Utils.ts` file for helper methods:
    ```ts
    import { Fn } from "aws-cdk-lib";

    export class Utils {
        /**
         * Converts a string to a valid CloudFormation logical ID.
         * @param {string} name - The name to convert.
         * @returns {string} - The converted logical ID.
         */
        static toLogicalId(name: string): string {
            return name.replace(/[^a-zA-Z0-9]/g, '');
        }

        /**
         * 
         * @param {string} stackId - The stack ID to extract the suffix from.
         * @returns {string} - The last suffix of the stack ID.
         */
        static GetStackSuffix(stackId : string) : string {
            const shortStackId = Fn.select(2, Fn.split('/', stackId));
            return Fn.select(4, Fn.split('-', shortStackId));
        }
    }

    ```

* Update the `DataStack.ts`
    ```ts
    import { Stack, StackProps } from 'aws-cdk-lib';
    import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
    import { Construct } from 'constructs';
    import { Utils } from '../Utils';

    export class DataStack extends Stack {

    public readonly spacesTable: Table;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const suffix = Utils.GetStackSuffix(this.stackId);
        
        this.spacesTable = new Table(this, 'SpacesTable', {
            partitionKey: { name: 'id', type: AttributeType.STRING }, // Partition key for the table
            tableName: `SpacesTable-${suffix}`, // Name of the table
            });    
        }
    }
    ```

* Update the `LambdaStack.ts` so it uses the dynamo db table:
    ```ts
    import { Stack, StackProps } from 'aws-cdk-lib';
    import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
    import { Table } from 'aws-cdk-lib/aws-dynamodb';
    import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
    import { Construct } from 'constructs';
    import { join } from 'path';

    interface LambdaStackProps extends StackProps {
        spacesTableName: Table
    }

    export class LambdaStack extends Stack {

        public readonly lambdaIntegration: LambdaIntegration;

        constructor(scope: Construct, id: string, props: LambdaStackProps) {
            super(scope, id, props);

            const helloLambda = new LambdaFunction(this, 'HelloLambda', {
                runtime: Runtime.NODEJS_22_X, // Specify the Node.js runtime
                handler: 'hello.main', // The file and exported function name
                // Path to the Lambda function code
                code: Code.fromAsset(join(__dirname, '..', '..', 'services')), 
                environment: {
                    // Add any environmen`t variables here if needed
                    TABLE_NAME: props.spacesTableName.tableName // Pass the table name to the Lambda function
                    }
                });
            this.lambdaIntegration = new LambdaIntegration(helloLambda);    
        }
    }
    ```

 * Update the `Launcher`
    ```ts
    import { App } from "aws-cdk-lib"
    import { DataStack } from "./stacks/DataStack"
    import { LambdaStack } from "./stacks/LambdaStack";
    import { ApiStack } from "./stacks/ApiStack";

    const app = new App()
    const dataStack = new DataStack(app, "DataStack");
    const lambda = new LambdaStack(app, "LambdaStack", {
        spacesTableName: dataStack.spacesTable 
    });
    new ApiStack(app, "ApiStack", {
        lambdaIntegration: lambda.lambdaIntegration
    });
    ```
* Update the `hello.js` lambda code:
    ```js
    // File: src/services/hello.js
    exports.main = async function(event, context) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Hello from Lambda! I will access the DynamoDB table ${process.env.TABLE_NAME}`,
                input: event,
            }),
        };
    }
    ```
* Build the project

    `cdk synth`

* Deploy the project

    `cdk deploy --all`