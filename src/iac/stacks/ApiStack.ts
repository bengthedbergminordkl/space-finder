import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

interface SpacesApiProps extends StackProps {
    spacesLambdaIntegration : LambdaIntegration; // ARN of the Lambda function to integrate with
}

export class ApiStack extends Stack {

    constructor(scope: Construct, id: string, props: SpacesApiProps) {
        super(scope, id, props);

        const api = new RestApi(this, 'SpacesApi');
        const spacesResource = api.root.addResource('spaces');
        spacesResource.addMethod('GET', props.spacesLambdaIntegration); // GET /spaces
        spacesResource.addMethod('POST', props.spacesLambdaIntegration); // POST /spaces
    }
    
}