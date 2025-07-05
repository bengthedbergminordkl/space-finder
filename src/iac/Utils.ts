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
