import { API_CONFIG } from '../../config.js';

const API_BASE_URL = API_CONFIG.BASE_URL;

function toNum(v, fallback = 0) {
	const n = Number(v);
	return Number.isFinite(n) ? n : fallback;
}

function animateCounter(el, target, { duration = 1200 } = {}) {
	const suffix = el.dataset.suffix || "";
	const start = 0;
	const startTime = performance.now();
	const formatter = new Intl.NumberFormat();

	function frame(now) {
		const elapsed = now - startTime;
		const t = Math.min(1, elapsed / duration);
		const eased = 1 - Math.pow(1 - t, 3);
		const value = Math.round(start + (target - start) * eased);

		el.textContent = formatter.format(value) + suffix;
		if (t < 1) requestAnimationFrame(frame);
	}
	requestAnimationFrame(frame);
}

function startCountersWhenVisible() {
	const counters = document.querySelectorAll(".stat-number");

	if (!("IntersectionObserver" in window)) {
		counters.forEach((c) => animateCounter(c, toNum(c.dataset.count || 0)));
		return;
	}

	const seen = new WeakSet();
	const io = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting && !seen.has(entry.target)) {
					seen.add(entry.target);
					const el = entry.target;
					animateCounter(el, toNum(el.dataset.count || 0));
					io.unobserve(el);
				}
			});
		},
		{ threshold: 0.3 }
	);

	counters.forEach((c) => io.observe(c));
}

