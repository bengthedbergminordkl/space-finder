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