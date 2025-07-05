import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
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

        // Grant the lambda access to list all s3 buckets
        // This is just an example, you can modify the permissions as needed
        helloLambda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['s3:ListAllMyBuckets', 's3:ListBuckets'],
            resources: ['*'], // This is a wildcard (bad practise), you should restrict it to specific buckets if needed
        }));
                
        this.lambdaIntegration = new LambdaIntegration(helloLambda);    
    }
}