async function fetchHomePageData(locale = "en") {
	try {
		const url = `${API_BASE_URL}/api/home-page?locale=${locale}&populate=deep`;
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

async function renderHeroSection(heroSection) {
	if (!heroSection) return;

	const heroTitle = document.querySelector(".hero-title");
	const heroSubtitle = document.querySelector(".hero-subtitle");
	const heroDescription = document.querySelector(".hero-description");

	if (heroTitle && heroSection.heroTitle) {
		heroTitle.textContent = heroSection.heroTitle;
	}
	if (heroSubtitle && heroSection.heroSubtitle) {
		heroSubtitle.textContent = heroSection.heroSubtitle;
	}
	if (heroDescription && heroSection.heroDescription) {
		heroDescription.textContent = heroSection.heroDescription;
	}

	if (heroSection.heroBackgroundImage?.url) {
		const heroSectionEl = document.querySelector(".hero-section");
		if (heroSectionEl) {
			heroSectionEl.style.backgroundImage = `linear-gradient(135deg, rgba(197, 31, 93, 0.6) 0%, rgba(138, 43, 226, 0.6) 100%), url('${heroSection.heroBackgroundImage.url}')`;
			heroSectionEl.style.backgroundSize = "cover";
			heroSectionEl.style.backgroundPosition = "center";
			heroSectionEl.style.backgroundAttachment = "fixed";
		}
	}

	await updateStatsAsync({
		experience: heroSection.yearsOfExperience,
		clients:
			heroSection.satisfiedCostumers ?? heroSection.satisfiedCustomers,
		projects: heroSection.projectsCompleted,
		team: heroSection.teamMembers,
	});
}

async function updateStatsAsync(statsInput) {
	const resolved =
		typeof statsInput === "function"
			? await statsInput()
			: await Promise.resolve(statsInput);

	const mapped = {
		experience: toNum(
			resolved.experience ?? resolved.yearsOfExperience ?? 0
		),
		clients: toNum(
			resolved.clients ??
				resolved.satisfiedCostumers ??
				resolved.satisfiedCustomers ??
				0
		),
		projects: toNum(resolved.projects ?? resolved.projectsCompleted ?? 0),
		team: toNum(resolved.team ?? resolved.teamMembers ?? 0),
	};

	const counters = document.querySelectorAll(".stat-number");
	if (!counters.length) return;

	const order = ["experience", "clients", "projects", "team"];

	counters.forEach((counter, idx) => {
		const key = counter.dataset.stat || order[idx] || "experience";
		const target = toNum(mapped[key], 0);

		counter.dataset.count = String(target);
		const suffix = counter.dataset.suffix || "";
		counter.textContent = "0" + suffix;
	});

	await new Promise((r) => requestAnimationFrame(() => r()));
	startCountersWhenVisible();
}

function renderAboutSection(aboutSection) {
	if (!aboutSection) return;

	const aboutTitle = document.querySelector(".about-text .section-title");
	const aboutSubtitle = document.querySelector(".about-text h3");
	const aboutImage = document.querySelector(".about-image-wrapper img");

	if (aboutTitle && aboutSection.aboutTitle) {
		aboutTitle.textContent = aboutSection.aboutTitle;
	}
	if (aboutSubtitle && aboutSection.aboutSubtitle) {
		aboutSubtitle.textContent = aboutSection.aboutSubtitle;
	}

	if (aboutSection.aboutText) {
		const aboutTextContainer = document.querySelector(".about-text");
		if (aboutTextContainer) {
			const existingParagraphs = aboutTextContainer.querySelectorAll("p");

			if (Array.isArray(aboutSection.aboutText)) {
				aboutSection.aboutText.forEach((textItem, index) => {
					if (textItem.aboutText) {
						if (existingParagraphs[index]) {
							existingParagraphs[index].textContent =
								textItem.aboutText;
							existingParagraphs[index].style.display = "";
						} else {
							const newParagraph = document.createElement("p");
							newParagraph.textContent = textItem.aboutText;

							const learnMoreBtn =
								aboutTextContainer.querySelector(".btn");
							if (learnMoreBtn) {
								aboutTextContainer.insertBefore(
									newParagraph,
									learnMoreBtn
								);
							} else {
								aboutTextContainer.appendChild(newParagraph);
							}
						}
					}
				});

				for (
					let i = aboutSection.aboutText.length;
					i < existingParagraphs.length;
					i++
				) {
					existingParagraphs[i].style.display = "none";
				}
			} else if (typeof aboutSection.aboutText === "string") {
				if (existingParagraphs.length > 0) {
					existingParagraphs[0].textContent = aboutSection.aboutText;
					existingParagraphs[0].style.display = "";

					for (let i = 1; i < existingParagraphs.length; i++) {
						existingParagraphs[i].style.display = "none";
					}
				}
			}
		}
	}

	if (aboutImage && aboutSection.aboutImage?.url) {
		aboutImage.src = aboutSection.aboutImage.url;
		aboutImage.alt = aboutSection.aboutImage.alternativeText || "About Us";
	}
}

function updateServiceCard(card, service) {
	const img = card.querySelector(".service-image");
	const title = card.querySelector(".service-title");
	const description = card.querySelector(".service-description");

	if (img && service.serviceCardImage?.url) {
		img.src = service.serviceCardImage.url;
		img.alt = service.serviceCardTitle || "Service Image";
	}

	if (title && service.serviceCardTitle) {
		title.textContent = service.serviceCardTitle;
	}

	if (description && service.serviceCardDescription) {
		description.textContent = service.serviceCardDescription;
	}
}

function renderServicesSection(serviceSection) {
	if (!serviceSection) return;

	const sectionTitle = document.querySelector("#services .section-title");
	const sectionSubtitle = document.querySelector(
		"#services .section-subtitle"
	);

	if (sectionTitle && serviceSection.serviceTitle) {
		sectionTitle.textContent = serviceSection.serviceTitle;
	}
	if (sectionSubtitle && serviceSection.serviceSubtitle) {
		sectionSubtitle.textContent = serviceSection.serviceSubtitle;
	}

	if (
		serviceSection.serviceTemplate &&
		serviceSection.serviceTemplate.length > 0
	) {
		const servicesGrid = document.querySelector("#services .grid-auto-fit");
		if (!servicesGrid) return;

		servicesGrid.innerHTML = "";

		
		serviceSection.serviceTemplate.forEach((service, index) => {
			const serviceLink = createServiceCard(service, index);
			servicesGrid.appendChild(serviceLink);
		});

		
		initServicesCarousel(serviceSection.serviceTemplate);
	}
}

function createServiceCard(service, index) {
	
	const serviceUrls = [
		"services/CleaningService/Cleaning.html",
		"services/Property Maintenance/PropertyMaintenance.html",
		"services/Renovation Service/Renovation.html",
		"services/Disposal Service/Disposal.html",
		"services/Relocation Service/Relocation.html"
	];

	const fallbackServiceIcons = [
		`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M4 12h16M4 18h16M4 6h16" />
			<path d="M8 2v4M16 2v4" />
			<circle cx="12" cy="12" r="1" />
		</svg>`,
		`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
		</svg>`,
		`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<rect x="4" y="3" width="16" height="6" rx="2" />
			<path d="M12 9v3" />
			<rect x="10" y="12" width="4" height="9" rx="1" />
		</svg>`,
		`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
			<line x1="10" y1="11" x2="10" y2="17" />
			<line x1="14" y1="11" x2="14" y2="17" />
		</svg>`,
		`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
			<polyline points="9 22 9 12 15 12 15 22" />
		</svg>`
	];

	const serviceUrl = serviceUrls[index] || "#";

	const serviceIcon = service.serviceCardIcon || fallbackServiceIcons[index] || fallbackServiceIcons[0];

	const link = document.createElement("a");
	link.href = serviceUrl;
	link.className = "service-card-link";

	const card = document.createElement("div");
	card.className = "service-card";

	const imageContainer = document.createElement("div");
	imageContainer.className = "service-image-container";

	const img = document.createElement("img");
	img.className = "service-image";
	if (service.serviceCardImage?.url) {
		img.src = service.serviceCardImage.url;
		img.alt = service.serviceCardTitle || "Service Image";
	}
	imageContainer.appendChild(img);

	const content = document.createElement("div");
	content.className = "service-card-content";

	const iconDiv = document.createElement("div");
	iconDiv.className = "service-icon";
	iconDiv.innerHTML = serviceIcon;

	const title = document.createElement("h3");
	title.className = "service-title";
	title.textContent = service.serviceCardTitle || "";

	const description = document.createElement("p");
	description.className = "service-description";
	description.textContent = service.serviceCardDescription || "";

	const linkText = document.createElement("span");
	linkText.className = "service-link-text";
	linkText.innerHTML = `
		Learn More
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;">
			<line x1="5" y1="12" x2="19" y2="12"></line>
			<polyline points="12 5 19 12 12 19"></polyline>
		</svg>
	`;

	content.appendChild(iconDiv);
	content.appendChild(title);
	content.appendChild(description);
	content.appendChild(linkText);

	card.appendChild(imageContainer);
	card.appendChild(content);
	link.appendChild(card);

	return link;
}

function initServicesCarousel(services) {
	
	if (!services || services.length === 0) return;

	const servicesSection = document.querySelector("#services .grid-auto-fit");
	if (!servicesSection) return;

	
	const serviceLinks = Array.from(servicesSection.querySelectorAll(".service-card-link"));
	const totalServices = serviceLinks.length;

	
	const carouselContainer = document.createElement("div");
	carouselContainer.className = "services-carousel-container";

	
	const carouselWrapper = document.createElement("div");
	carouselWrapper.className = "services-carousel-wrapper";

	const carousel = document.createElement("div");
	carousel.className = "services-carousel";

	
	
	const clonedServices = [];

	
	for (let i = 0; i < totalServices; i++) {
		clonedServices.push(serviceLinks[i].cloneNode(true));
	}

	
	for (let i = 0; i < totalServices; i++) {
		clonedServices.push(serviceLinks[i]);
	}

	
	for (let i = 0; i < totalServices; i++) {
		clonedServices.push(serviceLinks[i].cloneNode(true));
	}

	
	clonedServices.forEach((link, index) => {
		const carouselItem = document.createElement("div");
		carouselItem.className = "service-carousel-item";
		carouselItem.appendChild(link);
		carousel.appendChild(carouselItem);
	});

	carouselWrapper.appendChild(carousel);
	carouselContainer.appendChild(carouselWrapper);

	
	const controls = document.createElement("div");
	controls.className = "carousel-controls";
	controls.innerHTML = `
		<button class="carousel-btn carousel-prev" aria-label="Previous service">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<polyline points="15 18 9 12 15 6"></polyline>
			</svg>
		</button>
		<button class="carousel-btn carousel-next" aria-label="Next service">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<polyline points="9 18 15 12 9 6"></polyline>
			</svg>
		</button>
	`;
	carouselContainer.appendChild(controls);

	
	const indicators = document.createElement("div");
	indicators.className = "carousel-indicators";
	for (let i = 0; i < totalServices; i++) {
		const indicator = document.createElement("div");
		indicator.className = "carousel-indicator";
		if (i === 0) indicator.classList.add("active");
		indicator.setAttribute("data-index", i);
		indicators.appendChild(indicator);
	}
	carouselContainer.appendChild(indicators);

	
	const progress = document.createElement("div");
	progress.className = "carousel-progress";
	progress.innerHTML = '<div class="carousel-progress-bar"></div>';
	carouselContainer.appendChild(progress);

	
	servicesSection.innerHTML = "";
	servicesSection.appendChild(carouselContainer);

	
	startCarousel(carouselContainer, totalServices);
}

function startCarousel(container, totalSlides) {
	const carousel = container.querySelector(".services-carousel");
	const indicators = container.querySelectorAll(".carousel-indicator");
	const prevBtn = container.querySelector(".carousel-prev");
	const nextBtn = container.querySelector(".carousel-next");
	const progressBar = container.querySelector(".carousel-progress-bar");

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
		if (animate) {
			carousel.style.transition = "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
		} else {
			carousel.style.transition = "none";
		}
		carousel.style.transform = `translateX(${getTransformValue()}%)`;
	}

	
	function updateIndicators() {
		indicators.forEach((indicator, index) => {
			indicator.classList.toggle("active", index === currentIndex);
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
		progressBar.style.width = "0%";

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
		progressBar.style.width = "0%";

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
		progressBar.style.width = "0%";

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
		progressBar.style.width = progress + "%";

		if (elapsed >= autoplayDelay) {
			nextSlide();
		}
	}

	function startAutoplay() {
		if (!isPaused) {
			startTime = Date.now();
			remainingTime = autoplayDelay;
		}

		if (autoplayInterval) {
			clearInterval(autoplayInterval);
		}
		if (progressInterval) {
			clearInterval(progressInterval);
		}

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

		if (remainingTime < 0) {
			remainingTime = autoplayDelay;
		}
	}

	function resumeAutoplay() {
		isPaused = false;
		startTime = Date.now() - (autoplayDelay - remainingTime);
	}

	function resetAndStartAutoplay() {
		startTime = Date.now();
		remainingTime = autoplayDelay;
		isPaused = false;
		progressBar.style.width = "0%";

		if (autoplayInterval) {
			clearInterval(autoplayInterval);
		}
		if (progressInterval) {
			clearInterval(progressInterval);
		}

		autoplayInterval = setInterval(() => {
			if (!isPaused) {
				const elapsed = Date.now() - startTime;
				if (elapsed >= remainingTime) {
					nextSlide();
				}
			}
		}, progressUpdateInterval);

		progressInterval = setInterval(updateProgress, progressUpdateInterval);
	}

	
	prevBtn.addEventListener("click", () => {
		prevSlide();
		
	});

	nextBtn.addEventListener("click", () => {
		nextSlide();
		
	});

	indicators.forEach((indicator, index) => {
		indicator.addEventListener("click", () => {
			goToSlide(index);
			
		});
	});

	
	container.addEventListener("mouseenter", pauseAutoplay);
	container.addEventListener("mouseleave", resumeAutoplay);

	
	document.addEventListener("keydown", (e) => {
		const wrapper = container.querySelector(".services-carousel-wrapper");
		if (!wrapper) return;

		const rect = wrapper.getBoundingClientRect();
		const isInViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;

		if (isInViewport) {
			if (e.key === "ArrowLeft") {
				e.preventDefault();
				prevSlide();
				
			} else if (e.key === "ArrowRight") {
				e.preventDefault();
				nextSlide();
				
			}
		}
	});

	
	let touchStartX = 0;
	let touchEndX = 0;

	container.addEventListener("touchstart", (e) => {
		touchStartX = e.changedTouches[0].screenX;
		pauseAutoplay();
	}, { passive: true });

	container.addEventListener("touchend", (e) => {
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
	window.addEventListener("resize", () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			updatePosition(false);
		}, 250);
	});

	
	updatePosition(false);
	updateIndicators();
	startAutoplay();
}

function renderWhyChooseUsSection(whyChooseSection) {
	if (!whyChooseSection) return;


	const sectionTitle = document.querySelector(
		".section-gradient-light .section-title"
	);
	const sectionSubtitle = document.querySelector(
		".section-gradient-light .section-subtitle"
	);

	if (sectionTitle && whyChooseSection.whyChooseUsTitle) {
		sectionTitle.textContent = whyChooseSection.whyChooseUsTitle;
	}
	if (sectionSubtitle && whyChooseSection.whyChooseUsSubtitler) {
		sectionSubtitle.textContent = whyChooseSection.whyChooseUsSubtitler;
	}

	const featureCards = document.querySelectorAll(".feature-card");

	const fallbackIcons = [
		`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="12" cy="8" r="7" />
			<path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" />
			<path d="M12 15l-2-2m4 0l-2 2" />
		</svg>`,
		`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="12" cy="12" r="10" />
			<polyline points="12 6 12 12 16 14" />
		</svg>`,
		`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
			<path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
		</svg>`,
		`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
		</svg>`,
		`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
		</svg>`,
		`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
		</svg>`
	];

	
	if (
		whyChooseSection.whyChooseUs &&
		whyChooseSection.whyChooseUs.length > 0
	) {
		
		whyChooseSection.whyChooseUs.forEach((feature, index) => {
			if (featureCards[index]) {
				
				const title =
					featureCards[index].querySelector(".feature-title");
				const description = featureCards[index].querySelector(
					".feature-description"
				);
				const iconDiv = featureCards[index].querySelector(".feature-icon");

				if (title && feature.whyChooseUsTitle) {
					title.textContent = feature.whyChooseUsTitle;
				}
				if (description && feature.whyChooseUsDescription) {
					description.textContent = feature.whyChooseUsDescription;
				}

				if (iconDiv) {
					const icon = feature.whyChooseUsIcon || fallbackIcons[index] || fallbackIcons[0];
					iconDiv.innerHTML = icon;
				}
			}
		});
	} else {
		
	}

	
	if (
		whyChooseSection.whyChooseUs2 &&
		whyChooseSection.whyChooseUs2.length > 0
	) {
		
		whyChooseSection.whyChooseUs2.forEach((feature, index) => {
			const cardIndex = index + 3; 
			if (featureCards[cardIndex]) {
				
				const title =
					featureCards[cardIndex].querySelector(".feature-title");
				const description = featureCards[cardIndex].querySelector(
					".feature-description"
				);
				const iconDiv = featureCards[cardIndex].querySelector(".feature-icon");

				if (title && feature.whyChooseUsTitle) {
					title.textContent = feature.whyChooseUsTitle;
				}
				if (description && feature.whyChooseUsDescription) {
					description.textContent = feature.whyChooseUsDescription;
				}

				if (iconDiv) {
					const icon = feature.whyChooseUsIcon || fallbackIcons[cardIndex] || fallbackIcons[0];
					iconDiv.innerHTML = icon;
				}
			}
		});
	} else {
		
	}
}

function renderGallerySection(gallerySection) {
	if (!gallerySection) return;

	const sectionTitle = document.querySelector(".section-gray .section-title");
	const sectionSubtitle = document.querySelector(
		".section-gray .section-subtitle"
	);

	const gallerySectionEl = document
		.querySelector(".gallery-grid")
		?.closest(".section");
	if (gallerySectionEl) {
		const galleryTitle = gallerySectionEl.querySelector(".section-title");
		const gallerySubtitle =
			gallerySectionEl.querySelector(".section-subtitle");

		if (galleryTitle && gallerySection.galleryTitle) {
			galleryTitle.textContent = gallerySection.galleryTitle;
		}
		if (gallerySubtitle && gallerySection.gallerySubtitle) {
			gallerySubtitle.textContent = gallerySection.gallerySubtitle;
		}
	}

	if (gallerySection.galleryImage && gallerySection.galleryImage.length > 0) {
		const galleryGrid = document.querySelector(".gallery-grid");
		if (galleryGrid) {
			galleryGrid.innerHTML = "";

			const galleryTrack = document.createElement("div");
			galleryTrack.className = "gallery-track";

			const galleryItems = [];
			gallerySection.galleryImage.forEach((item, index) => {
				if (item.galleryImage?.url) {
					const galleryItem = document.createElement("div");
					galleryItem.className = "gallery-item";
					galleryItem.innerHTML = `
                        <img src="${item.galleryImage.url}"
                             alt="${
									item.galleryImage.alternativeText ||
									"Gallery Image " + (index + 1)
								}"
                             loading="lazy">
                        <div class="gallery-overlay">
                            <i class="fas fa-search-plus"></i>
                        </div>
                    `;
					galleryItems.push(galleryItem);
					galleryTrack.appendChild(galleryItem);
				}
			});

			const itemsToClone = Math.min(4, galleryItems.length);
			for (let i = 0; i < itemsToClone; i++) {
				const clone = galleryItems[i].cloneNode(true);
				galleryTrack.appendChild(clone);
			}

			galleryGrid.appendChild(galleryTrack);

			if (galleryItems.length > 4) {
				initGalleryCarousel(galleryTrack, galleryItems.length);
			}
		}
	}
}

function initGalleryCarousel(track, totalItems) {
	let currentIndex = 0;
	let isTransitioning = false;
	const scrollInterval = 3000;
	const itemWidth = track.firstElementChild?.offsetWidth || 0;
	const gap = parseFloat(getComputedStyle(track).gap) || 0;
	const scrollDistance = itemWidth + gap;

	function scrollToIndex(index, smooth = true) {
		if (isTransitioning) return;

		const offset = index * scrollDistance;
		track.style.transition = smooth ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
		track.style.transform = `translateX(-${offset}px)`;

		if (smooth) {
			isTransitioning = true;
			setTimeout(() => {
				isTransitioning = false;
			}, 800);
		}
	}

	function nextSlide() {
		currentIndex++;
		scrollToIndex(currentIndex);

		if (currentIndex >= totalItems) {
			setTimeout(() => {
				currentIndex = 0;
				scrollToIndex(0, false);
			}, 800);
		}
	}

	let autoScroll = setInterval(nextSlide, scrollInterval);

	track.addEventListener('mouseenter', () => {
		clearInterval(autoScroll);
	});

	track.addEventListener('mouseleave', () => {
		autoScroll = setInterval(nextSlide, scrollInterval);
	});

	let resizeTimeout;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			const newItemWidth = track.firstElementChild?.offsetWidth || 0;
			const newGap = parseFloat(getComputedStyle(track).gap) || 0;
			const newScrollDistance = newItemWidth + newGap;
			scrollToIndex(currentIndex, false);
		}, 250);
	});
}

