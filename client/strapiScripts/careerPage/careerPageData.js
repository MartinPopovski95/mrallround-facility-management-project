import { API_CONFIG } from '../../config.js';

const API_BASE_URL = API_CONFIG.BASE_URL;

/**
 * @param {string} locale - Language locale (en, de, etc.)
 * @returns {Promise<Object>} Career page data
 */
async function fetchCareerPageData(locale = "en") {
	try {
		const url = `${API_BASE_URL}/api/career/career-page?locale=${locale}`;
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		throw error;
	}
}

/**
 * Render the hero section with data from Strapi
 * @param {Object} heroSection - Hero section data
 */
async function renderCareerHeroSection(heroSection) {
	if (!heroSection) return;

	const heroTitle = document.querySelector(".hero-title");
	const heroSubtitle = document.querySelector(".hero-subtitle");

	if (heroTitle && heroSection.heroTitle) {
		heroTitle.textContent = heroSection.heroTitle;
	}

	if (heroSubtitle && heroSection.heroSubtitle) {
		heroSubtitle.textContent = heroSection.heroSubtitle;
	}

	if (heroSection.heroBackgroundImage?.url) {
		const heroSectionEl = document.querySelector(".hero-section");
		if (heroSectionEl) {
			const imageUrl = heroSection.heroBackgroundImage.url;

			heroSectionEl.dataset.bgImage = imageUrl;

			const isDarkMode = document.body.classList.contains('dark-mode');
			const gradient = isDarkMode
				? 'linear-gradient(135deg, rgba(10, 10, 10, 0.9) 0%, rgba(197, 31, 93, 0.8) 100%)'
				: 'linear-gradient(135deg, rgba(45, 55, 72, 0.95) 0%, rgba(197, 31, 93, 0.85) 100%)';

			heroSectionEl.style.backgroundImage = `${gradient}, url('${imageUrl}')`;
			heroSectionEl.style.backgroundSize = "cover";
			heroSectionEl.style.backgroundPosition = "center";
			heroSectionEl.style.backgroundAttachment = "fixed";
		}
	}
}

/**
 * Render the benefits section with data from Strapi
 * @param {Object} benefitsSection - Benefits section data
 */
function renderBenefitsSection(benefitsSection) {
	if (!benefitsSection) return;

	const sectionTitle = document.querySelector(".why-join-section .section-title");
	const sectionSubtitle = document.querySelector(".why-join-section .section-subtitle");

	if (sectionTitle && benefitsSection.benefitsSectionTitle) {
		sectionTitle.textContent = benefitsSection.benefitsSectionTitle;
	}
	if (sectionSubtitle && benefitsSection.benefitsSectionSubtitle) {
		sectionSubtitle.textContent = benefitsSection.benefitsSectionSubtitle;
	}

	if (benefitsSection.benefitCards && benefitsSection.benefitCards.length > 0) {
		const benefitCards = document.querySelectorAll(".benefit-card");

		const fallbackIcons = [
			`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="12" cy="8" r="7" />
				<path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" />
				<path d="M12 15l-2-2m4 0l-2 2" />
			</svg>`,
			`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
			</svg>`,
			`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
				<circle cx="9" cy="7" r="4" />
				<path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
			</svg>`,
			`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="12" cy="12" r="10" />
				<polyline points="12 6 12 12 16 14" />
			</svg>`
		];

		benefitsSection.benefitCards.forEach((benefit, index) => {
			if (benefitCards[index]) {
				const title = benefitCards[index].querySelector("h3");
				const description = benefitCards[index].querySelector("p");
				const iconDiv = benefitCards[index].querySelector(".benefit-icon");

				if (title && benefit.benefitTitle) {
					title.textContent = benefit.benefitTitle;
				}
				if (description && benefit.benefitDescription) {
					description.textContent = benefit.benefitDescription;
				}

				if (iconDiv && benefit.benefitIcon) {
					iconDiv.innerHTML = benefit.benefitIcon;
				} else if (iconDiv && fallbackIcons[index]) {
					iconDiv.innerHTML = fallbackIcons[index];
				}
			}
		});
	}
}

