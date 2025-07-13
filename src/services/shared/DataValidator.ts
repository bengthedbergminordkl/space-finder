// src/services/shared/DataValidator.ts

export class MissingFieldError extends Error {
    constructor(field: string) {
        super(`Missing required field: ${field}`);
    }
}

export class InvalidFieldTypeError extends Error {
    constructor(field: string, expectedType: string) {
        super(`Invalid type for field: ${field}. Expected ${expectedType}.`);
    }
}

// Validates a SpaceItem object.
export function validateSpaceItem(item: any) {

    const requiredFields = ['id', 'location', 'name'];
    for (const field of requiredFields) {
        if (!item.hasOwnProperty(field)) {
            throw new MissingFieldError(field);
        }
        if (typeof item[field] !== 'string') {
            throw new InvalidFieldTypeError(field, 'string');
        }
    }

    // Optional fields can be checked if they exist
    if (item.description && typeof item.description !== 'string') {
        throw new InvalidFieldTypeError('description', 'string');
    }
    
    if (item.photoUrl && typeof item.photoUrl !== 'string') {
        throw new InvalidFieldTypeError('photoUrl', 'string');
    }
}