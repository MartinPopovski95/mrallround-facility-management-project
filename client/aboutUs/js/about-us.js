import { API_CONFIG } from '../../config.js';

(() => {
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
			ctaHeading: "Have Questions? Let's Talk!",
			ctaText:
				"We're here to help you with anything you need — fast and friendly.",
			ctaButton: "Contact Us",
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
			address: "Bannstrasse 5, 4600 Olten, Schweiz",
			copyright:
				"Urheberrecht ©2025 Mr. Allround. Alle Rechte vorbehalten",
			ctaHeading: "Haben Sie Fragen? Sprechen wir!",
			ctaText:
				"Wir sind hier, um Ihnen schnell und freundlich bei allem zu helfen, was Sie brauchen.",
			ctaButton: "Kontaktieren Sie uns",
		},
	};

	function applyTranslations(locale) {
		document.querySelectorAll("[data-i18n]").forEach((el) => {
			const key = el.getAttribute("data-i18n");
			if (translations[locale] && translations[locale][key]) {
				el.textContent = translations[locale][key];
			}
		});
	}
	const API_URL = API_CONFIG.getApiUrl('/api/AboutUs');
	const STRAPI_ORIGIN = API_CONFIG.STRAPI_URL;

	const $id = (id) => document.getElementById(id);
	const get = (o, p, d = "") =>
		p.split(".").reduce((a, k) => (a && a[k] != null ? a[k] : null), o) ??
		d;

	const mediaUrl = (obj, base = STRAPI_ORIGIN) => {
		const candidate =
			get(obj, "url") || get(obj, "data.attributes.url") || "";
		if (!candidate) return "";
		if (/^https?:\/\//.test(candidate)) return candidate;
		if (candidate.startsWith("/"))
			return `${base.replace(/\/$/, "")}${candidate}`;
		return candidate;
	};

	const proxify = (url) => {
		if (!url) return "";
		if (location.protocol === "https:" && /^http:\/\//.test(url)) {
			return `/api/media-proxy?url=${encodeURIComponent(url)}`;
		}
		return url;
	};

	const setHTML = (el, v) => {
		if (el && v != null) el.innerHTML = v;
	};
	const setSrc = (el, url, alt) => {
		if (el && url) {
			el.loading = "lazy";
			el.decoding = "async";
			el.src = url;
			if (alt) el.alt = alt;
		}
	};
	const extractSrcFromIframe = (input) => {
		if (!input) return "";
		const trimmed = input.trim();

		if (trimmed.toLowerCase().includes("<iframe")) {
			const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
			return srcMatch ? srcMatch[1] : "";
		}

		return trimmed;
	};

	const setIframeSrc = (el, urlOrIframe) => {
		if (el && urlOrIframe) {
			const extractedSrc = extractSrcFromIframe(urlOrIframe);
			if (extractedSrc) el.src = extractedSrc;
		}
	};

	const hasText = (v) => typeof v === "string" && v.trim().length > 0;
	const setTextOrHide = (el, v) => {
		if (!el) return;
		if (hasText(v)) {
			el.style.display = "";
			el.textContent = v;
		} else {
			el.textContent = "";
			el.style.display = "none";
		}
	};

	const fetchJSON = async (url) => {
		const res = await fetch(url, {
			headers: { Accept: "application/json" },
		});
		if (!res.ok) {
			const body = await res.text().catch(() => "");
			throw new Error(`${res.status} ${res.statusText} :: ${body}`);
		}
		return res.json();
	};

	const setLoading = (on) => {
		if (document.querySelector(".aboutUs")) {
			document
				.querySelector(".aboutUs")
				.classList.toggle("is-loading", !!on);
		}
	};

	const mdLite = (md) =>
		(md || "")
			.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
			.replace(/\*(.*?)\*/g, "<em>$1</em>")
			.replace(/\n{2,}/g, "</p><p>")
			.replace(/\n/g, "<br>");

	const dom = {
		root: document.querySelector(".aboutUs"),
		missionTitle: $id("missionTitle"),
		missionText: $id("missionText"),
		missionImg: $id("missionImg"),
		mapIframe: document.querySelector(".aboutUs-GMaps2"),
		locationTitle: $id("locationTitle"),
		locationText: $id("locationText"),
		servicesTitle: $id("servicesTitle"),
		servicesText: $id("servicesText"),
		servicesImg: $id("servicesImg"),
		contactCtaLink: $id("contactCtaLink"),
	};

	async function loadAboutUs(locale = "en") {
		setLoading(true);
		applyTranslations(locale);
		localStorage.setItem("selectedLanguage", locale);

		try {
			const data = await fetchJSON(
				`${API_URL}?locale=${encodeURIComponent(locale)}`
			);

			if (
				typeof data.ourMissionTitle === "string" &&
				data.ourMissionTitle.startsWith("Error")
			) {
				setLoading(false);
				showError("Could not load About Us content.");
				return;
			}

			const missionImgUrl =
				data.ourMissionImageUrl ||
				mediaUrl(get(data, "ourMissionImage")) ||
				"";
			const servicesImgUrl =
				data.servicesImageUrl ||
				mediaUrl(get(data, "servicesImage")) ||
				"";
			const missionSrc = proxify(missionImgUrl);
			const servicesSrc = proxify(servicesImgUrl);

			queueMicrotask(() => {
				setTextOrHide(dom.missionTitle, data.ourMissionTitle);
				setHTML(dom.missionText, mdLite(data.ourMissionText));
				setSrc(dom.missionImg, missionSrc, "Our mission");
				setIframeSrc(dom.mapIframe, data.mapEmbedUrl || "");

				setTextOrHide(dom.locationTitle, data.locationTitle);
				setHTML(dom.locationText, mdLite(data.locationText));

				setTextOrHide(dom.servicesTitle, data.servicesTitle);
				setHTML(dom.servicesText, mdLite(data.servicesText));
				setSrc(dom.servicesImg, servicesSrc, "Our services");

				if (dom.contactCtaLink && data.contactEmail) {
					dom.contactCtaLink.href = `mailto:${data.contactEmail}`;
				}

				setLoading(false);
			});
		} catch (e) {
			setLoading(false);
			showError("Could not load About Us content.");
			if (locale !== "en") {
				loadAboutUs("en");
			}
		}
	}

	function initLanguageSwitch(loadFn) {
		const savedLang = localStorage.getItem("selectedLanguage") || "en";
		const engBtn = document.getElementById("eng");
		const gerBtn = document.getElementById("ger");

		if (engBtn && gerBtn) {
			engBtn.checked = savedLang === "en";
			gerBtn.checked = savedLang === "de";

			engBtn.addEventListener(
				"change",
				() => engBtn.checked && loadFn("en")
			);
			gerBtn.addEventListener(
				"change",
				() => gerBtn.checked && loadFn("de")
			);
		}

		loadFn(savedLang);
	}
	document.addEventListener("DOMContentLoaded", () => {
		initLanguageSwitch(loadAboutUs);
	});

	window.loadAboutUs = loadAboutUs;
})();
