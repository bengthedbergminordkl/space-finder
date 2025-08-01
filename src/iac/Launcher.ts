import { App } from "aws-cdk-lib"
import { DataStack } from "./stacks/DataStack"
import { LambdaStack } from "./stacks/LambdaStack";
import { ApiStack } from "./stacks/ApiStack";

const app = new App()
const dataStack = new DataStack(app, "DataStack");
const lambda = new LambdaStack(app, "LambdaStack", {
    spacesTable: dataStack.spacesTable 
});
new ApiStack(app, "ApiStack", {
    spacesLambdaIntegration: lambda.spacesLambdaIntegration
});