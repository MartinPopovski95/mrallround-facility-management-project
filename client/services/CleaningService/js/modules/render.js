import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import { API_CONFIG } from '../../../../config.js';

const STRAPI_ORIGIN = API_CONFIG.STRAPI_URL;

export const setLoading = (on) => {
	const hero = document.querySelector(".hero-section");
	if (hero) {
		hero.classList.toggle("is-loading", !!on);
	}
};

const proxify = (url) => {
	if (!url) return "";
	if (location.protocol === "https:" && /^http:\/\//.test(url)) {
		return `/api/media-proxy?url=${encodeURIComponent(url)}`;
	}
	return url;
};

const mdLite = (md) =>
	(md || "")
		.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
		.replace(/\*(.*?)\*/g, "<em>$1</em>")
		.replace(/\n{2,}/g, "</p><p>")
		.replace(/\n/g, "<br>");

export function renderCleaningServiceData(data) {
	const setContent = (id, value, parseMarkdown = false) => {
		const el = document.getElementById(id);
		if (!el || !value) return;
		el.innerHTML = parseMarkdown ? marked.parse(value) : value;
	};

	setContent("serviceTitle", data.title);
	setContent("serviceSubtitle", data.subtitle);
	setContent("introText", data.introText, true);
	setContent("offerSectionTitle", data.offerSectionTitle);
	setContent("offerSectionDescription", data.offerSectionDescription, true);

	if (data.offerings && data.offerings.length > 0) {
		renderOfferings(data.offerings);
	}
}

function renderOfferings(offerings) {
	const container = document.getElementById("offeringsContainer");
	if (!container || !offerings || offerings.length === 0) return;

	const offeringCards = offerings.map((offer) => {
		const card = document.createElement('div');
		card.className = 'offering-card';
		card.innerHTML = `
			<div class="offering-icon">${offer.icon || '🧹'}</div>
			<h3 class="offering-title">${offer.title || ''}</h3>
			<div class="offering-text">${mdLite(offer.text || '')}</div>
		`;
		return card;
	});

	initOfferingsCarousel(offeringCards);
}

function initOfferingsCarousel(offeringCards) {
	const container = document.getElementById("offeringsContainer");
	if (!container || !offeringCards || offeringCards.length === 0) return;

	const totalOfferings = offeringCards.length;
	const carouselContainer = document.createElement('div');
	carouselContainer.className = 'offerings-carousel-container';

	const carouselWrapper = document.createElement('div');
	carouselWrapper.className = 'offerings-carousel-wrapper';

	const carousel = document.createElement('div');
	carousel.className = 'offerings-carousel';

	const clonedOfferings = [];
	for (let i = 0; i < totalOfferings; i++) {
		clonedOfferings.push(offeringCards[i].cloneNode(true));
	}
	for (let i = 0; i < totalOfferings; i++) {
		clonedOfferings.push(offeringCards[i]);
	}
	for (let i = 0; i < totalOfferings; i++) {
		clonedOfferings.push(offeringCards[i].cloneNode(true));
	}

	clonedOfferings.forEach((card) => {
		const carouselItem = document.createElement('div');
		carouselItem.className = 'offering-carousel-item';
		carouselItem.appendChild(card);
		carousel.appendChild(carouselItem);
	});

	carouselWrapper.appendChild(carousel);
	carouselContainer.appendChild(carouselWrapper);

	const controls = document.createElement('div');
	controls.className = 'carousel-controls';
	controls.innerHTML = `
		<button class="carousel-btn carousel-prev" aria-label="Previous offering">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="15 18 9 12 15 6"></polyline>
			</svg>
		</button>
		<button class="carousel-btn carousel-next" aria-label="Next offering">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="9 18 15 12 9 6"></polyline>
			</svg>
		</button>
	`;
	carouselContainer.appendChild(controls);

	const indicators = document.createElement('div');
	indicators.className = 'carousel-indicators';
	for (let i = 0; i < totalOfferings; i++) {
		const indicator = document.createElement('div');
		indicator.className = 'carousel-indicator' + (i === 0 ? ' active' : '');
		indicator.setAttribute('data-index', i);
		indicators.appendChild(indicator);
	}
	carouselContainer.appendChild(indicators);

	const progress = document.createElement('div');
	progress.className = 'carousel-progress';
	progress.innerHTML = '<div class="carousel-progress-bar"></div>';
	carouselContainer.appendChild(progress);

	container.innerHTML = '';
	container.appendChild(carouselContainer);

	startOfferingsCarousel(carouselContainer, totalOfferings);
}

function startOfferingsCarousel(container, totalSlides) {
	const carousel = container.querySelector('.offerings-carousel');
	const indicators = container.querySelectorAll('.carousel-indicator');
	const prevBtn = container.querySelector('.carousel-prev');
	const nextBtn = container.querySelector('.carousel-next');
	const progressBar = container.querySelector('.carousel-progress-bar');

	let currentIndex = 0;
	let currentSlide = totalSlides;
	let isTransitioning = false;
	const autoplayDelay = 4000;

	function getCardsPerView() {
		const width = window.innerWidth;
		if (width <= 768) return 1;
		if (width <= 992) return 2;
		return 3;
	}

	function updatePosition(animate = true) {
		const cardsPerView = getCardsPerView();
		const cardWidth = 100 / cardsPerView;
		carousel.style.transition = animate ? 'transform 0.8s ease' : 'none';
		carousel.style.transform = `translateX(${-(currentSlide * cardWidth)}%)`;
	}

	function updateIndicators() {
		indicators.forEach((ind, i) => ind.classList.toggle('active', i === currentIndex));
	}

	function nextSlide() {
		if (isTransitioning) return;
		isTransitioning = true;
		currentSlide++;
		currentIndex = (currentIndex + 1) % totalSlides;
		updatePosition(true);
		updateIndicators();
		setTimeout(() => {
			if (currentSlide >= totalSlides * 2) {
				currentSlide = totalSlides;
				updatePosition(false);
			}
			isTransitioning = false;
		}, 800);
	}

	prevBtn.addEventListener('click', () => {
		if (isTransitioning) return;
		isTransitioning = true;
		currentSlide--;
		currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
		updatePosition(true);
		updateIndicators();
		setTimeout(() => {
			if (currentSlide < totalSlides) {
				currentSlide = totalSlides * 2 - 1;
				updatePosition(false);
			}
			isTransitioning = false;
		}, 800);
	});

	nextBtn.addEventListener('click', nextSlide);

	updatePosition(false);
	setInterval(nextSlide, autoplayDelay);
}
