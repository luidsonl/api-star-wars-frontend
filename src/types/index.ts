export interface SwapiResource {
    name?: string;
    title?: string;
    url: string;
    [key: string]: any;
}

export interface SwapiResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export type ResourceType = 'people' | 'films' | 'planets' | 'species' | 'starships' | 'vehicles';

export interface User {
    id: string;
    email: string;
    name: string;
}

export interface Favorite {
    id: string;
    entity_type: ResourceType;
    entity_id: string;
    created_at: string;
}
