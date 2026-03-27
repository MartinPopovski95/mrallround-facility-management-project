


function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const suffix = element.getAttribute('data-suffix') || '';
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toLocaleString() + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString();
        }
    }, 16);
}


const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = document.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    observer.observe(statsSection);
}


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || !href) return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 90;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const storedLang = localStorage.getItem('selectedLanguage') || 'en';

    const langRadio = document.querySelector(`input[value="${storedLang}"]`);
    if (langRadio) {
        langRadio.checked = true;
    }

    if (typeof applyTranslations === 'function') {
        applyTranslations(storedLang);
    }
});


let scrollTimeout;
window.addEventListener('scroll', function () {
    clearTimeout(scrollTimeout);

    document.querySelectorAll('.service-card, .gallery-item, .feature-card').forEach(el => {
        el.style.willChange = 'transform';
    });

    scrollTimeout = setTimeout(function () {
        document.querySelectorAll('.service-card, .gallery-item, .feature-card').forEach(el => {
            el.style.willChange = 'auto';
        });
    }, 250);
}, { passive: true });
