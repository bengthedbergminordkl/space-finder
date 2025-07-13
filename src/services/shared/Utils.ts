
export class InvalidJsonError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidJsonError';
    }
}

export function parseJson(jsonString: string): any {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        const errorMessage = typeof error === 'object' && error !== null && 'message' in error
            ? (error as { message: string }).message
            : String(error);
        throw new InvalidJsonError(errorMessage);
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