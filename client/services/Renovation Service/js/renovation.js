import { API_CONFIG } from '../../../config.js';
import { initServiceForm } from '../../components/request-form/js/serviceForm.js';

(() => {
    const translations = {
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
            navigationTitle: "Navigation",
            contactFooter: "Contact",
            serviceListTitle: "Service list",
            contactUsTitle: "Contact Us",
            address: "Bannstrasse 5, 4600 Olten, Switzerland",
            copyright: "Copyright ©2025 Mr. Allround. All rights reserved",
            galleryTitle: "Our Work",
        },
        de: {
            home: "Heim",
            about: "Über Uns",
            career: "Karriere",
            services: "Dienstleistungen",
            cleaning: "Reinigungsdienste",
            maintenance: "Wartungsdienste",
            security: "Renovationen",
            disposal: "Entsorgungsdienste",
            relocation: "Umzugsdienste",
            navigationTitle: "Navigation",
            contactFooter: "Kontakt",
            serviceListTitle: "Dienstleistungsliste",
            contactUsTitle: "Kontaktiere uns",
            address: "Bannstrasse 5, 4600 Olten, Schweiz",
            copyright: "Urheberrecht ©2025 Mr. Allround. Alle Rechte vorbehalten",
            galleryTitle: "Unsere Arbeit",
        }
    };

    function applyTranslations(locale) {
        document.querySelectorAll("[data-i18n]").forEach((el) => {
            if (el.hasAttribute('data-cms-managed')) {
                return;
            }

            const key = el.getAttribute("data-i18n");
            if (translations[locale] && translations[locale][key]) {
                el.textContent = translations[locale][key];
            }
        });
    }

    const API_URL = API_CONFIG.getApiUrl('/api/renovation-service');
    const STRAPI_ORIGIN = API_CONFIG.STRAPI_URL;

    const $id = (id) => document.getElementById(id);
    const get = (o, p, d = "") =>
        p.split(".").reduce((a, k) => (a && a[k] != null ? a[k] : null), o) ?? d;

    const mediaUrl = (obj, base = STRAPI_ORIGIN) => {
        const candidate = get(obj, "url") || get(obj, "data.attributes.url") || "";
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

    const setTextOrHide = (el, v) => {
        if (!el) return;
        if (typeof v === "string" && v.trim().length > 0) {
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

    const mdLite = (md) =>
        (md || "")
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>")
            .replace(/\n{2,}/g, "</p><p>")
            .replace(/\n/g, "<br>");

    const setLoading = (on) => {
        const hero = document.querySelector(".hero-section");
        if (hero) {
            hero.classList.toggle("is-loading", !!on);
        }
    };

    const dom = {
        serviceTitle: $id("serviceTitle"),
        serviceSubtitle: $id("serviceSubtitle"),
        introText: $id("introText"),
        offerSectionTitle: $id("offerSectionTitle"),
        offerSectionDescription: $id("offerSectionDescription"),
        offeringsContainer: $id("offeringsContainer"),
        galleryContainer: $id("galleryContainer"),
    };

    function renderOfferings(offerings) {

        if (!dom.offeringsContainer) {
            return;
        }

        if (!offerings || offerings.length === 0) {
            return;
        }

        const offeringCards = offerings.map((offer) => {
            const card = document.createElement('div');
            card.className = 'offering-card';
            card.innerHTML = `
                <div class="offering-icon">${offer.icon || '🏗️'}</div>
                <h3 class="offering-title">${offer.title || ''}</h3>
                <div class="offering-text">${mdLite(offer.text || '')}</div>
            `;
            return card;
        });


        initOfferingsCarousel(offeringCards);
    }

    function initOfferingsCarousel(offeringCards) {

        if (!dom.offeringsContainer || !offeringCards || offeringCards.length === 0) {
            return;
        }

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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>
            <button class="carousel-btn carousel-next" aria-label="Next offering">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        `;
        carouselContainer.appendChild(controls);

        const indicators = document.createElement('div');
        indicators.className = 'carousel-indicators';
        for (let i = 0; i < totalOfferings; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'carousel-indicator';
            if (i === 0) indicator.classList.add('active');
            indicator.setAttribute('data-index', i);
            indicators.appendChild(indicator);
        }
        carouselContainer.appendChild(indicators);

        const progress = document.createElement('div');
        progress.className = 'carousel-progress';
        progress.innerHTML = '<div class="carousel-progress-bar"></div>';
        carouselContainer.appendChild(progress);

        dom.offeringsContainer.innerHTML = '';
        dom.offeringsContainer.appendChild(carouselContainer);


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

    async function loadComponent(componentPath, targetId) {
        try {
            const response = await fetch(componentPath);
            if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
            const html = await response.text();
            const target = document.getElementById(targetId);
            if (target) {
                target.innerHTML = html;
            }
        } catch (error) {
        }
    }

    async function loadRenovationService(locale = "en") {
        setLoading(true);
        applyTranslations(locale);
        localStorage.setItem("selectedLanguage", locale);
        document.documentElement.lang = locale;

        try {
            const data = await fetchJSON(
                `${API_URL}?locale=${encodeURIComponent(locale)}`
            );


            queueMicrotask(() => {
                setTextOrHide(dom.serviceTitle, data.title);
                setTextOrHide(dom.serviceSubtitle, data.subtitle);
                setHTML(dom.introText, mdLite(data.introText));
                setTextOrHide(dom.offerSectionTitle, data.offerSectionTitle);
                setHTML(dom.offerSectionDescription, mdLite(data.offerSectionDescription));

                if (!data.offerings || data.offerings.length === 0) {
                    useStaticOfferings();
                } else {
                    renderOfferings(data.offerings || []);
                }

                setLoading(false);
            });
        } catch (e) {
            setLoading(false);
            if (locale !== "en") {
                loadRenovationService("en");
            } else {
                useStaticOfferings();
            }
        }
    }

    function useStaticOfferings() {
        if (!dom.offeringsContainer) return;

        const staticCards = dom.offeringsContainer.querySelectorAll('.offering-card');

        if (staticCards.length === 0) {
            return;
        }


        const offeringCards = Array.from(staticCards).map(card => card.cloneNode(true));

        initOfferingsCarousel(offeringCards);
    }

    function initLanguageSwitch(loadFn) {
        const savedLang = localStorage.getItem("selectedLanguage") || "en";
        const engBtn = document.getElementById("eng");
        const gerBtn = document.getElementById("ger");

        if (engBtn && gerBtn) {
            engBtn.checked = savedLang === "en";
            gerBtn.checked = savedLang === "de";

            engBtn.addEventListener("change", () => engBtn.checked && loadFn("en"));
            gerBtn.addEventListener("change", () => gerBtn.checked && loadFn("de"));
        }

        loadFn(savedLang);
    }

    function initServiceFormModal() {
        const modal = document.getElementById('serviceFormModal');
        const openBtn = document.getElementById('openServiceFormBtn');
        const closeBtn = document.getElementById('closeServiceFormBtn');
        const cancelBtn = document.getElementById('cancelFormBtn');
        const form = document.getElementById('serviceRequestForm');

        if (!modal || !openBtn || !form) {
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        const serviceFromInput = document.getElementById('serviceFrom');
        const serviceToInput = document.getElementById('serviceTo');

        if (serviceFromInput) {
            serviceFromInput.setAttribute('min', today);
        }

        if (serviceToInput) {
            serviceToInput.setAttribute('min', today);
        }

        function openModal() {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';

            setTimeout(() => {
                const firstInput = form.querySelector('input');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 300);
        }

        function closeModal() {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            form.reset();
        }

        if (openBtn) {
            openBtn.addEventListener('click', openModal);
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeModal);
        }

        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });

        if (serviceFromInput && serviceToInput) {
            serviceFromInput.addEventListener('change', function() {
                serviceToInput.setAttribute('min', this.value);

                if (serviceToInput.value && serviceToInput.value < this.value) {
                    serviceToInput.value = '';
                }
            });
        }

        if (form) {
            form.addEventListener('submit', async function(event) {
                event.preventDefault();

                if (!form.checkValidity()) {
                    form.reportValidity();
                    return;
                }

                const fromDate = new Date(serviceFromInput.value);
                const toDate = new Date(serviceToInput.value);

                if (toDate < fromDate) {
                    alert('Service end date cannot be before start date.');
                    return;
                }

                const formData = {
                    fullName: document.getElementById('fullName').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    city: document.getElementById('city').value,
                    address: document.getElementById('address').value,
                    objectSize: document.getElementById('objectSize').value,
                    rooms: document.getElementById('rooms').value,
                    kitchen: document.getElementById('kitchen').value,
                    bathrooms: document.getElementById('bathrooms').value,
                    windows: document.getElementById('windows').value,
                    windowSize: document.getElementById('windowSize').value,
                    blinds: document.getElementById('blinds').value,
                    terrace: document.getElementById('terrace').value,
                    serviceFrom: serviceFromInput.value,
                    serviceTo: serviceToInput.value,
                    comments: document.getElementById('comments').value,
                    serviceType: 'Renovation',
                    submittedAt: new Date().toISOString()
                };


                alert('Thank you! Your service request has been submitted. We will contact you shortly.');

                closeModal();

            });
        }

    }

    document.addEventListener("DOMContentLoaded", async () => {

        await loadComponent('../components/services-cta/services-cta.html', 'cta-component');

        initServiceForm();

        initLanguageSwitch(loadRenovationService);
    });

    window.loadRenovationService = loadRenovationService;
})();
