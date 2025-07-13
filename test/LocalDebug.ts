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
async function updateSpace(id: string, newLocation: string) {
    return await handler ({
        httpMethod : 'PUT',
        queryStringParameters: { id },
        body: JSON.stringify({ location: newLocation })
    } as any, 
    {} as any);
}

async function deleteSpace(id: string) {
    return await handler ({
        httpMethod : 'DELETE',
        queryStringParameters: { id }
    } as any,
    {} as any);
}

async function main() {
    try {
        const allSpacesResponse = await getAllSpaces();
        console.log(allSpacesResponse);
        
        const addSpaceResponse = await addSpace('Sydney');
        console.log(addSpaceResponse);
        
        const id = JSON.parse(addSpaceResponse.body).id;
        const spaceResponse = await getSpaceById(id);
        console.log(spaceResponse);

        const updateResponse = await updateSpace(id, 'Melbourne');
        console.log(updateResponse);        
        
        const updatedSpaceResponse = await getSpaceById(id);
        console.log(updatedSpaceResponse);  

        const deleteResponse = await deleteSpace(id);
        console.log(deleteResponse);

    } catch (error) {
        console.error("Error in local debug:", error);
    }
    console.log("Debugging complete. Check the console for output.");
}

main();