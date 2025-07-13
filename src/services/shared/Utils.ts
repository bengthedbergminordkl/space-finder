import { randomUUID } from "crypto";

export function createRandomId(){
    return randomUUID();
}

export class InvalidJsonError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export function parseJson(jsonString: string): any {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        if (error instanceof Error) {
            throw new InvalidJsonError(error.message);
        } else {
            throw new InvalidJsonError("Failed to parse JSON");
        }
    }
}

export function parseJsonSafe<T>(jsonString: string): T | null {
    try {
        return JSON.parse(jsonString) as T;
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        return null;
    }
}

export function isValidHttpMethod(method: string): boolean {
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE'];
    return validMethods.includes(method.toUpperCase());
}

export function validateQueryParams(params: Record<string, string | undefined>, requiredParams: string[]): boolean {
    for (const param of requiredParams) {
        if (!params[param]) {
            console.error(`Missing required query parameter: ${param}`);
            return false;
        }
    }
    return true;
}