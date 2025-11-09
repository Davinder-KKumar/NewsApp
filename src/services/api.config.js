export const API_BASE_URL = '';  // Using Vite proxy, so we don't need the full URL

export const API_ENDPOINTS = {
    NEWS: '/api/news',
    NEWSLETTERS: '/api/newsletters',
    ADMIN: '/api/admin',
    SUBSCRIBE: '/api/newsletters/subscribe'
};

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const createApiClient = () => {
    const defaultOptions = {
        credentials: 'include',
        headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json'
        }
    };

    return {
        get: async (endpoint, options = {}) => {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...defaultOptions,
                ...options,
                method: 'GET'
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `API request failed with status ${response.status}`);
            }
            return await response.json();
        },

        post: async (endpoint, data, options = {}) => {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...defaultOptions,
                ...options,
                method: 'POST',
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('API request failed');
            return await response.json();
        },

        put: async (endpoint, data, options = {}) => {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...defaultOptions,
                ...options,
                method: 'PUT',
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('API request failed');
            return await response.json();
        },

        delete: async (endpoint, options = {}) => {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...defaultOptions,
                ...options,
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('API request failed');
            return await response.json();
        }
    };
};

export const apiClient = createApiClient();