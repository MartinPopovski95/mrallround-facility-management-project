function detectEnvironment() {
    const hostname = window.location.hostname;
    const port = window.location.port;

    // Development: localhost with Live Server (port 5500) or local file
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        if (port === '5500' || port === '') {
            return 'development';
        }
    }

    // Staging: staging subdomain or specific hostname
    if (hostname.includes('staging') || hostname.includes('test')) {
        return 'staging';
    }

    // Production: everything else
    return 'production';
}

// Configuration by environment
const environments = {
    development: {
        BASE_URL: 'https://localhost:7091',
        STRAPI_URL: 'http://localhost:1337',
    },
    staging: {
        BASE_URL: 'https://example.com',  // Update with staging URL
        STRAPI_URL: 'https://cms.example.com',  // Update with staging URL
    },
    production: {
        BASE_URL: 'inspiring-flow-production-06b6.up.railway.app',  // Update with production URL
        STRAPI_URL: 'mrallround-facility-management-project-backend-production.up.railway.app',  // Update with production URL
    }
};

// Get current environment and config
const currentEnvironment = detectEnvironment();
const config = environments[currentEnvironment];

// API Configuration object (maintains backward compatibility)
const API_CONFIG = {
    BASE_URL: config.BASE_URL,
    STRAPI_URL: config.STRAPI_URL,

    // Helper methods for consistent URL construction
    getApiUrl: (endpoint = '') => {
        const base = config.BASE_URL.replace(/\/$/, '');
        const path = endpoint.replace(/^\//, '');
        return path ? `${base}/${path}` : base;
    },

    getStrapiUrl: (endpoint = '') => {
        const base = config.STRAPI_URL.replace(/\/$/, '');
        const path = endpoint.replace(/^\//, '');
        return path ? `${base}/${path}` : base;
    },

    // Environment check helpers
    isDevelopment: () => currentEnvironment === 'development',
    isStaging: () => currentEnvironment === 'staging',
    isProduction: () => currentEnvironment === 'production',
    getEnvironment: () => currentEnvironment,
};

// Log current environment in development
if (API_CONFIG.isDevelopment()) {
}

export { API_CONFIG };
export default API_CONFIG;
