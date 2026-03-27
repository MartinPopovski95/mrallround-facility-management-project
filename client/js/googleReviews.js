import API_CONFIG from '../config.js';

class GoogleReviewsWidget {
	constructor(config) {
		this.apiBaseUrl = config.apiBaseUrl || API_CONFIG.BASE_URL;
		this.container = document.getElementById(config.containerId);
		this.reviews = [];
		this.averageRating = 5.0;
		this.totalReviews = 0;
		this.loading = true;
	}

	async fetchReviews() {
		try {
			const url = `${this.apiBaseUrl}/api/google-reviews`;

			const response = await fetch(url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			this.reviews = data.reviews || [];
			this.averageRating = data.averageRating || 5.0;
			this.totalReviews = data.totalReviews || this.reviews.length;
			this.loading = false;
			this.render();
		} catch (error) {
			this.useMockData();
		}
	}

	useMockData() {
		this.averageRating = 5.0;
		this.totalReviews = 3;
		this.reviews = [
			{
				reviewer: {
					displayName: "Christian Untersee-Oberle",
					profilePhotoUrl: null,
					isAnonymous: false,
				},
				starRating: "FIVE",
				comment:
					"Sehr empfehlenswert! EHF Endreinigung inkl. Abgabe wurde zu unserer vollsten Zufriedenheit ausgeführt. Freundliches und kompetentes Personal.",
				createTime: "2024-03-11T10:30:00Z",
				updateTime: "2024-03-11T10:30:00Z",
			},
			{
				reviewer: {
					displayName: "Steffan Zackariat",
					profilePhotoUrl: null,
					isAnonymous: false,
				},
				starRating: "FIVE",
				comment:
					"Super Service, super Kommunikation und vor allem saubere Räume. Da gibt's nichts zu beanstanden!",
				createTime: "2024-03-10T14:20:00Z",
				updateTime: "2024-03-10T14:20:00Z",
			},
			{
				reviewer: {
					displayName: "Stefan Petrovic",
					profilePhotoUrl: null,
					isAnonymous: false,
				},
				starRating: "FIVE",
				comment:
					"Ausgezeichnete Reinigungsfirma! Ich kann diese Reinigungsfirma nur wärmstens empfehlen! Die Professionalität und Gründlichkeit sind bemerkenswert.",
				createTime: "2024-03-09T16:45:00Z",
				updateTime: "2024-03-09T16:45:00Z",
			},
		];
		this.loading = false;
		this.render();
	}

	getInitials(name) {
		return name
			.split(" ")
			.map((word) => word[0])
			.join("")
			.toUpperCase()
			.substring(0, 2);
	}

	getAvatarColor(name) {
		const colors = ["#4A9D9C", "#E67E50", "#8B5E83", "#5A7D9A", "#D97777"];
		const index = name.charCodeAt(0) % colors.length;
		return colors[index];
	}

	formatDate(dateString) {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now - date);
		const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));

		if (diffMonths === 0) {
			const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
			return diffDays === 0
				? "today"
				: `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
		}
		return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
	}

	getStarRating(rating) {
		const ratings = {
			FIVE: 5,
			FOUR: 4,
			THREE: 3,
			TWO: 2,
			ONE: 1,
		};
		return ratings[rating] || 5;
	}

	calculateAverageRating() {
		if (this.averageRating) {
			return this.averageRating.toFixed(1);
		}
		if (this.reviews.length === 0) return 5.0;
		const sum = this.reviews.reduce(
			(acc, review) => acc + this.getStarRating(review.starRating),
			0
		);
		return (sum / this.reviews.length).toFixed(1);
	}

	truncateText(text, maxLength = 150) {
		if (text.length <= maxLength) return text;
		return text.substring(0, maxLength) + "...";
	}

	renderStars(count) {
		return Array(count).fill("⭐").join("");
	}

	render() {
		if (!this.container) return;

		const averageRating = this.calculateAverageRating();
		const reviewCount = this.totalReviews || this.reviews.length;

		this.container.innerHTML = `
            <div class="google-reviews-widget">
                <h2 class="reviews-title" data-i18n="reviews.title">What Our Customers Say</h2>

                <div class="reviews-header">
                    <div class="rating-summary">
                        <svg class="google-icon" viewBox="0 0 24 24" width="32" height="32">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span class="rating-number">${averageRating}</span>
                        <div class="stars">${this.renderStars(5)}</div>
                        <span class="review-count">(${reviewCount})</span>
                    </div>
                    <a href="https://www.google.com/maps/place/Bannstrasse+5,+4600+Olten,+Switzerland"
                       target="_blank"
                       rel="noopener noreferrer"
                       class="review-button"
                       data-i18n="reviews.button">
                        Review us on Google
                    </a>
                </div>

                <div class="reviews-grid">
                    ${this.reviews
						.map((review) => this.renderReviewCard(review))
						.join("")}
                </div>

                <div class="widget-footer">
                    <a href="https://www.google.com/maps/place/Bannstrasse+5,+4600+Olten,+Switzerland"
                       target="_blank"
                       rel="noopener noreferrer"
                       class="widget-attribution">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="10" fill="#fff"/>
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#4285F4"/>
                        </svg>
                        Powered by Google Reviews
                    </a>
                </div>
            </div>
        `;

		this.attachEventListeners();
	}

	renderReviewCard(review) {
		const initials = this.getInitials(review.reviewer.displayName);
		const avatarColor = this.getAvatarColor(review.reviewer.displayName);
		const timeAgo = this.formatDate(review.createTime);
		const stars = this.getStarRating(review.starRating);
		const isExpanded = false;
		const truncatedText = this.truncateText(review.comment);
		const needsReadMore = review.comment.length > 150;

		return `
            <div class="review-card">
                <div class="review-header">
                    <div class="reviewer-avatar" style="background-color: ${avatarColor}">
                        ${initials}
                    </div>
                    <div class="reviewer-info">
                        <div class="reviewer-name">
                            ${review.reviewer.displayName}
                            <svg class="verified-badge" width="16" height="16" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                        </div>
                        <div class="review-meta">
                            <span class="review-time">${timeAgo} on</span>
                            <span class="google-label">Google</span>
                        </div>
                    </div>
                </div>
                <div class="review-stars">${this.renderStars(stars)}</div>
                <div class="review-text">
                    <p class="review-content ${
						isExpanded ? "expanded" : ""
					}">${truncatedText}</p>
                    ${
						needsReadMore
							? `<button class="read-more-btn" data-i18n="reviews.readMore">Read more</button>`
							: ""
					}
                </div>
            </div>
        `;
	}

	attachEventListeners() {
		const readMoreButtons =
			this.container.querySelectorAll(".read-more-btn");
		readMoreButtons.forEach((button) => {
			button.addEventListener("click", (e) => {
				const reviewContent = e.target.previousElementSibling;
				const isExpanded = reviewContent.classList.contains("expanded");

				if (isExpanded) {
					reviewContent.classList.remove("expanded");
					const reviewIndex =
						Array.from(readMoreButtons).indexOf(button);
					reviewContent.textContent = this.truncateText(
						this.reviews[reviewIndex].comment
					);
					e.target.textContent = "Read more";
				} else {
					reviewContent.classList.add("expanded");
					const reviewIndex =
						Array.from(readMoreButtons).indexOf(button);
					reviewContent.textContent =
						this.reviews[reviewIndex].comment;
					e.target.textContent = "Read less";
				}
			});
		});
	}

	init() {
		this.fetchReviews();
	}
}

document.addEventListener("DOMContentLoaded", () => {
	import("../config.js")
		.then((module) => {
			const API_CONFIG = module.API_CONFIG;

			const widget = new GoogleReviewsWidget({
				apiBaseUrl: API_CONFIG.BASE_URL,
				containerId: "google-reviews-container",
			});

			widget.init();
		})
		.catch((error) => {
			const widget = new GoogleReviewsWidget({
				apiBaseUrl: API_CONFIG.BASE_URL,
				containerId: "google-reviews-container",
			});

			widget.init();
		});
});
