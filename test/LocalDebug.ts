// This is a file bootstrap for debugging a Node.js TypeScript Lambda function locally using VS Code.
// Update file to call the required handler function that you want to debug.

// Debug hello.ts Lambda function locally
import { handler } from "../src/services/hello";
handler ({} as any, {} as any);