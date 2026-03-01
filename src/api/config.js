import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    const refresh = localStorage.getItem('refresh');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (refresh) config.headers.refresh = refresh;
    return config;
});

const AUTH_KEYS = ['token', 'refresh', 'medicare_user'];

function clearAuthStorage() {
    AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
}

api.interceptors.response.use(
    (config) => config,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 500) {
            clearAuthStorage();
            window.location.href = '/auth';
            return Promise.reject(error);
        }
        if (error.response?.status === 400 && Array.isArray(error.response?.data?.detail)) {
            error.response.data.detail = error.response.data.detail.map((d) =>
                typeof d === 'object' && d?.field != null ? d.field : d
            );
        }
        return Promise.reject(error);
    }
);