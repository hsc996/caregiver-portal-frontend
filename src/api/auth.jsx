import api from './axiosInstance';

export const authAPI = {
    signup: async (username, email, password) => {
        const response = await api.post('/auth/signup', {
            username, email, password
        });

        return response.data;
    },

    signin: async (email, password) => {
        const response = await api.post('/auth/signin', {
            email, password
        });

        return response.data;
    },

    requestPasswordReset: async (email) => {
        const response = await api.post('/auth/forgot-password', {
            email: email.trim()
        });

        return response.data;
    },

    resetPassword: async (token, newPassword) => {
        const response = await api.post('/auth/reset-password', {
            token, newPassword
        });

        return response.data;
    },

    refreshToken: async (refreshToken) => {
        const response = await api.post('/auth/refresh', {
            refreshToken
        });

        return response.data;
    },

    logout: () => {
        localStorage.removeItem('userJwt');
        localStorage.removeItem('refreshToken');
    }
}