/**
 * @param {Object} valuesSection
 */
function renderValuesSection(valuesSection) {
	if (!valuesSection || !valuesSection.valueItems) return;

	const valuesRow = document.querySelector(".values-row");
	if (!valuesRow) return;

	valuesRow.innerHTML = '';

	valuesSection.valueItems.forEach((valueItem, index) => {
		const itemDiv = document.createElement('div');
		itemDiv.className = 'value-item';

		const contentDiv = document.createElement('div');
		contentDiv.className = 'value-content';

		const title = document.createElement('h3');
		title.textContent = valueItem.valueTitle;

		const label = document.createElement('p');
		label.textContent = valueItem.valueLabel;

		contentDiv.appendChild(title);
		contentDiv.appendChild(label);
		itemDiv.appendChild(contentDiv);

		valuesRow.appendChild(itemDiv);

		if (index < valuesSection.valueItems.length - 1) {
			const divider = document.createElement('div');
			divider.className = 'value-divider';
			valuesRow.appendChild(divider);
		}
	});
}

/**
 * @param {Object} testimonialsSection
 */
function renderTestimonialsSection(testimonialsSection) {
	if (!testimonialsSection) return;

	const sectionTitle = document.querySelector(".testimonials-section .section-title");
	const sectionSubtitle = document.querySelector(".testimonials-section .section-subtitle");

	if (sectionTitle && testimonialsSection.testimonialsSectionTitle) {
		sectionTitle.textContent = testimonialsSection.testimonialsSectionTitle;
	}
	if (sectionSubtitle && testimonialsSection.testimonialsSectionSubtitle) {
		sectionSubtitle.textContent = testimonialsSection.testimonialsSectionSubtitle;
	}

	if (testimonialsSection.testimonialCards && testimonialsSection.testimonialCards.length > 0) {
		const testimonialCards = document.querySelectorAll(".testimonial-card");

		const fallbackAvatar = `<svg viewBox="0 0 24 24" width="40" height="40">
			<path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
		</svg>`;

		testimonialsSection.testimonialCards.forEach((testimonial, index) => {
			if (testimonialCards[index]) {
				const text = testimonialCards[index].querySelector(".testimonial-content p");
				const name = testimonialCards[index].querySelector(".author-info h4");
				const role = testimonialCards[index].querySelector(".author-info p");
				const avatarDiv = testimonialCards[index].querySelector(".author-avatar");

				if (text && testimonial.testimonialText) {
					text.textContent = testimonial.testimonialText;
				}
				if (name && testimonial.authorName) {
					name.textContent = testimonial.authorName;
				}
				if (role && testimonial.authorRole) {
					role.textContent = testimonial.authorRole;
				}

				if (avatarDiv) {
					if (testimonial.authorAvatar?.url) {
						avatarDiv.innerHTML = `<img src="${testimonial.authorAvatar.url}" alt="${testimonial.authorName || 'Avatar'}" width="40" height="40" style="border-radius: 50%; object-fit: cover;">`;
					} else {
						avatarDiv.innerHTML = fallbackAvatar;
					}
				}
			}
		});
	}
}

/**
 * @param {Object} applicationProcessSection
 */
