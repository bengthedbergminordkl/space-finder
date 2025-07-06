import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

interface LambdaStackProps extends StackProps {
    spacesTable: Table
}

export class LambdaStack extends Stack {

    public readonly spacesLambdaIntegration: LambdaIntegration;

    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props);

        const spacesLambda = new NodejsFunction(this, 'SpacesLambda', {
            runtime: Runtime.NODEJS_22_X, // Specify the Node.js runtime
            handler: 'handler', // The file and exported function name
            // Path to the Lambda function code
            entry: join(__dirname, '..', '..', 'services', 'spaces', 'handler.ts'), 
            environment: {
                // Add any environmen`t variables here if needed
                TABLE_NAME: props.spacesTable.tableName // Pass the table name to the Lambda function
                }
            });

        spacesLambda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            resources: [props.spacesTable.tableArn],
            actions:[
                'dynamodb:PutItem'
            ]
        }))

        this.spacesLambdaIntegration = new LambdaIntegration(spacesLambda);    
    }
}