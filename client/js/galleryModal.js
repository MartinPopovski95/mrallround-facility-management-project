

(function () {
	'use strict';

	
	const modal = document.getElementById('galleryModal');
	const modalImage = document.getElementById('galleryModalImage');
	const modalOverlay = modal?.querySelector('.gallery-modal-overlay');
	const closeBtn = modal?.querySelector('.gallery-modal-close');
	const prevBtn = modal?.querySelector('.gallery-modal-prev');
	const nextBtn = modal?.querySelector('.gallery-modal-next');
	const currentIndexEl = document.getElementById('galleryCurrentIndex');
	const totalImagesEl = document.getElementById('galleryTotalImages');
	const loader = modal?.querySelector('.gallery-modal-loader');

	
	let galleryImages = [];
	let currentIndex = 0;
	let isOpen = false;

	
	function init() {
		if (!modal) {
			return;
		}

		
		
		const checkInterval = setInterval(() => {
			updateGalleryImages();
			if (galleryImages.length > 0) {
				clearInterval(checkInterval);
				setupEventListeners();
			}
		}, 500);

		
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => {
				setTimeout(() => {
					updateGalleryImages();
					setupEventListeners();
				}, 1000);
			});
		} else {
			setTimeout(() => {
				updateGalleryImages();
				setupEventListeners();
			}, 1000);
		}
	}

	
	function updateGalleryImages() {
		const galleryItems = document.querySelectorAll('.gallery-item');
		galleryImages = [];

		galleryItems.forEach((item, index) => {
			const img = item.querySelector('img');
			if (img && img.src && !img.src.includes('undefined')) {
				galleryImages.push({
					src: img.src,
					alt: img.alt || `Gallery image ${index + 1}`,
					element: item,
				});
			}
		});

		
		if (totalImagesEl && galleryImages.length > 0) {
			totalImagesEl.textContent = galleryImages.length;
		}

		return galleryImages.length;
	}

	
	function setupEventListeners() {
		
		updateGalleryImages();

		if (galleryImages.length === 0) return;

		
		const galleryItems = document.querySelectorAll('.gallery-item');
		galleryItems.forEach((item, index) => {
			
			const newItem = item.cloneNode(true);
			item.parentNode?.replaceChild(newItem, item);

			newItem.addEventListener('click', (e) => {
				e.preventDefault();
				
				const img = newItem.querySelector('img');
				if (img && img.src) {
					const imgIndex = galleryImages.findIndex(
						(gImg) => gImg.src === img.src
					);
					if (imgIndex !== -1) {
						openModal(imgIndex);
					}
				}
			});

			
			newItem.setAttribute('tabindex', '0');
			newItem.setAttribute('role', 'button');
			newItem.addEventListener('keydown', (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					const img = newItem.querySelector('img');
					if (img && img.src) {
						const imgIndex = galleryImages.findIndex(
							(gImg) => gImg.src === img.src
						);
						if (imgIndex !== -1) {
							openModal(imgIndex);
						}
					}
				}
			});
		});

		
		closeBtn?.addEventListener('click', closeModal);

		
		modalOverlay?.addEventListener('click', closeModal);

		
		prevBtn?.addEventListener('click', showPrevImage);
		nextBtn?.addEventListener('click', showNextImage);

		
		document.addEventListener('keydown', handleKeyPress);
	}

	
	function openModal(index) {
		if (!modal || galleryImages.length === 0) return;

		currentIndex = index;
		isOpen = true;

		
		document.body.classList.add('gallery-modal-open');

		
		modal.classList.add('active');

		
		loadImage(currentIndex);

		
		updateNavButtons();
	}

	
	function closeModal() {
		if (!modal || !isOpen) return;

		isOpen = false;

		
		modal.classList.remove('active');

		
		document.body.classList.remove('gallery-modal-open');

		
		setTimeout(() => {
			if (modalImage) {
				modalImage.src = '';
				modalImage.classList.remove('loaded');
			}
		}, 300);
	}

	
	function loadImage(index) {
		if (!modalImage || !galleryImages[index]) return;

		const imageData = galleryImages[index];

		
		loader?.classList.add('active');
		modalImage.classList.remove('loaded');

		
		const img = new Image();

		img.onload = () => {
			
			loader?.classList.remove('active');

			
			modalImage.src = imageData.src;
			modalImage.alt = imageData.alt;

			
			setTimeout(() => {
				modalImage.classList.add('loaded');
			}, 50);

			
			updateCounter();

			
			preloadAdjacentImages(index);
		};

		img.onerror = () => {
			loader?.classList.remove('active');

			
			modalImage.alt = 'Failed to load image';
		};

		
		img.src = imageData.src;
	}

	
	function preloadAdjacentImages(index) {
		
		if (index + 1 < galleryImages.length) {
			const nextImg = new Image();
			nextImg.src = galleryImages[index + 1].src;
		}

		
		if (index - 1 >= 0) {
			const prevImg = new Image();
			prevImg.src = galleryImages[index - 1].src;
		}
	}

	
	function showPrevImage() {
		if (currentIndex > 0) {
			currentIndex--;
			loadImage(currentIndex);
			updateNavButtons();
		}
	}

	
	function showNextImage() {
		if (currentIndex < galleryImages.length - 1) {
			currentIndex++;
			loadImage(currentIndex);
			updateNavButtons();
		}
	}

	
	function updateNavButtons() {
		if (!prevBtn || !nextBtn) return;

		
		if (currentIndex === 0) {
			prevBtn.disabled = true;
		} else {
			prevBtn.disabled = false;
		}

		
		if (currentIndex === galleryImages.length - 1) {
			nextBtn.disabled = true;
		} else {
			nextBtn.disabled = false;
		}
	}

	
	function updateCounter() {
		if (currentIndexEl) {
			currentIndexEl.textContent = currentIndex + 1;
		}
	}

	
	function handleKeyPress(e) {
		if (!isOpen) return;

		switch (e.key) {
			case 'Escape':
				closeModal();
				break;
			case 'ArrowLeft':
				e.preventDefault();
				showPrevImage();
				break;
			case 'ArrowRight':
				e.preventDefault();
				showNextImage();
				break;
		}
	}

	
	window.refreshGalleryModal = function () {
		const count = updateGalleryImages();
		if (count > 0) {
			setupEventListeners();
		}
		return count;
	};

	
	init();

	
	setTimeout(() => {
		if (updateGalleryImages() > 0) {
			setupEventListeners();
		}
	}, 2000);
})();
