// This is a file bootstrap for debugging a Node.js TypeScript Lambda function locally using VS Code.
// Update file to call the required handler function that you want to debug.

// Debug hello.ts Lambda function locally
import { handler } from "../src/services/spaces/handler";

process.env.TABLE_NAME = 'SpacesTable-029d437985ad';

async function addSpace(location: string) {
    return await handler ({
        httpMethod : 'POST',
        body: JSON.stringify({ location })
    } as any, 
    {} as any);
}
async function getSpaceById(id: string) {
    return await handler ({
        httpMethod : 'GET',
        queryStringParameters: { id }
    } as any, 
    {} as any); 
}
async function getAllSpaces() {
    return await handler ({
        httpMethod : 'GET'
    } as any, 
    {} as any);
}

async function main() {
    try {
        const allSpacesResponse = await getAllSpaces();
        console.log(allSpacesResponse);
        console.log(JSON.parse(allSpacesResponse.body));

        const addSpaceResponse = await addSpace('Sydney');
        console.log(addSpaceResponse);
        console.log(JSON.parse(addSpaceResponse.body));

        const id = JSON.parse(addSpaceResponse.body).id;
        const spaceResponse = await getSpaceById(id);
        console.log(spaceResponse);
        console.log(JSON.parse(spaceResponse.body));
    } catch (error) {
        console.error("Error in local debug:", error);
    }
    console.log("Debugging complete. Check the console for output.");
}

main();