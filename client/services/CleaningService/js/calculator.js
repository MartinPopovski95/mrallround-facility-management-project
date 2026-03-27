import { translations } from "./translations.js";
import { calculatePrice, formatCalculationRequest } from "./api.js";

class ServiceCalculator {
	constructor(serviceType = "cleaning") {
		this.serviceType = serviceType;
		this.currentLocale = this.detectLocale();
		this.formData = {};
		this.isCalculating = false;
		this.init();
	}

	detectLocale() {
		const urlParams = new URLSearchParams(window.location.search);
		const urlLocale = urlParams.get("locale");
		const savedLocale = localStorage.getItem("selectedLanguage");
		return urlLocale || savedLocale || "en";
	}

	init() {
		this.bindEvents();
		this.bindLanguageSwitch();
		this.applyTranslations();
		this.initializeFormData();
		this.updateQuoteButtonEmail();
		this.calculate();
	}

	initializeFormData() {
		const form = document.getElementById("calculator-form");
		if (!form) return;

		const inputs = form.querySelectorAll("input, select");
		inputs.forEach((input) => {
			const { name, value, type, checked } = input;

			if (!name) return;

			if (type === "checkbox") {
				this.formData[name] = checked;
			} else if (type === "range") {
				this.formData[name] = parseFloat(value);
				this.updateRangeDisplay(input);
			} else {
				this.formData[name] = value;
			}
		});
	}

	bindEvents() {
		const form = document.getElementById("calculator-form");
		if (!form) return;

		const inputs = form.querySelectorAll("input, select");
		inputs.forEach((input) => {
			input.addEventListener("input", () =>
				this.handleInputChange(input)
			);
			input.addEventListener("change", () =>
				this.handleInputChange(input)
			);
		});

		const quoteBtn = document.getElementById("openServiceFormBtn");
		if (quoteBtn) {
			quoteBtn.addEventListener("click", () => this.handleGetQuote());
		}
	}

	bindLanguageSwitch() {
		const engBtn = document.getElementById("eng");
		const gerBtn = document.getElementById("ger");

		if (engBtn) {
			engBtn.addEventListener("change", () => {
				if (engBtn.checked) {
					this.setLocale("en");
				}
			});
		}

		if (gerBtn) {
			gerBtn.addEventListener("change", () => {
				if (gerBtn.checked) {
					this.setLocale("de");
				}
			});
		}
	}

	handleInputChange(input) {
		const { name, value, type, checked } = input;

		if (type === "checkbox") {
			this.formData[name] = checked;
		} else if (type === "range") {
			this.formData[name] = parseFloat(value);
			this.updateRangeDisplay(input);
		} else {
			this.formData[name] = value;
		}

		this.calculate();
	}

	updateRangeDisplay(rangeInput) {
		const valueDisplay =
			rangeInput.parentElement.querySelector(".range-value");
		if (valueDisplay) {
			const value = parseFloat(rangeInput.value);
			const unit = rangeInput.dataset.unit || "";
			valueDisplay.textContent = `${value.toLocaleString()} ${unit}`;
		}

		const min = parseFloat(rangeInput.min);
		const max = parseFloat(rangeInput.max);
		const value = parseFloat(rangeInput.value);
		const percentage = ((value - min) / (max - min)) * 100;

		rangeInput.style.background = `linear-gradient(to right, var(--primary-color, #c51f5d) 0%, var(--primary-color, #c51f5d) ${percentage}%, var(--border-color, #e2e8f0) ${percentage}%, var(--border-color, #e2e8f0) 100%)`;
	}

	async calculate() {
		if (this.isCalculating) return;

		this.isCalculating = true;

		const calculatorCard = document.querySelector(".calculator-card");
		const resultPrice = document.getElementById("calculator-result-price");

		if (calculatorCard) calculatorCard.classList.add("loading");
		if (resultPrice) resultPrice.classList.add("loading");

		try {
			const request = formatCalculationRequest(
				this.serviceType,
				this.formData
			);

			const result = await calculatePrice(request);

			this.displayResult(result.totalPrice, result);
		} catch (error) {
			this.displayError(error.message);
		} finally {
			this.isCalculating = false;

			if (calculatorCard) calculatorCard.classList.remove("loading");
			if (resultPrice) resultPrice.classList.remove("loading");
		}
	}

