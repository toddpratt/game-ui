
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export class APIError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.name = 'APIError';
    }
}

export async function apiRequest<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        throw new APIError(response.status, await response.text());
    }

    return response.json();
}

export function getAuthHeaders(token: string) {
    return {
        Authorization: `Bearer ${token}`,
    };
}