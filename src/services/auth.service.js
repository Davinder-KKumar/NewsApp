import { API_BASE_URL, API_ENDPOINTS } from './api.config';

export const authService = {
    async login(email, password) {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }

        return await response.json();
    },

    async register(userData) {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const error = await response.json();
            if (error.error === 'EMAIL_ALREADY_EXISTS') {
                throw new Error('Email already registered');
            }
            throw new Error('Registration failed');
        }

        return await response.json();
    },

    async logout() {
        localStorage.removeItem('user');
    }
};