function renderJoinTeamSection(joinTeamSection) {
	if (!joinTeamSection) return;

	const careerTitle = document.querySelector(".career-cta-title");
	const careerDescription = document.querySelector(".career-cta-description");

	if (careerTitle && joinTeamSection.joinOurTeamTitle) {
		careerTitle.textContent = joinTeamSection.joinOurTeamTitle;
	}
	if (careerDescription && joinTeamSection.joinOurTeamSubtitle) {
		careerDescription.textContent = joinTeamSection.joinOurTeamSubtitle;
	}
}

function renderGetInTouchSection(contactSection) {
	if (!contactSection) return;

	const contactSectionEl = document.querySelector("#contact");
	if (!contactSectionEl) return;

	const sectionTitle = contactSectionEl.querySelector(".section-title");
	const sectionSubtitle = contactSectionEl.querySelector(".section-subtitle");

	if (sectionTitle && contactSection.getInTouchTitle) {
		sectionTitle.textContent = contactSection.getInTouchTitle;
	}
	if (sectionSubtitle && contactSection.getInTouchSubtitle) {
		sectionSubtitle.textContent = contactSection.getInTouchSubtitle;
	}

	if (
		contactSection.getInTouchTemplate &&
		contactSection.getInTouchTemplate.length > 0
	) {
		const contactItems = contactSectionEl.querySelectorAll(".contact-item");

		contactSection.getInTouchTemplate.forEach((contact, index) => {
			if (contactItems[index]) {
				const title = contactItems[index].querySelector("h4");
				const details = contactItems[index].querySelector("p");

				if (title && contact.title) {
					title.textContent = contact.title;
				}
				if (details) {
					if (contact.email) {
						details.innerHTML = `<a href="mailto:${contact.email}">${contact.email}</a>`;
					} else if (contact.phone) {
						details.innerHTML = `<a href="tel:+${contact.phone}">+${contact.phone}</a>`;
					} else if (contact.subtitle) {
						details.textContent = contact.subtitle;
					}
				}
			}
		});
	}
}

