// This is a file bootstrap for debugging a Node.js TypeScript Lambda function locally using VS Code.
// Update file to call the required handler function that you want to debug.

// Debug hello.ts Lambda function locally
import { handler } from "../src/services/spaces/handler";

process.env.TABLE_NAME = 'SpacesTable-029d437985ad';

handler ({ 
    httpMethod : 'POST',
    body: JSON.stringify({ location: 'Stockholm'})
 } as any, 
 {} as any);