function renderApplicationProcessSection(applicationProcessSection) {
	if (!applicationProcessSection) return;

	const sectionTitle = document.querySelector(".process-section .section-title");
	const sectionSubtitle = document.querySelector(".process-section .section-subtitle");
	const processTimeline = document.querySelector(".process-timeline");

	if (sectionTitle && applicationProcessSection.processSectionTitle) {
		sectionTitle.textContent = applicationProcessSection.processSectionTitle;
	}
	if (sectionSubtitle && applicationProcessSection.processSectionSubtitle) {
		sectionSubtitle.textContent = applicationProcessSection.processSectionSubtitle;
	}

	if (processTimeline && applicationProcessSection.processSteps && applicationProcessSection.processSteps.length > 0) {
		processTimeline.innerHTML = '';
		processTimeline.className = 'process-timeline';

		const sortedSteps = [...applicationProcessSection.processSteps].sort((a, b) => a.stepNumber - b.stepNumber);
		const stepCount = sortedSteps.length;

		if (stepCount <= 4) {
			processTimeline.classList.add('timeline-horizontal');

			sortedSteps.forEach((step, index) => {
				const stepDiv = document.createElement('div');
				stepDiv.className = 'process-step';

				const stepNumber = document.createElement('div');
				stepNumber.className = 'step-number';
				stepNumber.textContent = step.stepNumber;

				const stepTitle = document.createElement('h3');
				stepTitle.textContent = step.stepTitle;

				const stepDesc = document.createElement('p');
				stepDesc.textContent = step.stepDescription;

				stepDiv.appendChild(stepNumber);
				stepDiv.appendChild(stepTitle);
				stepDiv.appendChild(stepDesc);

				processTimeline.appendChild(stepDiv);

				if (index < sortedSteps.length - 1) {
					const connector = document.createElement('div');
					connector.className = 'process-connector';
					processTimeline.appendChild(connector);
				}
			});
		} else {
			processTimeline.classList.add('timeline-vertical');

			sortedSteps.forEach((step, index) => {
				const stepDiv = document.createElement('div');
				stepDiv.className = 'process-step';

				const stepNumber = document.createElement('div');
				stepNumber.className = 'step-number';
				stepNumber.textContent = step.stepNumber;

				const contentWrapper = document.createElement('div');

				const stepTitle = document.createElement('h3');
				stepTitle.textContent = step.stepTitle;

				const stepDesc = document.createElement('p');
				stepDesc.textContent = step.stepDescription;

				contentWrapper.appendChild(stepTitle);
				contentWrapper.appendChild(stepDesc);

				stepDiv.appendChild(stepNumber);
				stepDiv.appendChild(contentWrapper);

				if (index < sortedSteps.length - 1) {
					const connector = document.createElement('div');
					connector.className = 'process-connector';
					stepDiv.appendChild(connector);
				}

				processTimeline.appendChild(stepDiv);
			});
		}
	}
}

/**
 * Render the service options dropdown with data from Strapi
 * @param {Array} serviceOptions - Service options array
 */
function renderServiceOptions(serviceOptions) {
	if (!serviceOptions || serviceOptions.length === 0) return;

	const serviceSelect = document.querySelector("#service");
	if (!serviceSelect) return;

	const firstOption = serviceSelect.querySelector('option[disabled][selected]');

	serviceSelect.innerHTML = '';

	if (firstOption) {
		serviceSelect.appendChild(firstOption);
	} else {
		const placeholder = document.createElement('option');
		placeholder.disabled = true;
		placeholder.selected = true;
		placeholder.value = '';
		placeholder.setAttribute('data-i18n', 'selectService');
		placeholder.textContent = 'Select a service';
		serviceSelect.appendChild(placeholder);
	}

	serviceOptions.forEach((option) => {
		const optionElement = document.createElement('option');
		optionElement.value = option.serviceLabel || '';
		optionElement.textContent = option.serviceLabel || '';
		serviceSelect.appendChild(optionElement);
	});
}

/**
 * Render the life section with data from Strapi
 * @param {Object} lifeSection - Life section data
 */
