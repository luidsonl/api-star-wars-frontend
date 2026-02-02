import { SwapiResponse, ResourceType } from '../types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function fetchFromSwapi<T>(
    resource: ResourceType,
    query: string = '',
    page: number = 1
): Promise<SwapiResponse<T>> {
    const searchParams = new URLSearchParams();
    if (query) searchParams.append('search', query);
    if (page > 1) searchParams.append('page', page.toString());

    const response = await fetch(`${BASE_URL}/${resource}/?${searchParams.toString()}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch ${resource}`);
    }

    return response.json();
}

export async function fetchResourceById<T>(resource: ResourceType, id: string): Promise<T> {
    const response = await fetch(`${BASE_URL}/${resource}/${id}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch ${resource} with id ${id}`);
    }

    return response.json();
}

export const swapiService = {
    fetchFromSwapi,
    fetchResourceById,
};
