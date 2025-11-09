import { API_BASE_URL, API_ENDPOINTS, createApiClient } from './api.config';

const apiClient = createApiClient();

export const newsletterService = {
    async subscribe(email) {
        const response = await apiClient.post(API_ENDPOINTS.SUBSCRIBE, { email });
        return response;
    },

    async getNewsletters({ page = 0, size = 10, category = 'all' } = {}) {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            category
        });

        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.NEWSLETTERS}?${params}`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch newsletters');
        }

        return await response.json();
    },

    async createNewsletter(newsletterData) {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN}/newsletters`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(newsletterData)
        });

        if (!response.ok) {
            throw new Error('Failed to create newsletter');
        }

        return await response.json();
    },

    async updateNewsletter(id, newsletterData) {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN}/newsletters/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(newsletterData)
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Newsletter not found');
            }
            throw new Error('Failed to update newsletter');
        }

        return await response.json();
    },

    async deleteNewsletter(id) {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN}/newsletters/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to delete newsletter');
        }
    }
};