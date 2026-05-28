import axios from 'axios';

if (import.meta.env.DEV) {
    console.log(`[dev] API base URL: ${import.meta.env.VITE_API_URL}`);
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token);
    });
    failedQueue = [];
}

function clearSessionAndRedirect() {
    localStorage.removeItem('userJwt');
    localStorage.removeItem('refreshToken');
    window.location.href = '/signin';
}

// Request interceptor

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('userJwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));


// Response interceptor

api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry || originalRequest.url?.includes('/auth/')) {
        return Promise.reject(error);
    }

    // While a refresh is already in progress, queue this request until it resolves
    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
        }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
        }).catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        isRefreshing = false;
        clearSessionAndRedirect();
        return Promise.reject(error);
    }

    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/refresh`, { refreshToken }
        );

        const { token, refreshToken: newRefreshToken } = response.data;
        if (!token || typeof token !== 'string') {
            throw new Error('Invalid response from refresh endpoint');
        }
        localStorage.setItem('userJwt', token);
        if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
        }

        processQueue(null, token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
    } catch (refreshError) {
        processQueue(refreshError, null);
        clearSessionAndRedirect();
        return Promise.reject(refreshError);
    } finally {
        isRefreshing = false;
    }
});

export default api;