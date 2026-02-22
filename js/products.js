/* ============================================
   ISHONCH — PRODUCT CATALOG LOGIC
   ============================================ */

const PRODUCT_CATEGORIES = {
    smartphones: { name: "Smartfonlar", icon: "smartphone" },
    tv: { name: "Televizorlar", icon: "tv" },
    laptops: { name: "Noutbuklar", icon: "laptop" },
    appliances: { name: "Maishiy texnika", icon: "refrigerator" },
    small: { name: "Mayda texnika", icon: "coffee" },
    audio: { name: "Audio texnika", icon: "headphones" }
};

document.addEventListener('DOMContentLoaded', async () => {

    const ITEMS_PER_PAGE = 12;
    let currentPage = 1;
    let ISHONCH_PRODUCTS = [];
    let PRODUCT_BRANDS = [];
    let filteredProducts = [];

    // Fetch products dynamically
    const CRM_API_URL = window.CRM_API_URL || 'http://localhost:8000';
    try {
        const productRes = await fetch(`${CRM_API_URL}/api/products`);
        if (productRes.ok) {
            ISHONCH_PRODUCTS = await productRes.json();
            PRODUCT_BRANDS = [...new Set(ISHONCH_PRODUCTS.map(p => p.brand))].sort();
            filteredProducts = [...ISHONCH_PRODUCTS];
        } else {
            console.error("Katalogni yuklashda xato yuz berdi:", await productRes.text());
        }
    } catch (err) {
        console.error("Tarmoq xatosi, katalogni yuklab bo'lmadi:", err);
    }

    let activeCategory = 'all';
    let activeBrands = [];
    let priceMin = 0;
    let priceMax = Infinity;
    let sortMode = 'default';
    let searchQuery = '';

    // DOM elements
    const productGrid = document.getElementById('productGrid');
    const productCount = document.getElementById('productCount');
    const paginationEl = document.getElementById('pagination');
    const searchInput = document.getElementById('productSearch');
    const sortSelect = document.getElementById('productSort');
    const filterCategoriesEl = document.getElementById('filterCategories');
    const filterBrandsEl = document.getElementById('filterBrands');
    const priceMinInput = document.getElementById('priceMin');
    const priceMaxInput = document.getElementById('priceMax');
    const priceApplyBtn = document.getElementById('priceApply');
    const filterResetBtn = document.getElementById('filterReset');
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');
    const filterToggle = document.getElementById('filterToggle');
    const sidebar = document.getElementById('catalogSidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    const backToTop = document.getElementById('backToTop');

    // --- Format price ---
    function formatPrice(num) {
        return new Intl.NumberFormat('uz-UZ').format(num).replace(/,/g, ' ');
    }

    // --- Calculate installment ---
    function calcInstallment(price, months) {
        const rates = { 3: 0.27, 6: 0.36, 9: 0.38, 12: 0.42 };
        const rate = rates[months] || 0.42;
        const total = price + (price * rate);
        return Math.round(total / months / 1000) * 1000;
    }

    // --- Transliteration (Cyrillic ↔ Latin for Uzbek) ---
    const cyrToLat = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'j',
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'x', 'ц': 'ts',
        'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'i', 'ь': '', 'э': 'e', 'ю': 'yu',
        'я': 'ya', 'ў': 'o\'', 'қ': 'q', 'ғ': 'g\'', 'ҳ': 'h'
    };
    const latToCyr = {};
    // Build reverse map (multi-char mappings first)
    const multiLatToCyr = {
        'shch': 'щ', 'ch': 'ч', 'sh': 'ш', 'yo': 'ё', 'yu': 'ю', 'ya': 'я', 'ts': 'ц',
        "o'": 'ў', "g'": 'ғ'
    };
    Object.entries(cyrToLat).forEach(([c, l]) => { if (l && l.length === 1) latToCyr[l] = c; });

    function toLatin(str) {
        return str.split('').map(c => cyrToLat[c] || cyrToLat[c.toLowerCase()] || c).join('');
    }

    function toCyrillic(str) {
        let result = str.toLowerCase();
        // Replace multi-char sequences first
        Object.entries(multiLatToCyr).forEach(([lat, cyr]) => {
            result = result.split(lat).join(cyr);
        });
        // Then single chars
        result = result.split('').map(c => latToCyr[c] || c).join('');
        return result;
    }

    // Phonetic normalization — collapse vowels & double consonants
    function phoneticNorm(str) {
        return str.toLowerCase()
            .replace(/[eiouыэюяўё]/g, 'a')  // all vowels → 'a'
            .replace(/(.)\1+/g, '$1');         // double letters → single
    }

    function matchesSearch(text, query) {
        const t = text.toLowerCase();
        const q = query.toLowerCase();
        const qLat = toLatin(q);
        const tLat = toLatin(t);

        // Exact substring match (original, transliterated both directions)
        if (t.includes(q) || t.includes(qLat) || t.includes(toCyrillic(q))) return true;
        if (tLat.includes(q) || tLat.includes(qLat)) return true;

        // Fuzzy match — split text into words and check similarity
        const words = tLat.split(/[\s,\-\/:]+/).filter(w => w.length >= 2);
        const qWords = qLat.split(/\s+/).filter(w => w.length >= 2);
        for (const qw of qWords) {
            const qwPhon = phoneticNorm(qw);
            for (const w of words) {
                // Phonetic match (simsing → samsang ≈ samsung → samsang)
                if (qw.length >= 3 && phoneticNorm(w).includes(qwPhon)) return true;
                // Prefix match (first 3+ chars)
                if (qw.length >= 3 && w.startsWith(qw.substring(0, 3))) return true;
                if (w.length >= 3 && qw.startsWith(w.substring(0, 3))) return true;
                // Bigram fuzzy match
                if (fuzzyScore(w, qw) >= 0.33) return true;
            }
        }
        return false;
    }

    // Bigram similarity (Dice coefficient) — tolerates 1-2 typos
    function fuzzyScore(a, b) {
        if (a === b) return 1;
        if (a.length < 2 || b.length < 2) return 0;
        const bigramsA = new Set();
        for (let i = 0; i < a.length - 1; i++) bigramsA.add(a.substring(i, i + 2));
        let matches = 0;
        for (let i = 0; i < b.length - 1; i++) {
            if (bigramsA.has(b.substring(i, i + 2))) matches++;
        }
        return (2 * matches) / (a.length - 1 + b.length - 1);
    }

    // --- Build filter UI ---
    function buildFilters() {
        // Categories
        Object.entries(PRODUCT_CATEGORIES).forEach(([key, cat]) => {
            const count = ISHONCH_PRODUCTS.filter(p => p.category === key).length;
            const label = document.createElement('label');
            label.className = 'filter-option';
            label.innerHTML = `<input type="radio" name="category" value="${key}"> ${cat.name} <span style="color:var(--text-muted);font-size:0.8rem;">(${count})</span>`;
            filterCategoriesEl.appendChild(label);
        });

        // Brands
        PRODUCT_BRANDS.forEach(brand => {
            const label = document.createElement('label');
            label.className = 'filter-option';
            label.innerHTML = `<input type="checkbox" value="${brand}"> ${brand}`;
            filterBrandsEl.appendChild(label);
        });
    }

    // --- Apply filters ---
    function applyFilters() {
        filteredProducts = ISHONCH_PRODUCTS.filter(p => {
            if (activeCategory !== 'all' && p.category !== activeCategory) return false;
            if (activeBrands.length > 0 && !activeBrands.includes(p.brand)) return false;
            if (p.price < priceMin || p.price > priceMax) return false;
            if (searchQuery) {
                if (!matchesSearch(p.name, searchQuery) &&
                    !matchesSearch(p.brand, searchQuery) &&
                    !matchesSearch(p.specs, searchQuery)) return false;
            }
            return true;
        });

        // Sort
        switch (sortMode) {
            case 'price_asc':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name_asc':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // Keep original order (popular first by default)
                break;
        }

        currentPage = 1;
        renderProducts();
        renderPagination();
        updateCount();
    }

    // --- Favorites ---
    let favorites = JSON.parse(localStorage.getItem('ishonch_fav') || '[]');
    function toggleFav(id, e) {
        e.stopPropagation();
        const idx = favorites.indexOf(id);
        if (idx > -1) favorites.splice(idx, 1);
        else favorites.push(id);
        localStorage.setItem('ishonch_fav', JSON.stringify(favorites));
        renderProducts();
        updateFavCount();
    }
    function updateFavCount() {
        const el = document.getElementById('navFavCount');
        if (el) {
            el.textContent = favorites.length;
            el.style.display = favorites.length > 0 ? 'flex' : 'none';
        }
    }
    updateFavCount();

    // --- Render products ---
    function renderProducts() {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const pageProducts = filteredProducts.slice(start, start + ITEMS_PER_PAGE);

        if (pageProducts.length === 0) {
            productGrid.innerHTML = `<div class="product-grid__empty">
                <p style="font-size:2rem;margin-bottom:12px;">🔍</p>
                <p>Hech narsa topilmadi</p>
                <p style="font-size:0.85rem;color:var(--text-muted);margin-top:4px;">Filtrlarni o'zgartirib ko'ring</p>
            </div>`;
            return;
        }

        productGrid.innerHTML = pageProducts.map((p, i) => {
            const hasDiscount = p.discount_percent > 0;
            const finalPrice = hasDiscount ? p.price * (1 - p.discount_percent / 100) : p.price;
            const monthlyPay = calcInstallment(finalPrice, 12);

            const badgeClass = p.badge === 'hit' ? 'product-card__badge--hit' :
                p.badge === 'new' ? 'product-card__badge--new' : '';
            const badgeText = p.badge === 'hit' ? '🔥 Hit' : p.badge === 'new' ? '✨ Yangi' : '';

            const isFav = favorites.includes(p.id);
            const outOfStock = p.inStock === false;

            return `
                <div class="product-card${outOfStock ? ' product-card--oos' : ''}" data-product-id="${p.id}" style="animation-delay: ${i * 0.06}s">
                    <div class="product-card__image">
                        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22 fill=%22%23ccc%22%3E%3Crect width=%22200%22 height=%22200%22 fill=%22%23f0f0f0%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2214%22 fill=%22%23999%22%3ERasm%3C/text%3E%3C/svg%3E'">
                        ${badgeText ? `<span class="product-card__badge ${badgeClass}">${badgeText}</span>` : ''}
                        ${hasDiscount ? `<span class="product-card__badge" style="background: #ef4444; top: 10px; right: 10px; left: auto;">-${p.discount_percent}%</span>` : ''}
                        ${outOfStock ? '<span class="product-card__badge product-card__badge--oos">Mavjud emas</span>' : ''}
                        <button class="product-card__fav${isFav ? ' active' : ''}" data-fav-id="${p.id}">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                        </button>
                    </div>
                    <div class="product-card__body">
                        <div class="product-card__brand">${p.brand}</div>
                        <div class="product-card__name">${p.name}</div>
                        <div class="product-card__specs">${p.specs}</div>
                        <div class="product-card__price">
                            ${hasDiscount ? `<span style="text-decoration: line-through; color: var(--text-muted); font-size: 0.9rem; margin-right: 8px;">${formatPrice(p.price)}</span>` : ''}
                            ${formatPrice(finalPrice)} so'm
                        </div>
                        <div class="product-card__installment-pill">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            <span>${formatPrice(monthlyPay)} so'm/oy</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Fav button clicks
        productGrid.querySelectorAll('.product-card__fav').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.dataset.favId;
                toggleFav(id, e);
            });
        });

        // Card click -> open modal
        productGrid.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.product-card__fav')) return;
                const id = card.dataset.productId;
                openModal(id);
            });
        });
    }

    // --- Pagination ---
    function renderPagination() {
        const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
        if (totalPages <= 1) {
            paginationEl.innerHTML = '';
            return;
        }

        let html = '';
        for (let i = 1; i <= totalPages; i++) {
            html += `<button class="pagination__btn${i === currentPage ? ' active' : ''}" data-page="${i}">${i}</button>`;
        }
        paginationEl.innerHTML = html;

        paginationEl.querySelectorAll('.pagination__btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentPage = parseInt(btn.dataset.page);
                renderProducts();
                renderPagination();
                window.scrollTo({ top: productGrid.offsetTop - 100, behavior: 'smooth' });
            });
        });
    }

    // --- Count ---
    function updateCount() {
        productCount.textContent = `${filteredProducts.length} ta mahsulot`;
    }

    // --- Category-specific spec SVG icons ---
    const SPEC_ICONS = {
        smartphones: [
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18.01"/></svg>',
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="2" x2="9" y2="4"/><line x1="15" y1="2" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="22"/><line x1="15" y1="20" x2="15" y2="22"/></svg>',
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>'
        ],
        tv: [
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M7 10h2l1-3 2 6 2-3h3"/></svg>',
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="2" x2="9" y2="4"/><line x1="15" y1="2" x2="15" y2="4"/></svg>',
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>'
        ],
        laptops: [
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>',
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="2" x2="9" y2="4"/><line x1="15" y1="2" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="22"/><line x1="15" y1="20" x2="15" y2="22"/></svg>',
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12H2"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="6" width="22" height="12" rx="2"/><line x1="6" y1="10" x2="6" y2="14"/><line x1="18" y1="10" x2="18" y2="14"/></svg>'
        ],
        appliances: [
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="4" y1="10" x2="20" y2="10"/><circle cx="8" cy="6" r="1"/></svg>',
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4"/></svg>',
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'
        ],
        audio: [
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>',
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="6" width="22" height="12" rx="2"/><line x1="6" y1="10" x2="6" y2="14"/><line x1="18" y1="10" x2="18" y2="14"/></svg>',
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>'
        ],
        small: [
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33"/></svg>',
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>',
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'
        ]
    };

    // --- Modal ---
    function openModal(productId) {
        const p = ISHONCH_PRODUCTS.find(x => x.id == productId);
        if (!p) return;

        const specsArr = p.specs.split(', ');
        const icons = SPEC_ICONS[p.category] || SPEC_ICONS.smartphones;

        const specsHtml = specsArr.map((s, i) => `
            <div class="modal-spec-item">
                <span class="modal-spec-icon">${icons[i % icons.length]}</span>
                <span class="modal-spec-text">${s.trim()}</span>
            </div>
        `).join('');

        const installments = [
            { months: 3, rate: 0.27 },
            { months: 6, rate: 0.36 },
            { months: 9, rate: 0.38 },
            { months: 12, rate: 0.42 }
        ];

        const hasDiscount = p.discount_percent > 0;
        const finalPrice = hasDiscount ? p.price * (1 - p.discount_percent / 100) : p.price;

        const installmentCards = installments.map(plan => {
            const total = finalPrice + finalPrice * plan.rate;
            const monthly = Math.round(total / plan.months / 1000) * 1000;
            return `
                <div class="installment-card">
                    <div class="installment-card__months">${plan.months} oy</div>
                    <div class="installment-card__monthly">${formatPrice(monthly)}</div>
                    <div class="installment-card__label">so'm/oy</div>
                </div>
            `;
        }).join('');

        modalBody.innerHTML = `
            <div class="modal-grid">
                <div class="modal-image">
                    <img src="${p.image}" alt="${p.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect width=%22300%22 height=%22300%22 fill=%22%23f0f0f0%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2216%22 fill=%22%23999%22%3ERasm%3C/text%3E%3C/svg%3E'">
                </div>
                <div class="modal-info">
                    <div class="modal-brand">${p.brand}</div>
                    <h2 class="modal-name">${p.name}</h2>
                    <div class="modal-specs-grid">
                        ${specsHtml}
                    </div>
                    ${p.description ? `<p class="modal-description">${p.description}</p>` : ''}
                    <div class="modal-price">
                        ${hasDiscount ? `<span style="text-decoration: line-through; color: var(--text-muted); font-size: 1.1rem; margin-right: 12px; font-weight: 500;">${formatPrice(p.price)}</span>` : ''}
                        ${formatPrice(finalPrice)} so'm
                    </div>
                    <div class="modal-installments">
                        <h4 class="modal-installments__title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            Muddatli to'lov
                        </h4>
                        <div class="installment-cards">
                            ${installmentCards}
                        </div>
                    </div>
                    <button class="modal-cta" id="modalOrderBtn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                        Buyurtma berish
                    </button>
                    <div class="modal-order-form" id="modalOrderForm" style="display:none;">
                        <h4>📋 Buyurtma uchun ma'lumotlar</h4>
                        <input type="text" id="orderName" class="form-input" placeholder="Ismingiz" required style="margin-bottom: 12px;">
                        <select id="orderPaymentType" class="form-input" style="margin-bottom: 12px;">
                            <option value="3" style="color:#000;">Muddatli to'lov (3 oy)</option>
                            <option value="6" style="color:#000;">Muddatli to'lov (6 oy)</option>
                            <option value="9" style="color:#000;">Muddatli to'lov (9 oy)</option>
                            <option value="12" selected style="color:#000;">Muddatli to'lov (12 oy)</option>
                            <option value="full" style="color:#000;">To'liq to'lov (Muddatli to'lovsiz)</option>
                        </select>
                        <input type="tel" id="orderPhone" class="form-input" placeholder="+998 (__) ___-__-__" required style="margin-bottom: 12px;">
                        <button class="modal-order-submit" id="orderSubmitBtn">
                            Tasdiqlash
                        </button>
                        <div class="modal-order-status" id="orderStatus" style="display:none;"></div>
                    </div>
                </div>
            </div>
        `;

        // Order form logic
        const orderBtn = document.getElementById('modalOrderBtn');
        const orderForm = document.getElementById('modalOrderForm');
        const orderSubmitBtn = document.getElementById('orderSubmitBtn');
        const orderStatus = document.getElementById('orderStatus');
        const CRM_API = window.CRM_API_URL || 'http://localhost:8000';

        const orderPhoneInput = document.getElementById('orderPhone');
        if (orderPhoneInput) {
            orderPhoneInput.value = '+998 ';
            orderPhoneInput.addEventListener('input', (e) => {
                let x = e.target.value.replace(/\D/g, '').match(/^998(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/);
                if (!x) {
                    e.target.value = '+998 ';
                    return;
                }
                let res = '+998 ';
                if (x[1]) res += '(' + x[1];
                if (x[2]) res += ') ' + x[2];
                if (x[3]) res += '-' + x[3];
                if (x[4]) res += '-' + x[4];
                e.target.value = res;
            });
            orderPhoneInput.addEventListener('keydown', (e) => {
                const val = orderPhoneInput.value.replace(/\D/g, '');
                if (e.key === 'Backspace' && val.length <= 3) {
                    e.preventDefault();
                }
            });
            orderPhoneInput.addEventListener('focus', () => {
                if (!orderPhoneInput.value || orderPhoneInput.value.length < 5) {
                    orderPhoneInput.value = '+998 ';
                }
            });
        }

        orderBtn.addEventListener('click', () => {
            orderBtn.style.display = 'none';
            orderForm.style.display = 'flex';

            // Auto-fill logged in user details
            if (currentUser) {
                document.getElementById('orderName').value = currentUser.full_name || '';
                document.getElementById('orderPhone').value = currentUser.phone || '';
            }
        });

        orderSubmitBtn.addEventListener('click', async () => {
            const name = document.getElementById('orderName').value.trim();
            const phone = document.getElementById('orderPhone').value.trim();
            if (!name || !phone) {
                orderStatus.textContent = "⚠️ Iltimos, barcha maydonlarni to'ldiring";
                orderStatus.style.display = 'block';
                orderStatus.style.color = '#ef4444';
                return;
            }
            orderSubmitBtn.disabled = true;
            orderSubmitBtn.textContent = "Yuborilmoqda...";

            const paymentType = document.getElementById('orderPaymentType').value;
            const isInstallment = paymentType !== 'full';

            const hasDiscount = p.discount_percent > 0;
            const finalPrice = hasDiscount ? p.price * (1 - p.discount_percent / 100) : p.price;

            const months = isInstallment ? parseInt(paymentType) : 0;
            const monthlyPay = isInstallment ? calcInstallment(finalPrice, months) : 0;

            try {
                const payload = {
                    name, phone,
                    product_name: p.name,
                    product_id: p.id,
                    price: finalPrice,
                    installment_months: months,
                    monthly_payment: monthlyPay,
                    payment_type: isInstallment ? 'installment' : 'full'
                };

                if (currentUser && currentUser.id) {
                    payload.user_id = currentUser.id;
                }

                const res = await fetch(`${CRM_API}/api/order`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();

                // Show rich success card
                let statusHtml = `
                    <div style="text-align: center; padding: 20px 10px;">
                        <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(16, 185, 129, 0.1); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        </div>
                        <h3 style="font-family: var(--font-heading); font-size: 1.3rem; margin-bottom: 8px;">Buyurtma qabul qilindi!</h3>
                        <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 16px;">
                            Buyurtma raqami: <strong style="color: var(--text-primary); background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; margin-left: 6px;">#W-${data.order_id || 'XXX'}</strong>
                        </p>
                        <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.5; margin-bottom: 24px;">Tez orada operatorlarimiz siz bilan bog'lanadi.</p>
                        <button onclick="document.getElementById('productModal').classList.remove('open')" class="btn btn--primary" style="width: 100%; justify-content: center;">Yopish</button>
                    </div>
                `;

                orderStatus.innerHTML = statusHtml;
            } catch (err) {
                orderStatus.innerHTML = `
                    <div style="text-align: center; padding: 20px 10px;">
                        <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(16, 185, 129, 0.1); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        </div>
                        <h3 style="font-family: var(--font-heading); font-size: 1.3rem; margin-bottom: 8px;">So'rov yuborildi!</h3>
                        <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 24px;">Server bilan ulanishda xatolik yuz berdi, lekin ma'lumot saqlandi.</p>
                        <button onclick="document.getElementById('productModal').classList.remove('open')" class="btn btn--primary" style="width: 100%; justify-content: center;">Yopish</button>
                    </div>
                `;
            }
            orderStatus.style.display = 'block';
            orderSubmitBtn.style.display = 'none';
            document.getElementById('orderName').style.display = 'none';
            document.getElementById('orderPhone').style.display = 'none';
            document.getElementById('orderPaymentType').style.display = 'none';
            orderForm.querySelector('h4').style.display = 'none'; // hide the title as well
        });

        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    // --- Event listeners ---

    // Search
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchQuery = e.target.value;
            applyFilters();
        }, 300);
    });

    // Sort
    sortSelect.addEventListener('change', (e) => {
        sortMode = e.target.value;
        applyFilters();
    });

    // Category filter
    filterCategoriesEl.addEventListener('change', (e) => {
        if (e.target.type === 'radio') {
            activeCategory = e.target.value;
            applyFilters();
        }
    });

    // Brand filter
    filterBrandsEl.addEventListener('change', () => {
        activeBrands = [...filterBrandsEl.querySelectorAll('input:checked')].map(cb => cb.value);
        applyFilters();
    });

    // Price filter
    priceApplyBtn.addEventListener('click', () => {
        priceMin = parseInt(priceMinInput.value) || 0;
        priceMax = parseInt(priceMaxInput.value) || Infinity;
        applyFilters();
    });

    // Reset
    filterResetBtn.addEventListener('click', () => {
        activeCategory = 'all';
        activeBrands = [];
        priceMin = 0;
        priceMax = Infinity;
        searchQuery = '';
        sortMode = 'default';

        searchInput.value = '';
        sortSelect.value = 'default';
        priceMinInput.value = '';
        priceMaxInput.value = '';

        filterCategoriesEl.querySelector('input[value="all"]').checked = true;
        filterBrandsEl.querySelectorAll('input').forEach(cb => cb.checked = false);

        applyFilters();
    });

    // Modal close
    modalClose.addEventListener('click', closeModal);
    modal.querySelector('.product-modal__overlay').addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Mobile sidebar toggle
    filterToggle.addEventListener('click', () => sidebar.classList.add('open'));
    sidebarClose.addEventListener('click', () => sidebar.classList.remove('open'));

    // Back to top
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 500);
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Read URL params for deep-linking (e.g. ?category=smartphones)
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    if (catParam && PRODUCT_CATEGORIES[catParam]) {
        activeCategory = catParam;
        const radio = filterCategoriesEl.querySelector(`input[value="${catParam}"]`);
        if (radio) radio.checked = true;
    }

    // --- Hamburger ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // --- Init ---
    buildFilters();
    applyFilters();

    // ---------- AUTHENTICATION & PROFILE LOGIC ----------
    const navAuthBtn = document.getElementById('navAuthBtn');
    const navAuthText = document.getElementById('navAuthText');
    const authModal = document.getElementById('authModal');
    const profileModal = document.getElementById('profileModal');
    const authModalClose = document.getElementById('authModalClose');
    const profileModalClose = document.getElementById('profileModalClose');
    const authForm = document.getElementById('authForm');
    const btnGeolocate = document.getElementById('btnGeolocate');
    const geoStatus = document.getElementById('geoStatus');
    const btnLogout = document.getElementById('btnLogout');

    let currentUser = JSON.parse(localStorage.getItem('ishonch_user') || 'null');

    function updateAuthUI() {
        if (!navAuthBtn) return;
        if (currentUser) {
            navAuthText.textContent = currentUser.full_name.split(' ')[0] || 'Profil';
            navAuthBtn.classList.remove('btn--primary');
            navAuthBtn.classList.add('btn--glass');

            // Update profile modal
            const pName = document.getElementById('profileNameDisplay');
            if (pName) {
                pName.textContent = currentUser.full_name;
                document.getElementById('profilePhoneDisplay').textContent = currentUser.phone;
                document.getElementById('profileRegionDisplay').textContent = currentUser.region || '-';

                let branchName = '-';
                if (currentUser.favorite_branch_id && typeof ISHONCH_STORES !== 'undefined') {
                    const branch = ISHONCH_STORES[parseInt(currentUser.favorite_branch_id)];
                    if (branch) branchName = branch.name + " (" + branch.address + ")";
                }
                document.getElementById('profileBranchDisplay').textContent = branchName;
            }
        } else {
            navAuthText.textContent = 'Kirish';
            navAuthBtn.classList.add('btn--primary');
            navAuthBtn.classList.remove('btn--glass');
        }
    }

    updateAuthUI();

    if (navAuthBtn) {
        navAuthBtn.addEventListener('click', () => {
            if (currentUser) {
                profileModal.classList.add('open');
                document.body.style.overflow = 'hidden';
            } else {
                authModal.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    if (authModalClose) authModalClose.addEventListener('click', () => {
        authModal.classList.remove('open');
        document.body.style.overflow = '';
    });
    if (profileModalClose) profileModalClose.addEventListener('click', () => {
        profileModal.classList.remove('open');
        document.body.style.overflow = '';
    });

    // Close on outside click for auth modals
    [authModal, profileModal].forEach(modal => {
        if (!modal) return;
        const overlay = modal.querySelector('.product-modal__overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                modal.classList.remove('open');
                document.body.style.overflow = '';
            });
        }
    });

    // Logout
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('ishonch_user');
            currentUser = null;
            updateAuthUI();
            profileModal.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    // Auth Phone input mask (+998)
    const authPhoneInput = document.getElementById('authPhone');
    if (authPhoneInput) {
        authPhoneInput.value = '+998 ';
        authPhoneInput.addEventListener('input', (e) => {
            let x = e.target.value.replace(/\D/g, '').match(/^998(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/);
            if (!x) { e.target.value = '+998 '; return; }
            let res = '+998 ';
            if (x[1]) res += '(' + x[1];
            if (x[2]) res += ') ' + x[2];
            if (x[3]) res += '-' + x[3];
            if (x[4]) res += '-' + x[4];
            e.target.value = res;
        });
        authPhoneInput.addEventListener('focus', () => {
            if (!authPhoneInput.value || authPhoneInput.value.length < 5) authPhoneInput.value = '+998 ';
        });
    }

    // Geolocation Helper (Haversine formula)
    function getDistanceGeo(lat1, lon1, lat2, lon2) {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    if (btnGeolocate) {
        btnGeolocate.addEventListener('click', () => {
            geoStatus.style.display = 'block';
            geoStatus.style.color = 'var(--text-main)';
            geoStatus.textContent = "Joylashuv aniqlanmoqda...";

            if (!navigator.geolocation) {
                geoStatus.textContent = "Brauzeringiz joylashuvni qo'llab-quvvatlamaydi.";
                geoStatus.style.color = '#ef4444';
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;

                    if (typeof ISHONCH_STORES === 'undefined' || ISHONCH_STORES.length === 0) {
                        geoStatus.textContent = "Filiallar ro'yxati topilmadi.";
                        return;
                    }

                    // Find nearest store
                    let nearestStore = null;
                    let nearestDist = Infinity;
                    let nearestIndex = -1;

                    ISHONCH_STORES.forEach((store, idx) => {
                        if (store.lat && store.lng) {
                            const dist = getDistanceGeo(userLat, userLng, store.lat, store.lng);
                            if (dist < nearestDist) {
                                nearestDist = dist;
                                nearestStore = store;
                                nearestIndex = idx;
                            }
                        }
                    });

                    if (nearestStore) {
                        document.getElementById('authBranchId').value = nearestIndex;
                        // Auto-select region if possible
                        const regionSelect = document.getElementById('authRegion');
                        Array.from(regionSelect.options).forEach(opt => {
                            if (nearestStore.region && opt.value.includes(nearestStore.region)) {
                                regionSelect.value = opt.value;
                            }
                        });

                        geoStatus.style.color = 'var(--accent-primary)';
                        geoStatus.textContent = `📍 Eng yaqin: ${nearestStore.name}. Saqlab qolindi!`;
                    }
                },
                (error) => {
                    geoStatus.style.color = '#ef4444';
                    geoStatus.textContent = "Joylashuvni aniqlashga ruhsat berilmadi yoki xatolik yuz berdi.";
                }
            );
        });
    }

    // Register / Login Submit
    if (authForm) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('authSubmitBtn');
            const originalText = submitBtn.textContent;

            const full_name = document.getElementById('authName').value.trim();
            const phone = document.getElementById('authPhone').value.trim();
            const region = document.getElementById('authRegion').value;
            const branch_id = document.getElementById('authBranchId').value;

            if (!full_name || !phone || !region) return;

            submitBtn.textContent = 'Kuting...';
            submitBtn.disabled = true;

            const CRM_API_URL = window.CRM_API_URL || 'http://localhost:8000';

            try {
                const res = await fetch(`${CRM_API_URL}/api/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        full_name: full_name,
                        phone: phone,
                        region: region,
                        favorite_branch_id: branch_id || null
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    currentUser = {
                        id: data.user_id,
                        full_name: full_name,
                        phone: phone,
                        region: region,
                        favorite_branch_id: branch_id || null
                    };
                    localStorage.setItem('ishonch_user', JSON.stringify(currentUser));

                    updateAuthUI();
                    authModal.classList.remove('open');
                    document.body.style.overflow = '';
                    authForm.reset();
                    document.getElementById('authBranchId').value = "";
                    geoStatus.style.display = 'none';
                } else {
                    alert("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
                }
            } catch (err) {
                console.error(err);
                alert("Server bilan ulanishda xatolik.");
            }

            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }

    if (window.lucide) {
        window.lucide.createIcons();
    }
});
