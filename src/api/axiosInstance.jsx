import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
});


// Request interceptor

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('userJwt');
    if (token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));


// Response interceptor

api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry){
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken){
            localStorage.removeItem('userJwt');
            window.location.href = "/login";
            return Promise.reject(error);
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/refresh`, { refreshToken }
            );

            const { token, refreshToken: newRefreshToken } = response.data;
            localStorage.setItem('userJwt', token);
            if (newRefreshToken){
                localStorage.setItem('refreshToken', newRefreshToken);
            }

            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
        } catch (refreshError) {
            localStorage.removeItem('userJwt');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
})

export default api;