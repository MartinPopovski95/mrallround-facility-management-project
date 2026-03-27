import { API_CONFIG } from '../config.js';

const NAVIGATION_API_URL = `${API_CONFIG.BASE_URL}/api/service-links`;

const FALLBACK_SERVICES = [
    {
        serviceName: 'Cleaning Services',
        serviceUrl: 'services/CleaningService/Cleaning.html',
        translationKey: 'cleaning',
        displayOrder: 1
    },
    {
        serviceName: 'Property Maintenance',
        serviceUrl: 'services/Property Maintenance/PropertyMaintenance.html',
        translationKey: 'maintenance',
        displayOrder: 2
    },
    {
        serviceName: 'Renovation Services',
        serviceUrl: 'services/Renovation Service/Renovation.html',
        translationKey: 'security',
        displayOrder: 3
    },
    {
        serviceName: 'Disposal Services',
        serviceUrl: 'services/Disposal Service/Disposal.html',
        translationKey: 'disposal',
        displayOrder: 4
    },
    {
        serviceName: 'Relocation Services',
        serviceUrl: 'services/Relocation Service/Relocation.html',
        translationKey: 'relocation',
        displayOrder: 5
    }
];

/**
 * Fetch service links from API
 * @param {string} locale - Language code (en/de)
 * @returns {Array} Service links or empty array on failure
 */
async function fetchServiceLinks(locale = 'en') {
    try {
        const response = await fetch(`${NAVIGATION_API_URL}?locale=${locale}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();


        if (Array.isArray(data) && data.length > 0) {
            return data;
        }


        if (locale !== 'en') {
            const fallbackResponse = await fetch(`${NAVIGATION_API_URL}?locale=en`);
            if (fallbackResponse.ok) {
                const fallbackData = await fallbackResponse.json();
                if (Array.isArray(fallbackData) && fallbackData.length > 0) {
                    return fallbackData;
                }
            }
        }

        return [];
    } catch (err) {
        return [];
    }
}

/**
 * Normalize URLs based on current page location
 * @param {string} url - Service URL from API
 * @returns {string} Adjusted URL with correct relative path
 */
function normalizeUrl(url) {
    if (!url) return '#';


    const currentPath = window.location.pathname;
    const depth = currentPath.split('/').filter(p => p).length;





    if (depth >= 3) {

        return url.startsWith('../') ? url : `../../${url}`;
    } else if (depth === 2) {

        return url.startsWith('../') ? url : `../${url}`;
    } else {

        return url;
    }
}

/**
 * Render service links in navbar dropdown
 * @param {Array} services - Service link data
 */
function renderNavbarDropdown(services) {
    const dropdown = document.getElementById('navbar-services-dropdown');
    if (!dropdown) return;


    if (!services || services.length === 0) {

        return;
    }


    dropdown.innerHTML = '';


    services.forEach(service => {
        const li = document.createElement('li');
        const a = document.createElement('a');

        a.className = 'dropdown-item';
        a.href = normalizeUrl(service.serviceUrl);
        a.textContent = service.serviceName;


        a.setAttribute('data-cms-managed', 'true');

        li.appendChild(a);
        dropdown.appendChild(li);
    });
}

/**
 * Render service links in footer
 * @param {Array} services - Service link data
 */
function renderFooterServiceList(services) {
    const footerList = document.getElementById('footer-services-list');
    if (!footerList) return;


    if (!services || services.length === 0) {

        return;
    }


    footerList.innerHTML = '';


    services.forEach(service => {
        const li = document.createElement('li');
        const a = document.createElement('a');

        a.className = 'underlined';
        a.href = normalizeUrl(service.serviceUrl);
        a.textContent = service.serviceName;


        a.setAttribute('data-cms-managed', 'true');

        li.appendChild(a);
        footerList.appendChild(li);
    });
}

/**
 * Main function to load and render navigation data
 * @param {string} locale - Language code
 */
async function loadNavigationData(locale = 'en') {
    try {

        let services = await fetchServiceLinks(locale);


        if (!services || services.length === 0) {
            services = FALLBACK_SERVICES;
        }


        renderNavbarDropdown(services);
        renderFooterServiceList(services);

    } catch (err) {

    }
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const storedLang = localStorage.getItem('selectedLanguage') || 'en';
        loadNavigationData(storedLang);
    });
} else {
    const storedLang = localStorage.getItem('selectedLanguage') || 'en';
    loadNavigationData(storedLang);
}


document.addEventListener('DOMContentLoaded', function () {
    const langButtons = document.querySelectorAll('input[name="lang"]');
    langButtons.forEach((button) => {
        button.addEventListener('change', function () {
            if (this.checked) {
                const locale = this.value;
                loadNavigationData(locale);
            }
        });
    });
});