const setLoading = (on) => {
	const mainContent = document.querySelector("#main-content");
	if (mainContent) {
		mainContent.classList.toggle("is-loading", !!on);
	}
};

async function initHomePage() {
	setLoading(true);
	try {
		const storedLang = localStorage.getItem("selectedLanguage") || "en";
		const data = await fetchHomePageData(storedLang);

		if (data) {
			await renderHeroSection(data.heroSection);
			renderAboutSection(data.aboutUsSection);
			renderServicesSection(data.serviceSection);
			renderWhyChooseUsSection(data.whyChooseUsSection);
			renderGallerySection(data.gallerySection);
			renderJoinTeamSection(data.joinOurTeamSection);
			renderGetInTouchSection(data.getInTouchSection);
			renderGetInTouchSection(data.getInTouchSection);
renderGoogleMap(data.getInTouchSection);
		} else {
		}
	} catch (error) {
		// Error logged server-side
	} finally {
		setLoading(false);
	}
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initHomePage);
} else {
	initHomePage();
}

document.addEventListener("DOMContentLoaded", function () {
	const langButtons = document.querySelectorAll('input[name="lang"]');
	langButtons.forEach((button) => {
		button.addEventListener("change", function () {
			if (this.checked) {
				const locale = this.value;
				localStorage.setItem("selectedLanguage", locale);
				initHomePage();
			}
		});
	});
});


function extractSrcFromIframe(input) {
	if (!input) return "";
	const trimmed = input.trim();

	
	if (trimmed.toLowerCase().includes("<iframe")) {
		
		const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
		return srcMatch ? srcMatch[1] : "";
	}

	
	return trimmed;
}

function renderGoogleMap(contactSection) {
	const mapIframe = document.querySelector(".contact-map iframe");
	if (!mapIframe) return;

	const mapInput = contactSection?.mapEmbedUrl?.trim();

	if (mapInput) {
		const extractedSrc = extractSrcFromIframe(mapInput);
		if (extractedSrc) {
			mapIframe.src = extractedSrc;
			mapIframe.style.display = "";
		}
	}
	else {
	}
}