	displayResult(price, fullResult = null) {
		const resultElement = document.getElementById(
			"calculator-result-price"
		);
		if (!resultElement) return;

		const formattedPrice = new Intl.NumberFormat("de-CH", {
			style: "currency",
			currency: "CHF",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(price);

		resultElement.style.opacity = "0.5";
		setTimeout(() => {
			resultElement.textContent = formattedPrice;
			resultElement.style.opacity = "1";
		}, 150);

		this.lastCalculatedPrice = price;
		this.lastCalculationResult = fullResult;
		this.updateQuoteButtonEmail();
	}

	displayError(errorMessage) {
		const resultElement = document.getElementById(
			"calculator-result-price"
		);
		if (!resultElement) return;

		resultElement.classList.add("error");

		resultElement.style.opacity = "0.5";
		setTimeout(() => {
			resultElement.textContent = "Error calculating price";
			resultElement.style.opacity = "1";
		}, 150);

		setTimeout(() => {
			resultElement.classList.remove("error");

			this.calculate();
		}, 3000);

	}

	handleGetQuote() {
		const quoteData = {
			serviceType: this.serviceType,
			formData: this.formData,
			estimatedPrice: this.lastCalculatedPrice,
			calculationDetails: this.lastCalculationResult,
			timestamp: new Date().toISOString(),
		};

		sessionStorage.setItem("serviceQuote", JSON.stringify(quoteData));

		const contactSection = document.getElementById("contact-section");
		if (contactSection) {
			contactSection.scrollIntoView({ behavior: "smooth" });
		} else {
		}
	}

	updateQuoteButtonEmail() {
		const quoteBtn = document.getElementById('request-quote-btn');
		if (!quoteBtn) return;

		const email = window.getQuoteRequestEmail ? window.getQuoteRequestEmail() : 'info@mrallround.ch';

		const serviceTypeName = this.serviceType.charAt(0).toUpperCase() + this.serviceType.slice(1);
		const subjectTemplate = this.getTranslation('email.subjectTemplate');
		const subject = encodeURIComponent(
			subjectTemplate.replace('{serviceType}', serviceTypeName)
		);

		const bodyLines = [
			this.getTranslation('email.greeting'),
			'',
			this.getTranslation('email.intro'),
			'',
			this.getTranslation('email.detailsHeader'),
		];

		if (this.formData.area) {
			const areaLabel = this.getTranslation('email.areaLabel');
			bodyLines.push(`- ${areaLabel}: ${this.formData.area} m²`);
		}
		if (this.formData.package) {
			const packageSelect = document.getElementById('package');
			const selectedOption = packageSelect?.options[packageSelect.selectedIndex];
			const packageName = selectedOption?.textContent || this.formData.package;
			const packageLabel = this.getTranslation('email.packageLabel');
			bodyLines.push(`- ${packageLabel}: ${packageName}`);
		}
		if (this.lastCalculatedPrice) {
			const formattedPrice = new Intl.NumberFormat('de-CH', {
				style: 'currency',
				currency: 'CHF',
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			}).format(this.lastCalculatedPrice);
			const priceLabel = this.getTranslation('email.priceLabel');
			bodyLines.push(`- ${priceLabel}: ${formattedPrice}`);
		}

		bodyLines.push(
			'',
			this.getTranslation('email.closing'),
			'',
			this.getTranslation('email.signature')
		);

		const body = encodeURIComponent(bodyLines.join('\n'));

		quoteBtn.href = `mailto:${email}?subject=${subject}&body=${body}`;
	}

	applyTranslations() {
		const calculatorSection = document.querySelector(".calculator-section");
		if (!calculatorSection) return;

		const elements = calculatorSection.querySelectorAll("[data-i18n]");
		elements.forEach((element) => {
			if (element.hasAttribute("data-cms-managed")) {
				return;
			}

			const key = element.getAttribute("data-i18n");
			const translation = this.getTranslation(key);
			if (translation) {
				if (
					element.tagName === "INPUT" &&
					element.hasAttribute("placeholder")
				) {
					element.placeholder = translation;
				} else {
					element.textContent = translation;
				}
			}
		});
	}

	getTranslation(key) {
		const keys = key.split(".");
		let value = translations[this.currentLocale];

		for (const k of keys) {
			if (value && value[k]) {
				value = value[k];
			} else {
				return translations.en[key] || key;
			}
		}

		return value;
	}

	setLocale(locale) {
		this.currentLocale = locale;
		this.applyTranslations();
	}
}

function initCalculator() {
	const path = window.location.pathname;
	let serviceType = "cleaning";

	if (path.includes("Maintenance")) {
		serviceType = "maintenance";
	} else if (path.includes("Renovation")) {
		serviceType = "renovation";
	} else if (path.includes("Cleaning")) {
		serviceType = "cleaning";
	}

	window.serviceCalculator = new ServiceCalculator(serviceType);

	const rangeInputs = document.querySelectorAll(".range-input");
	rangeInputs.forEach((input) => {
		window.serviceCalculator.updateRangeDisplay(input);
	});
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initCalculator);
} else {
	initCalculator();
}

export { ServiceCalculator };
