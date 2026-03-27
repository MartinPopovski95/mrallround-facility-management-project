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

export function renderMaintenanceServiceData(data) {
	const setContent = (id, value, parseMarkdown = false) => {
		const el = document.getElementById(id);
		if (!el || !value) {
			return;
		}
		el.innerHTML = parseMarkdown ? marked.parse(value) : value;
	};

	setContent("serviceTitle", data.title);
	setContent("serviceSubtitle", data.subtitle);
	setContent("introText", data.introText, true);
	setContent("offerSectionTitle", data.offerSectionTitle);
	setContent("offerSectionDescription", data.offerSectionDescription, true);

	if (data.offerings && data.offerings.length > 0) {
		renderOfferings(data.offerings);
	} else {
	}
}

function renderOfferings(offerings) {
	const container = document.getElementById("offeringsContainer");
	if (!container || !offerings || offerings.length === 0) return;

	const offeringCards = offerings.map((offer) => {
		const card = document.createElement('div');
		card.className = 'offering-card';
		card.innerHTML = `
			<div class="offering-icon">${offer.icon || '🔧'}</div>
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
	let autoplayInterval = null;
	let progressInterval = null;
	const autoplayDelay = 4000;
	const progressUpdateInterval = 50;

	function getCardsPerView() {
		const width = window.innerWidth;
		if (width <= 768) return 1;
		if (width <= 992) return 2;
		return 3;
	}

	function getTransformValue() {
		const cardsPerView = getCardsPerView();
		const cardWidth = 100 / cardsPerView;
		return -(currentSlide * cardWidth);
	}

	function updatePosition(animate = true) {
		carousel.style.transition = animate ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
		carousel.style.transform = `translateX(${getTransformValue()}%)`;
	}

	function updateIndicators() {
		indicators.forEach((indicator, index) => {
			indicator.classList.toggle('active', index === currentIndex);
		});
	}

	function handleInfiniteLoop() {
		if (currentSlide >= totalSlides * 2) {
			currentSlide = totalSlides;
			updatePosition(false);
		} else if (currentSlide < totalSlides) {
			currentSlide = totalSlides * 2 - 1;
			updatePosition(false);
		}
	}

	function nextSlide() {
		if (isTransitioning) return;
		isTransitioning = true;

		currentSlide++;
		currentIndex = (currentIndex + 1) % totalSlides;

		updatePosition(true);
		updateIndicators();

		startTime = Date.now();
		remainingTime = autoplayDelay;
		progressBar.style.width = '0%';

		setTimeout(() => {
			handleInfiniteLoop();
			isTransitioning = false;
		}, 800);
	}

	function prevSlide() {
		if (isTransitioning) return;
		isTransitioning = true;

		currentSlide--;
		currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;

		updatePosition(true);
		updateIndicators();

		startTime = Date.now();
		remainingTime = autoplayDelay;
		progressBar.style.width = '0%';

		setTimeout(() => {
			handleInfiniteLoop();
			isTransitioning = false;
		}, 800);
	}

	function goToSlide(index) {
		if (isTransitioning || index === currentIndex) return;
		isTransitioning = true;

		const diff = index - currentIndex;
		currentSlide += diff;
		currentIndex = index;

		updatePosition(true);
		updateIndicators();

		startTime = Date.now();
		remainingTime = autoplayDelay;
		progressBar.style.width = '0%';

		setTimeout(() => {
			handleInfiniteLoop();
			isTransitioning = false;
		}, 800);
	}

	let startTime = Date.now();
	let remainingTime = autoplayDelay;
	let isPaused = false;

	function updateProgress() {
		if (isPaused) return;

		const elapsed = Date.now() - startTime;
		const progress = Math.min((elapsed / autoplayDelay) * 100, 100);
		progressBar.style.width = progress + '%';

		if (elapsed >= autoplayDelay) {
			nextSlide();
		}
	}

	function startAutoplay() {
		if (!isPaused) {
			startTime = Date.now();
			remainingTime = autoplayDelay;
		}

		if (autoplayInterval) clearInterval(autoplayInterval);
		if (progressInterval) clearInterval(progressInterval);

		autoplayInterval = setInterval(() => {
			if (!isPaused) {
				const elapsed = Date.now() - startTime;
				if (elapsed >= remainingTime) {
					nextSlide();
				}
			}
		}, progressUpdateInterval);

		progressInterval = setInterval(updateProgress, progressUpdateInterval);
		isPaused = false;
	}

	function pauseAutoplay() {
		isPaused = true;
		const elapsed = Date.now() - startTime;
		remainingTime = autoplayDelay - elapsed;
		if (remainingTime < 0) remainingTime = autoplayDelay;
	}

	function resumeAutoplay() {
		isPaused = false;
		startTime = Date.now() - (autoplayDelay - remainingTime);
	}

	prevBtn.addEventListener('click', () => {
		prevSlide();
	});

	nextBtn.addEventListener('click', () => {
		nextSlide();
	});

	indicators.forEach((indicator, index) => {
		indicator.addEventListener('click', () => {
			goToSlide(index);
		});
	});

	container.addEventListener('mouseenter', pauseAutoplay);
	container.addEventListener('mouseleave', resumeAutoplay);

	document.addEventListener('keydown', (e) => {
		const wrapper = container.querySelector('.offerings-carousel-wrapper');
		if (!wrapper) return;

		const rect = wrapper.getBoundingClientRect();
		const isInViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;

		if (isInViewport) {
			if (e.key === 'ArrowLeft') {
				e.preventDefault();
				prevSlide();
			} else if (e.key === 'ArrowRight') {
				e.preventDefault();
				nextSlide();
			}
		}
	});

	let touchStartX = 0;
	let touchEndX = 0;

	container.addEventListener('touchstart', (e) => {
		touchStartX = e.changedTouches[0].screenX;
		pauseAutoplay();
	}, { passive: true });

	container.addEventListener('touchend', (e) => {
		touchEndX = e.changedTouches[0].screenX;
		const diff = touchStartX - touchEndX;
		const swipeThreshold = 50;

		if (Math.abs(diff) > swipeThreshold) {
			if (diff > 0) {
				nextSlide();
			} else {
				prevSlide();
			}
		} else {
			resumeAutoplay();
		}
	}, { passive: true });

	let resizeTimeout;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			updatePosition(false);
		}, 250);
	});

	updatePosition(false);
	updateIndicators();
	startAutoplay();
}

