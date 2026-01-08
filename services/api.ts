import { Wine } from '../types';

const API_URL = 'http://localhost:3000/api/wines';

export const api = {
    async fetchWines(): Promise<Wine[]> {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch wines');
        }
        return response.json();
    },

    async createWine(wine: Omit<Wine, 'id'>): Promise<Wine> {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(wine),
        });
        if (!response.ok) {
            throw new Error('Failed to create wine');
        }
        return response.json();
    },

    async updateWine(id: string | number, wine: Partial<Wine>): Promise<Wine> {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(wine),
        });
        if (!response.ok) {
            throw new Error('Failed to update wine');
        }
        return response.json(); // Usually returns success message or updated object
    },

    async deleteWine(id: string | number): Promise<void> {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete wine');
        }
    }
};
