import { API_CONFIG } from '../config.js';

const FOOTER_API_URL = `${API_CONFIG.BASE_URL}/api/footer`;

async function loadFooterData(locale = 'en') {
    try {

        const response = await fetch(`${FOOTER_API_URL}?locale=${locale}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        
        const footerAddress = document.getElementById('footer-address');
        if (footerAddress && data.footerAddress) {
            footerAddress.textContent = data.footerAddress;
        }

        
        const footerEmailLink = document.getElementById('footer-email-link');
        const footerEmailText = document.getElementById('footer-email-text');
        if (data.footerEmail) {
            if (footerEmailLink) {
                footerEmailLink.href = `mailto:${data.footerEmail}`;
            }
            if (footerEmailText) {
                footerEmailText.textContent = data.footerEmail;
            }
        }


        const footerPhoneLink = document.getElementById('footer-phone-link');
        const footerPhoneText = document.getElementById('footer-phone-text');
        if (data.footerPhoneNumber) {
            if (footerPhoneLink) {

                const cleanPhone = data.footerPhoneNumber.replace(/\s+/g, '');
                footerPhoneLink.href = `tel:${cleanPhone}`;
            }
            if (footerPhoneText) {
                footerPhoneText.textContent = data.footerPhoneNumber;
            }
        }

        const facebookLink = document.getElementById('footer-facebook-link');
        if (facebookLink && data.facebookUrl) {
            facebookLink.href = data.facebookUrl;
        }

        const instagramLink = document.getElementById('footer-instagram-link');
        if (instagramLink && data.instagramUrl) {
            instagramLink.href = data.instagramUrl;
        }

        const linkedinLink = document.getElementById('footer-linkedin-link');
        if (linkedinLink && data.linkedinUrl) {
            linkedinLink.href = data.linkedinUrl;
        }

        const whatsappLink = document.getElementById('footer-whatsapp-link');
        if (whatsappLink && data.whatsappUrl) {
            whatsappLink.href = data.whatsappUrl;
        }

    } catch (err) {
    }
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const storedLang = localStorage.getItem('selectedLanguage') || 'en';
        loadFooterData(storedLang);
    });
} else {
    const storedLang = localStorage.getItem('selectedLanguage') || 'en';
    loadFooterData(storedLang);
}


document.addEventListener('DOMContentLoaded', function () {
    const langButtons = document.querySelectorAll('input[name="lang"]');
    langButtons.forEach((button) => {
        button.addEventListener('change', function () {
            if (this.checked) {
                const locale = this.value;
                loadFooterData(locale);
            }
        });
    });
});
