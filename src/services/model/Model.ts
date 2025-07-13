// /src/services/model/Model.ts

export interface SpaceItem {
    id: string; 
    location: string;
    name: string; 
    description?: string; // Optional field
    photoUrl?: string; // Optional field
}
