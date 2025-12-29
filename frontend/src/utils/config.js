export const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'https://hirestories-api-gateway.onrender.com';
export const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:8081';
export const INTERVIEW_SERVICE_URL = import.meta.env.VITE_INTERVIEW_SERVICE_URL || 'http://localhost:8082';

export const getBaseUrl = (service) => {
    // If in production mode, default to the API Gateway
    if (import.meta.env.PROD) {
        return API_GATEWAY_URL;
    }

    // In development mode, use specific service URLs unless Gateway is explicitly set
    if (import.meta.env.VITE_API_GATEWAY_URL) {
        return import.meta.env.VITE_API_GATEWAY_URL;
    }

    switch (service) {
        case 'auth':
            return AUTH_SERVICE_URL;
        case 'interview':
            return INTERVIEW_SERVICE_URL;
        default:
            return API_GATEWAY_URL;
    }
};
