import axios from 'axios';

import { Storage } from "../utils/storage";

export const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        Authorization: `Bearer ${Storage.getItem('token')}`,
        refresh: Storage.getItem('refresh'),
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

api.interceptors.response.use((config) => {
    return config;
}, (error) => {
    console.log(error.response);
    if (error.response.status === 400 && error.response.data.detail) {
        return { ...error, data: error.response.data.detail.map(fieldError => fieldError.field) };
    }
});