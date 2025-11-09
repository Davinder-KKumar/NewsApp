import { createApiClient, API_ENDPOINTS } from './api.config';

const apiClient = createApiClient();

export const NewsService = {
    async getTopHeadlines({ q = '', country = 'in', pageSize = 30, category = '' }) {
        const params = new URLSearchParams({
            q: category || q || '',
            country,
            pageSize: pageSize.toString()
        });

        const response = await apiClient.get(`${API_ENDPOINTS.NEWS}/top?${params}`);
        return response;
    },

    async searchNews({ q, language = 'en', sortBy = 'publishedAt', pageSize = 30 }) {
        const params = new URLSearchParams({
            q,
            language,
            sortBy,
            pageSize: pageSize.toString()
        });

        const response = await apiClient.get(`${API_ENDPOINTS.NEWS}/search?${params}`);
        return response;
    },

    async getNewsByCategory({ category, country = 'in', pageSize = 10 }) {
        const params = new URLSearchParams({
            category,
            country,
            pageSize: pageSize.toString()
        });

        const response = await apiClient.get(`${API_ENDPOINTS.NEWS}/category/${category}?${params}`);
        return response;
    }
};