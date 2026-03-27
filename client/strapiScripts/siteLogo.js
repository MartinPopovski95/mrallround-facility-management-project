import { API_CONFIG } from "../config.js";

async function loadSiteAssets(locale = "en") {
	try {
		const response = await fetch(
			`${API_CONFIG.BASE_URL}/api/site-setting?locale=${locale}`
		);

		if (!response.ok) {
			throw new Error(` ${response.status}`);
		}

		const data = await response.json();

		const navbarLogoUrl = data.navbarLogoUrl;
		const footerLogoUrl = data.footerLogoUrl;

		const navbarImg = document.getElementById("navbar-logo");
		const footerImg = document.getElementById("footer-logo");
        
        if (navbarImg && navbarLogoUrl) {
            navbarImg.src = navbarLogoUrl;
        }

		if (footerImg && footerLogoUrl) {
			footerImg.src = footerLogoUrl;
		}

		const navbarImgDe = document.getElementById("navbar-logo-de");
		const footerImgDe = document.getElementById("footer-logo-de");

		if (navbarImgDe && navbarLogoUrl) {
			navbarImgDe.src = navbarLogoUrl;
		}

		if (footerImgDe && footerLogoUrl) {
			footerImgDe.src = footerLogoUrl;
		}
	} catch (err) {}
}

loadSiteAssets("en");
