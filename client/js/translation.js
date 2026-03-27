const translations = {
		en: {
			home: "Home",
			about: "About Us",
			career: "Career",
			services: "Services",
			cleaning: "Cleaning Services",
			maintenance: "Maintenance Services",
			security: "Renovation Services",
			navigationTitle: "Navigation",
			contactFooter: "Contact",
			serviceListTitle: "Service list",
			contactUsTitle: "Contact Us",
			address: "Bannstrasse 5, 4600 Olten, Switzerland",
			copyright: "Copyright ©2025 Mr. Allround. All rights reserved",
			"hero.getQuote": "Get a Quote",
			"hero.ourServices": "Our Services",
			"about.learnMore": "Learn More About Us",
			"services.learnMore": "Learn More",
			"career.viewJobs": "Apply",
			"reviews.title": "What Our Customers Say",
			"reviews.button": "Review us on Google",
			"reviews.readMore": "Read more",
		},
		de: {
			home: "Heim",
			about: "Über Uns",
			career: "Karriere",
			services: "Dienstleistungen",
			cleaning: "Reinigungsdienste",
			maintenance: "Wartungsdienste",
			security: "Renovationen",
			navigationTitle: "Navigation",
			contactFooter: "Kontakt",
			serviceListTitle: "Dienstleistungsliste",
			contactUsTitle: "Kontaktiere uns",
			copyright: "Urheberrecht ©2025 Mr. Allround. Alle Rechte vorbehalten",
			"hero.getQuote": "Angebot erhalten",
			"hero.ourServices": "Unsere Dienstleistungen",
			"about.learnMore": "Mehr über uns erfahren",
			"services.learnMore": "Mehr erfahren",
			"career.viewJobs": "Bewerben",
			"reviews.title": "Was unsere Kunden sagen",
			"reviews.button": "Bewerten Sie uns auf Google",
			"reviews.readMore": "Mehr lesen",
		},
	};

    function translatePage(lang) {
	const elements = document.querySelectorAll("[data-i18n]");
	elements.forEach(el => {
		const key = el.getAttribute("data-i18n");
		if (translations[lang] && translations[lang][key]) {
			el.textContent = translations[lang][key];
		}
	});
	localStorage.setItem("selectedLanguage", lang);
}

document.getElementById("eng").addEventListener("click", () => translatePage("en"));
document.getElementById("ger").addEventListener("click", () => translatePage("de"));

document.addEventListener("DOMContentLoaded", () => {
	const savedLang = localStorage.getItem("selectedLanguage") || "en";
	document.getElementById(savedLang === "en" ? "eng" : "ger").checked = true;
	translatePage(savedLang);
});