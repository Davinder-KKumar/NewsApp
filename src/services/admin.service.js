import { createApiClient } from './api.config';

const apiClient = createApiClient();

export const AdminService = {
    async getNewsletterSubscribers(page = 0, size = 10) {
        try {
            const response = await apiClient.get(`/api/newsletters/subscribers?page=${page}&size=${size}`);
            return response;
        } catch (error) {
            console.error('Error fetching newsletter subscribers:', error);
            throw error;
        }
    },

    async getNewsletterStats() {
        try {
            const response = await apiClient.get('/api/newsletters/stats');
            return response;
        } catch (error) {
            console.error('Error fetching newsletter stats:', error);
            throw error;
        }
    }
};
