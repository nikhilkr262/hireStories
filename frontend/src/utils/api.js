import axios from 'axios';
import { getBaseUrl } from './config';

const api = axios.create({
    baseURL: getBaseUrl('gateway'), // Default to Gateway or specific if logic changes, but mostly used for authenticated calls which go to gateway? 
    // Actually api.js seems unused in pages right now, they use axios direct. 
    // But let's set it to getBaseUrl('auth')? No, 'gateway'.
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