function renderLifeSection(lifeSection) {
	if (!lifeSection) return;

	const sectionTitle = document.querySelector(".life-section .section-title");
	const sectionSubtitle = document.querySelector(".life-section .section-subtitle");

	if (sectionTitle && lifeSection.lifeSectionTitle) {
		sectionTitle.textContent = lifeSection.lifeSectionTitle;
	}
	if (sectionSubtitle && lifeSection.lifeSectionSubtitle) {
		sectionSubtitle.textContent = lifeSection.lifeSectionSubtitle;
	}

	if (lifeSection.lifeItems && lifeSection.lifeItems.length > 0) {
		const lifeContainer = document.querySelector(".life-container");

		if (!lifeContainer) return;

		lifeContainer.innerHTML = '';

		lifeSection.lifeItems.forEach((item) => {
			const lifeRow = document.createElement('div');
			lifeRow.className = item.isReversed ? 'life-row life-row-reverse' : 'life-row';

			const lifeVisual = document.createElement('div');
			lifeVisual.className = 'life-visual';

			const imageBox = document.createElement('div');
			imageBox.className = 'life-image-box';

			const img = document.createElement('img');
			img.src = item.lifeImage?.url || '';
			img.alt = item.lifeImage?.alternativeText || item.lifeTitle || '';
			img.loading = 'lazy';

			const overlay = document.createElement('div');
			overlay.className = 'life-overlay';

			imageBox.appendChild(img);
			imageBox.appendChild(overlay);
			lifeVisual.appendChild(imageBox);

			const lifeText = document.createElement('div');
			lifeText.className = 'life-text';

			const title = document.createElement('h3');
			title.textContent = item.lifeTitle || '';

			const description = document.createElement('p');
			description.textContent = item.lifeDescription || '';

			lifeText.appendChild(title);
			lifeText.appendChild(description);

			lifeRow.appendChild(lifeVisual);
			lifeRow.appendChild(lifeText);

			lifeContainer.appendChild(lifeRow);
		});
	}
}

/**
 * @param {boolean} on
 */
const setLoading = (on) => {
	const mainContent = document.querySelector(".career-main");
	if (mainContent) {
		mainContent.classList.toggle("is-loading", !!on);
	}
};

async function initCareerPage() {
	setLoading(true);
	try {
		const storedLang = localStorage.getItem("selectedLanguage") || "en";
		const data = await fetchCareerPageData(storedLang);

		if (data) {
			await renderCareerHeroSection(data.heroSection);
			renderBenefitsSection(data.benefitsSection);
			renderValuesSection(data.valuesSection);
			renderTestimonialsSection(data.testimonialsSection);
			renderApplicationProcessSection(data.applicationProcessSection);
			renderLifeSection(data.lifeSection);
			renderServiceOptions(data.serviceOptions);
		} else {
		}
	} catch (error) {
	} finally {
		setLoading(false);
	}
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initCareerPage);
} else {
	initCareerPage();
}

document.addEventListener("DOMContentLoaded", function () {
	const langButtons = document.querySelectorAll('input[name="lang"]');
	langButtons.forEach((button) => {
		button.addEventListener("change", function () {
			if (this.checked) {
				const locale = this.value;
				localStorage.setItem("selectedLanguage", locale);
				initCareerPage();
			}
		});
	});
});

function updateHeroBackgroundForTheme() {
	const heroSectionEl = document.querySelector(".hero-section");
	if (heroSectionEl && heroSectionEl.dataset.bgImage) {
		const imageUrl = heroSectionEl.dataset.bgImage;
		const isDarkMode = document.body.classList.contains('dark-mode');
		const gradient = isDarkMode
			? 'linear-gradient(135deg, rgba(10, 10, 10, 0.9) 0%, rgba(197, 31, 93, 0.8) 100%)'
			: 'linear-gradient(135deg, rgba(45, 55, 72, 0.95) 0%, rgba(197, 31, 93, 0.85) 100%)';

		heroSectionEl.style.backgroundImage = `${gradient}, url('${imageUrl}')`;
	}
}

const observer = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
			updateHeroBackgroundForTheme();
		}
	});
});

if (document.body) {
	observer.observe(document.body, { attributes: true });
} else {
	document.addEventListener("DOMContentLoaded", () => {
		observer.observe(document.body, { attributes: true });
	});
}

export {
	fetchCareerPageData,
	renderCareerHeroSection,
	renderBenefitsSection,
	renderValuesSection,
	renderTestimonialsSection,
	renderApplicationProcessSection,
	renderLifeSection,
	renderServiceOptions,
	initCareerPage
};
