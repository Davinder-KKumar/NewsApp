import { API_BASE_URL, API_ENDPOINTS } from './api.config';

export const subscriberService = {
    async subscribe(email) {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SUBSCRIBERS}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            const error = await response.json();
            if (error.error === 'ALREADY_SUBSCRIBED') {
                throw new Error('This email is already subscribed');
            }
            throw new Error('Failed to subscribe');
        }

        return await response.json();
    },

    async checkSubscription(email) {
        const params = new URLSearchParams({ email });
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SUBSCRIBERS}/check?${params}`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to check subscription');
        }

        return await response.json();
    },

    async unsubscribe(email) {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SUBSCRIBERS}/unsubscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            throw new Error('Failed to unsubscribe');
        }
    }
};