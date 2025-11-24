// utils/csrf.js - Utilidad centralizada para CSRF tokens
export const getCsrfToken = () => {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
        const trimmed = cookie.trim();
        if (trimmed.startsWith(name + '=')) {
            return decodeURIComponent(trimmed.substring(name.length + 1));
        }
    }

    // Si no hay cookie, intentar obtener del meta tag
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
        return metaTag.getAttribute('content');
    }

    return null;
};

// Configuración de axios con CSRF token
export const getAxiosConfig = (additionalHeaders = {}) => {
    const csrfToken = getCsrfToken();

    return {
        withCredentials: true,
        headers: {
            'X-CSRFToken': csrfToken,
            ...additionalHeaders
        }
    };
};

// Para FormData
export const getAxiosConfigMultipart = () => {
    const csrfToken = getCsrfToken();

    return {
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data',
            'X-CSRFToken': csrfToken
        }
    };
};
