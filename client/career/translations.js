const careerTranslations = {
	en: {
		home: "Home",
		about: "About Us",
		career: "Career",
		services: "Services",
		cleaning: "Cleaning Services",
		maintenance: "Property Maintenance",
		security: "Renovation Services",
		disposal: "Disposal Services",
		relocation: "Relocation Services",

		heroTitle: "Advance Your Career in Facility Management",
		heroSubtitle:
			"Join a team committed to operational excellence, safety, and sustainable infrastructure solutions.",

		quote1: '"Excellence in Service"',
		quote1Label: "Our Commitment",
		quote2: '"Growth Together"',
		quote2Label: "Our Philosophy",
		quote3: '"Innovation First"',
		quote3Label: "Our Approach",
		quote4: '"People Matter"',
		quote4Label: "Our Values",

		testimonialsTitle: "What Our Team Says",
		testimonialsSubtitle: "Hear from our employees about their experience",

		processTitle: "Application Process",
		processSubtitle: "Simple steps to join our team",

		formTitle: "Join Our Team",
		formSubtitle: "Fill out the form to start your journey",
		firstName: "First Name",
		lastName: "Last Name",
		email: "Email",
		phone: "Phone Number",
		serviceArea: "Service Area",
		selectService: "Select a service",
		cleaningOption: "Cleaning",
		maintenanceOption: "Maintainance",
		securityOption: "Renovation",
		whyHire: "Why should we hire you?",
		whyHirePlaceholder: "Tell us why you're a great fit",
		uploadCV: "Upload Your CV",
		chooseFile: "Choose file...",
		submit: "Submit Application",

		navigation: "Navigation",
		serviceList: "Service list",
		cleaningServices: "Cleaning Services",
		maintenanceServices: "Maintainance",
		securityServices: "Renovation Services",
		contactUs: "Contact Us",
		contact: "Contact",
		copyright: "Copyright ©2025 Mr. Allround. All rights reserved",
	},

	de: {
		home: "Heim",
		about: "Über uns",
		career: "Karriere",
		services: "Dienstleistungen",
		cleaning: "Reinigungsdienste",
		maintenance: "Immobilienwartung",
		security: "Renovationen",
		disposal: "Entsorgungsdienste",
		relocation: "Umzugsdienste",

		heroTitle: "Bringen Sie Ihre Karriere im Facility Management voran",
		heroSubtitle:
			"Werden Sie Teil eines Teams, das sich für operative Exzellenz, Sicherheit und nachhaltige Infrastrukturlösungen einsetzt.",

		quote1: '"Exzellenz im Service"',
		quote1Label: "Unser Engagement",
		quote2: '"Gemeinsam Wachsen"',
		quote2Label: "Unsere Philosophie",
		quote3: '"Innovation Zuerst"',
		quote3Label: "Unser Ansatz",
		quote4: '"Menschen Zählen"',
		quote4Label: "Unsere Werte",

		testimonialsTitle: "Was unser Team sagt",
		testimonialsSubtitle: "Hören Sie von unseren Mitarbeitern über ihre Erfahrungen",

		processTitle: "Bewerbungsprozess",
		processSubtitle: "Einfache Schritte, um unserem Team beizutreten",

		formTitle: "Treten Sie unserem Team bei",
		formSubtitle: "Füllen Sie das Formular aus, um Ihre Reise zu beginnen",
		firstName: "Vorname",
		lastName: "Nachname",
		email: "E-Mail",
		phone: "Telefonnummer",
		serviceArea: "Servicebereich",
		selectService: "Wählen Sie einen Dienst aus",
		cleaningOption: "Reinigung",
		maintenanceOption: "Wartung",
		securityOption: "Renovationen",
		whyHire: "Warum sollten wir Sie einstellen?",
		whyHirePlaceholder: "Erzählen Sie uns, warum Sie gut passen",
		uploadCV: "Laden Sie Ihren Lebenslauf hoch",
		chooseFile: "Datei auswählen...",
		submit: "Bewerbung einreichen",

		navigation: "Navigation",
		serviceList: "Dienstleistungsliste",
		cleaningServices: "Reinigungsdienste",
		maintenanceServices: "Wartung",
		securityServices: "Renovationen",
		contactUs: "Kontaktieren Sie uns",
		contact: "Kontakt",
		copyright: "Copyright ©2025 Mr. Allround. Alle Rechte vorbehalten",
	},
};

function applyCareerTranslations(lang) {
	const t = careerTranslations[lang] || careerTranslations.en;

	document.querySelectorAll("[data-i18n]").forEach((el) => {
		const key = el.getAttribute("data-i18n");
		if (t[key]) {
			if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
				if (el.hasAttribute("placeholder")) {
					el.placeholder = t[key];
				}
			} else if (el.tagName === "OPTION") {
				el.textContent = t[key];
			} else {
				el.textContent = t[key];
			}
		}
	});

	document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
		const key = el.getAttribute("data-i18n-placeholder");
		if (t[key]) {
			el.placeholder = t[key];
		}
	});

	const fileCustom = document.querySelector(".file-custom");
	if (fileCustom && t.chooseFile) {
		fileCustom.textContent = t.chooseFile;
	}
}
