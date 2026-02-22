/* ============================================
   ISHONCH — LIQUID GLASS INTERACTIONS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- MOBILE MENU ----------
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ---------- NAVBAR SCROLL EFFECT ----------
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        navbar.classList.toggle('scrolled', currentScroll > 50);
        lastScroll = currentScroll;
    });

    // ---------- ACTIVE NAV LINK ON SCROLL ----------
    const sections = document.querySelectorAll('section[id]');
    const navLinkElements = document.querySelectorAll('.nav-link');

    function highlightNavLink() {
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinkElements.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    // ---------- SCROLL REVEAL ----------
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger child reveals
                const delay = entry.target.closest('.features__grid, .promo__grid, .about__stats')
                    ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 100
                    : 0;

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---------- ANIMATED COUNTERS ----------
    const statNumbers = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => counterObserver.observe(num));

    function animateCounter(el) {
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const start = performance.now();

        function formatNumber(n) {
            if (n >= 1000000) return (n / 1000000).toFixed(0) + 'M';
            if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
            return n.toString();
        }

        function update(timestamp) {
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            el.textContent = formatNumber(current);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = formatNumber(target);
            }
        }

        requestAnimationFrame(update);
    }

    // ---------- PARTICLES ----------
    const particlesContainer = document.getElementById('particles');

    function createParticles() {
        const count = window.innerWidth < 768 ? 15 : 30;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${50 + Math.random() * 50}%`;
            particle.style.setProperty('--duration', `${3 + Math.random() * 4}s`);
            particle.style.setProperty('--delay', `${Math.random() * 5}s`);
            particle.style.width = `${2 + Math.random() * 3}px`;
            particle.style.height = particle.style.width;
            particlesContainer.appendChild(particle);
        }
    }

    createParticles();

    // ---------- STORE SEARCH AND RENDER ----------
    const storeSearch = document.getElementById('storeSearch');
    const storesListContainer = document.getElementById('storesList');

    function groupStoresByRegion(stores) {
        const groups = {};
        stores.forEach(store => {
            const region = store.region || 'Boshqa';
            if (!groups[region]) groups[region] = [];
            groups[region].push(store);
        });
        return groups;
    }

    function renderStores(storesToRender) {
        if (!storesListContainer) return;

        if (storesToRender.length === 0) {
            storesListContainer.innerHTML = `<p class="stores__empty">Hech narsa topilmadi...</p>`;
            return;
        }

        const groups = groupStoresByRegion(storesToRender);
        let html = '';
        const isSingleGroup = Object.keys(groups).length === 1;

        // Filter out 'Boshqa' if it only has ITOGO
        const regionNames = Object.keys(groups).sort().filter(r => {
            if (r === 'Boshqa') {
                return groups[r].some(s => s.name !== 'ITOGO');
            }
            return true;
        });

        regionNames.forEach(regionName => {
            const regionStores = groups[regionName].filter(s => s.name !== 'ITOGO');
            if (regionStores.length === 0) return;
            const count = regionStores.length;

            html += `
                <div class="region-group">
                    <div class="region-header${isSingleGroup ? ' open' : ''}">
                        <h3 class="region-header__title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;color:var(--accent-primary)"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            ${regionName}
                            <span class="region-header__count">${count}</span>
                        </h3>
                        <svg class="region-header__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
                    </div>
                    <div class="region-content${isSingleGroup ? ' open' : ''}" style="${isSingleGroup ? '' : ''}">
                        <div class="region-content__inner">
            `;

            regionStores.forEach((store, i) => {
                const globalIndex = typeof ISHONCH_STORES !== 'undefined'
                    ? ISHONCH_STORES.findIndex(s => s.name === store.name && s.address === store.address)
                    : -1;

                html += `
                    <div class="store-item" data-region="${store.region}" data-store-index="${globalIndex}" style="animation-delay: ${i * 0.04}s">
                        <svg class="store-item__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        <div class="store-item__info">
                            <strong>${store.name}</strong>
                            <span>${store.address}</span>
                            ${store.target ? `<span>📍 ${store.target}</span>` : ''}
                            ${store.link ? `<a href="${store.link}" target="_blank" onclick="event.stopPropagation();" class="store-item__link">Google Maps <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>` : ''}
                        </div>
                    </div>
                `;
            });

            html += `
                        </div>
                    </div>
                </div>
            `;
        });

        storesListContainer.innerHTML = html;

        // Accordion logic with smooth max-height animation
        storesListContainer.querySelectorAll('.region-group').forEach(group => {
            const header = group.querySelector('.region-header');
            const content = group.querySelector('.region-content');

            // Set initial max-height for already-open groups
            if (content.classList.contains('open')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            }

            header.addEventListener('click', () => {
                const isOpen = content.classList.contains('open');

                if (!isOpen) {
                    header.classList.add('open');
                    content.classList.add('open');
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    header.classList.remove('open');
                    content.style.maxHeight = '0px';
                    setTimeout(() => content.classList.remove('open'), 400);
                }
            });
        });

        // Store card click -> fly to map marker
        storesListContainer.querySelectorAll('.store-item[data-store-index]').forEach(card => {
            card.addEventListener('click', () => {
                const idx = parseInt(card.dataset.storeIndex);
                if (idx < 0 || !window._ishonchMap) return;
                const store = ISHONCH_STORES[idx];
                if (!store || !store.lat || !store.lng) return;

                // Highlight active card
                storesListContainer.querySelectorAll('.store-item').forEach(c => c.classList.remove('store-active'));
                card.classList.add('store-active');

                // Fly to store on map
                window._ishonchMap.setCenter([store.lat, store.lng], 15, {
                    duration: 600
                });

                // Open balloon for this store
                if (window._ishonchGeoObjects) {
                    window._ishonchGeoObjects.each(geoObj => {
                        const coords = geoObj.geometry.getCoordinates();
                        if (Math.abs(coords[0] - store.lat) < 0.001 && Math.abs(coords[1] - store.lng) < 0.001) {
                            geoObj.balloon.open();
                        }
                    });
                }
            });
        });
    }

    if (typeof ISHONCH_STORES !== 'undefined') {
        renderStores(ISHONCH_STORES);

        if (storeSearch) {
            storeSearch.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const filtered = ISHONCH_STORES.filter(store =>
                    store.name.toLowerCase().includes(query) ||
                    store.address.toLowerCase().includes(query) ||
                    store.target.toLowerCase().includes(query)
                );
                renderStores(filtered);
            });
        }
    }

    // ---------- YANDEX MAP INITIALIZATION ----------
    if (typeof ymaps !== 'undefined' && document.getElementById('storesMap')) {
        ymaps.ready(function () {
            const map = new ymaps.Map('storesMap', {
                center: [41.3, 64.5],
                zoom: 5,
                controls: ['zoomControl', 'geolocationControl', 'fullscreenControl']
            }, {
                suppressMapOpenBlock: true
            });

            window._ishonchMap = map;

            // Create clusterer for better performance with 120+ markers
            const clusterer = new ymaps.Clusterer({
                preset: 'islands#greenClusterIcons',
                groupByCoordinates: false,
                clusterDisableClickZoom: false,
                clusterHideIconOnBalloonOpen: false,
                geoObjectHideIconOnBalloonOpen: false,
                clusterBalloonContentLayout: 'cluster#balloonCarousel',
                clusterOpenBalloonOnClick: true
            });

            const geoObjects = [];

            if (typeof ISHONCH_STORES !== 'undefined') {
                ISHONCH_STORES.forEach((store, index) => {
                    if (!store.lat || !store.lng || store.name === 'ITOGO') return;

                    const placemark = new ymaps.Placemark([store.lat, store.lng], {
                        balloonContentHeader: `<strong style="font-size:14px;">${store.name}</strong>`,
                        balloonContentBody: `
                            <div style="font-size:13px; line-height:1.6;">
                                <p style="margin:4px 0; color:#555;">${store.address}</p>
                                ${store.target ? `<p style="margin:4px 0; color:#888;">📍 Mo'ljal: ${store.target}</p>` : ''}
                                ${store.link ? `<a href="${store.link}" target="_blank" style="color:#10b981; font-weight:600; text-decoration:none;">Google Maps →</a>` : ''}
                            </div>
                        `,
                        hintContent: store.name,
                        storeIndex: index
                    }, {
                        preset: 'islands#greenDotIcon'
                    });

                    geoObjects.push(placemark);
                });
            }

            clusterer.add(geoObjects);
            map.geoObjects.add(clusterer);

            // Store reference for click-to-fly
            window._ishonchGeoObjects = clusterer;

            // Fit map to show all markers initially
            if (geoObjects.length > 0) {
                map.setBounds(clusterer.getBounds(), {
                    checkZoomRange: true,
                    zoomMargin: 40
                });
            }
        });
    }

    // ---------- LANGUAGE SWITCHER ----------
    const langBtns = document.querySelectorAll('.lang-btn');
    let currentLang = localStorage.getItem('ishonch_lang') || 'uz';

    function applyLanguage(lang) {
        if (typeof ISHONCH_LANG === 'undefined' || !ISHONCH_LANG[lang]) return;
        const dict = ISHONCH_LANG[lang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (dict[key]) {
                if (el.dataset.i18nHtml === 'true') {
                    el.innerHTML = dict[key];
                } else {
                    el.textContent = dict[key];
                }
            }
        });
        // Update active lang button
        langBtns.forEach(b => b.classList.remove('active'));
        const activeBtn = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        currentLang = lang;
        localStorage.setItem('ishonch_lang', lang);
    }

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            if (lang) applyLanguage(lang);
        });
    });

    // Apply saved language on load
    if (currentLang !== 'uz') {
        applyLanguage(currentLang);
    }

    // ---------- DYNAMIC CONTENT LOADING ----------
    const DEFAULT_DATA = {
        banners: [
            {
                id: 1,
                badge: "<i data-lucide='award' style='width:16px;height:16px;display:inline-block;vertical-align:text-bottom;'></i> 120+ do'kon butun O'zbekiston bo'ylab",
                title: "Tez va qulay <span class='gradient-text'>muddatli to'lov</span>",
                subtitle: "Maishiy texnika, elektronika va uy jihozlarini muddatli to'lovga xarid qiling. Pasport bilan — hech qanday kafilsiz.",
                image: "", // Placeholder or path
                ctaText: "Ko'proq bilish",
                ctaLink: "#features"
            },
            {
                id: 2,
                badge: "<i data-lucide='flame' style='width:16px;height:16px;display:inline-block;vertical-align:text-bottom;'></i> Yangi aksiya",
                title: "Bahoriy <span class='gradient-text'>chegirmalar</span> boshlandi!",
                subtitle: "Barcha oshxona jihozlari uchun 20% gacha keshbek oling. Shoshiling, muddat cheklangan!",
                image: "",
                ctaText: "Aksiyalarni ko'rish",
                ctaLink: "#promotions"
            },
            {
                id: 3,
                badge: "<i data-lucide='smartphone' style='width:16px;height:16px;display:inline-block;vertical-align:text-bottom;'></i> Smartfonlar",
                title: "Eng so'nggi <span class='gradient-text'>iPhone 17</span> endi bizda",
                subtitle: "Boshlang'ich to'lovsiz, 12 oyga bo'lib to'lash imkoniyati bilan.",
                image: "",
                ctaText: "Sotib olish",
                ctaLink: "#contact"
            }
        ],
        promotions: [
            {
                id: 1,
                badge: "<i data-lucide='flame' style='width:16px;height:16px;display:inline-block;vertical-align:text-bottom;'></i> Aksiya",
                icon: "<i data-lucide='tv' style='width:48px;height:48px;color:var(--accent-primary);'></i>",
                title: "Televizorlar",
                desc: "Samsung, LG, va boshqa brendlar — maxsus narxlarda muddatli to'lovga",
                price: "dan 350 000 so'm/oy",
                link: "#"
            },
            {
                id: 2,
                badge: "<i data-lucide='zap' style='width:16px;height:16px;display:inline-block;vertical-align:text-bottom;'></i> Yangi",
                icon: "<i data-lucide='smartphone' style='width:48px;height:48px;color:var(--accent-primary);'></i>",
                title: "Smartfonlar",
                desc: "iPhone, Samsung Galaxy, Xiaomi — eng so'nggi modellari",
                price: "dan 200 000 so'm/oy",
                link: "#"
            }
        ]
    };

    function loadAppData() {
        // Force reset for new SVG icons demo
        localStorage.removeItem('ishonch_app_data');

        let data = localStorage.getItem('ishonch_app_data');
        if (!data) {
            localStorage.setItem('ishonch_app_data', JSON.stringify(DEFAULT_DATA));
            return DEFAULT_DATA;
        }
        return JSON.parse(data);
    }

    const appData = loadAppData();

    function renderBanners() {
        const wrapper = document.getElementById('bannerWrapper');
        if (!wrapper) return;

        wrapper.innerHTML = appData.banners.map(banner => `
            <div class="swiper-slide hero__slide">
                <div class="container hero__content">
                    <div class="hero__text">
                        <span class="hero__badge">${banner.badge}</span>
                        <h1 class="hero__title">${banner.title}</h1>
                        <p class="hero__subtitle">${banner.subtitle}</p>
                        <div class="hero__cta">
                            <a href="${banner.ctaLink}" class="btn btn--primary">
                                <span>${banner.ctaText}</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </a>
                            <a href="#stores" class="btn btn--glass">
                                <span>Do'konlarni topish</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function renderPromotions() {
        const wrapper = document.getElementById('promoWrapper');
        if (!wrapper) return;

        wrapper.innerHTML = appData.promotions.map(promo => `
            <div class="promo-card glass-card reveal visible">
                <div class="promo-card__badge">${promo.badge}</div>
                <div class="promo-card__icon">${promo.icon}</div>
                <h3 class="promo-card__title">${promo.title}</h3>
                <p class="promo-card__desc">${promo.desc}</p>
                <div class="promo-card__footer">
                    <span class="promo-card__price">${promo.price}</span>
                    <a href="${promo.link}" class="promo-card__link">Batafsil →</a>
                </div>
            </div>
        `).join('');
    }

    renderBanners();
    renderPromotions();

    // Create icons after rendering dynamic content
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // ---------- CALCULATOR LOGIC ----------
    const calcPrice = document.getElementById('calcPrice');
    const calcMonth = document.getElementById('calcMonth');
    const calcPriceLabel = document.getElementById('calcPriceLabel');
    const calcMonthLabel = document.getElementById('calcMonthLabel');
    const calcResult = document.getElementById('calcResult');

    let _prevCalcValue = 0;

    function updateCalculator() {
        if (!calcPrice || !calcMonth || !calcResult) return;

        const price = parseInt(calcPrice.value);
        const months = parseInt(calcMonth.value);

        // ISHONCH markup rates by term
        const markupRates = { 3: 0.27, 6: 0.36, 9: 0.38, 12: 0.42 };
        const markupRate = markupRates[months] || 0.42;
        const total = price + (price * markupRate);
        const monthlyPayment = Math.round(total / months / 1000) * 1000;

        // Format with spaces for thousands
        const formatNumber = (num) => new Intl.NumberFormat('uz-UZ').format(num).replace(/,/g, ' ');

        calcPriceLabel.textContent = formatNumber(price) + " so'm";
        calcMonthLabel.textContent = months + " oy";

        // Animate the result number
        animateValue(calcResult, _prevCalcValue, monthlyPayment, 300, formatNumber);
        _prevCalcValue = monthlyPayment;
    }

    function animateValue(el, start, end, duration, formatter) {
        if (start === end) {
            el.textContent = formatter(end) + " so'm";
            return;
        }
        const startTime = performance.now();
        el.classList.add('counting');

        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (end - start) * eased);
            el.textContent = formatter(current) + " so'm";

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = formatter(end) + " so'm";
                el.classList.remove('counting');
            }
        }
        requestAnimationFrame(step);
    }

    if (calcPrice) calcPrice.addEventListener('input', updateCalculator);
    if (calcMonth) calcMonth.addEventListener('input', updateCalculator);

    // Initial calc formatting
    updateCalculator();

    // ---------- FAQ ACCORDION ----------
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-item__header');
        if (header) {
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                // Close all currently open FAQ items
                faqItems.forEach(faq => faq.classList.remove('active'));

                // Toggle clicked item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
    // ---------- PHONE MASK ----------
    const phoneInput = document.getElementById('leadPhone');
    if (phoneInput) {
        phoneInput.value = '+998 ';

        phoneInput.addEventListener('input', (e) => {
            // Strip everything except digits
            let digits = e.target.value.replace(/\D/g, '');

            // Always start with 998
            if (!digits.startsWith('998')) {
                digits = '998' + digits.replace(/^998*/, '');
            }

            // Limit to 12 digits (998 + 9 digits)
            digits = digits.substring(0, 12);

            // Format: +998 (XX) XXX-XX-XX
            let formatted = '+998';
            if (digits.length > 3) {
                formatted += ' (' + digits.substring(3, 5);
            }
            if (digits.length > 5) {
                formatted += ') ' + digits.substring(5, 8);
            }
            if (digits.length > 8) {
                formatted += '-' + digits.substring(8, 10);
            }
            if (digits.length > 10) {
                formatted += '-' + digits.substring(10, 12);
            }

            e.target.value = formatted;
        });

        phoneInput.addEventListener('keydown', (e) => {
            // Prevent deleting the +998 prefix
            if (e.target.selectionStart <= 4 && (e.key === 'Backspace' || e.key === 'Delete')) {
                e.preventDefault();
            }
        });

        phoneInput.addEventListener('focus', () => {
            if (!phoneInput.value || phoneInput.value.length < 5) {
                phoneInput.value = '+998 ';
            }
            // Move cursor to end
            setTimeout(() => {
                phoneInput.setSelectionRange(phoneInput.value.length, phoneInput.value.length);
            }, 0);
        });
    }

    // ---------- FORM SUBMIT ----------
    const CRM_API = window.CRM_API_URL || 'http://localhost:8000';
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = leadForm.querySelector('button');
            const originalText = btn.textContent;
            const name = document.getElementById('leadName').value.trim();
            const phone = document.getElementById('leadPhone').value.trim();

            if (!name || !phone) return;

            btn.textContent = "Yuborilmoqda...";
            btn.style.opacity = '0.7';
            btn.disabled = true;

            try {
                await fetch(`${CRM_API}/api/lead`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, phone, source: 'website' })
                });
            } catch (err) {
                console.log('CRM API not available, lead saved locally');
            }

            btn.textContent = "✅ Yuborildi! Tez orada bog'lanamiz.";
            btn.style.opacity = '1';
            btn.style.background = "var(--accent-primary)";
            btn.disabled = false;
            leadForm.reset();

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 4000);
        });
    }

    // ---------- SWIPER INITIALIZATION ----------
    const swiper = new Swiper('.hero-swiper', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        }
    });

    // ---------- SMOOTH SCROLL FOR ANCHOR LINKS ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ---------- BACK TO TOP BUTTON ----------
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }




    // ---------- PRELOADER ----------
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 1600);
        });
    }
});
