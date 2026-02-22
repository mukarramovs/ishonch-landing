/**
 * ISHONCH ADMIN PANEL LOGIC
 */

const CRM_API_URL = window.CRM_API_URL || 'http://localhost:8000';

const adminApp = {
    data: null,
    products: [],
    currentTab: 'products',

    async init() {
        this.checkAuth();
        this.loadLocalData();
        await this.loadProducts();
        this.bindEvents();
        this.render();
    },

    checkAuth() {
        const isAuth = sessionStorage.getItem('ishonch_admin_auth');
        if (isAuth) {
            document.getElementById('authModal').style.display = 'none';
            document.getElementById('adminPanel').style.display = 'block';
        }
    },

    loadLocalData() {
        const raw = localStorage.getItem('ishonch_app_data');
        this.data = raw ? JSON.parse(raw) : { banners: [], promotions: [] };
    },

    async loadProducts() {
        try {
            const res = await fetch(`${CRM_API_URL}/api/products`);
            if (res.ok) {
                this.products = await res.json();
            } else {
                console.error("Failed to load products");
                this.products = [];
            }
        } catch (e) {
            console.error("API error", e);
            this.products = [];
        }
    },

    saveLocalData() {
        localStorage.setItem('ishonch_app_data', JSON.stringify(this.data));
    },

    bindEvents() {
        // Login
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                const pass = document.getElementById('adminPass').value;
                if (pass === 'admin') {
                    sessionStorage.setItem('ishonch_admin_auth', 'true');
                    document.getElementById('authModal').style.display = 'none';
                    document.getElementById('adminPanel').style.display = 'block';
                    this.render();
                } else {
                    document.getElementById('loginError').style.display = 'block';
                }
            });
        }

        // Logout
        const lgOutBtn = document.getElementById('logoutBtn');
        if (lgOutBtn) {
            lgOutBtn.addEventListener('click', () => {
                sessionStorage.removeItem('ishonch_admin_auth');
                location.reload();
            });
        }

        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

                btn.classList.add('active');
                const tab = btn.dataset.tab;
                this.currentTab = tab;
                document.getElementById(`${tab}Tab`).classList.add('active');
            });
        });

        // Banners/Promos Form
        const editForm = document.getElementById('editForm');
        if (editForm) {
            editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSaveLocal();
            });
        }

        // Products Form
        const prodForm = document.getElementById('productForm');
        if (prodForm) {
            prodForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.saveProduct();
            });
        }

        // Bulk Discount Form
        const bulkDiscountForm = document.getElementById('bulkDiscountForm');
        if (bulkDiscountForm) {
            bulkDiscountForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.saveBulkDiscount();
            });
        }

        // Product Search
        const searchInput = document.getElementById('adminProductSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.renderProducts(e.target.value);
            });
        }

        // Product Image Preview
        const prodImage = document.getElementById('prodImage');
        const imgPreview = document.getElementById('prodImagePreview');
        const imgPlaceholder = document.getElementById('prodImagePlaceholder');
        if (prodImage && imgPreview) {
            prodImage.addEventListener('input', (e) => {
                if (e.target.value) {
                    imgPreview.src = e.target.value;
                    imgPreview.style.display = 'block';
                    imgPlaceholder.style.display = 'none';
                } else {
                    imgPreview.style.display = 'none';
                    imgPlaceholder.style.display = 'block';
                }
            });
        }
    },

    render() {
        this.renderBanners();
        this.renderPromos();
        this.renderProducts();
        if (window.lucide) {
            window.lucide.createIcons();
        }
    },

    // ==========================================
    // PRODUCTS LOGIC
    // ==========================================

    renderProducts(query = '') {
        const list = document.getElementById('productsList');
        if (!list) return;

        let filtered = this.products;
        if (query.trim() !== '') {
            const q = query.toLowerCase();
            filtered = this.products.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.brand.toLowerCase().includes(q) ||
                p.id.toString().includes(q)
            );
        }

        list.innerHTML = filtered.map(p => `
            <tr>
                <td style="padding: 0.5rem 1rem;">
                    <img src="${p.image}" style="width: 40px; height: 40px; object-fit: contain; background: white; padding: 2px; border-radius: 4px; border: 1px solid #eee;">
                </td>
                <td style="padding: 1rem; font-weight: 500; color: #6b7280;">#${p.id}</td>
                <td style="padding: 1rem;">
                    <div style="font-weight: 600;">${p.name} ${p.is_new ? '<span style="background:var(--accent-primary);color:white;padding:2px 6px;border-radius:4px;font-size:0.7rem;margin-left:4px;">Yangi</span>' : ''}</div>
                </td>
                <td style="padding: 1rem;">${p.brand} / <span style="color:#6b7280">${p.category}</span></td>
                <td style="padding: 1rem; font-weight: 600;">${new Intl.NumberFormat('uz-UZ').format(p.price)} so'm</td>
                <td style="padding: 1rem; text-align: right;">
                    <button class="btn btn--glass" style="padding: 6px 10px; font-size: 0.85rem;" onclick="adminApp.openProductModal('${p.id}')">Tahrirlash</button>
                    <button class="btn btn--glass" style="color: #ef4444; padding: 6px 10px; font-size: 0.85rem; margin-left: 4px;" onclick="adminApp.deleteProduct('${p.id}')">O'chirish</button>
                </td>
            </tr>
        `).join('');
    },

    openProductModal(id = null) {
        const modal = document.getElementById('productModal');
        const form = document.getElementById('productForm');
        const title = document.getElementById('productModalTitle');
        const dtBrand = document.getElementById('brandList');

        // Populate brand datalist
        const uBrands = [...new Set(this.products.map(p => p.brand))].sort();
        dtBrand.innerHTML = uBrands.map(b => `<option value="${b}">`).join('');

        modal.style.display = 'flex';

        if (id) {
            title.textContent = 'Mahsulotni Tahrirlash';
            const prod = this.products.find(p => p.id == id);
            document.getElementById('prodId').value = prod.id;
            document.getElementById('prodId').readOnly = true;
            document.getElementById('prodName').value = prod.name;
            document.getElementById('prodBrand').value = prod.brand;
            document.getElementById('prodCategory').value = prod.category;
            document.getElementById('prodPrice').value = prod.price;
            document.getElementById('prodOldPrice').value = prod.old_price || '';
            document.getElementById('prodDiscount').value = prod.discount_percent || 0;
            document.getElementById('prodImage').value = prod.image;
            document.getElementById('prodDesc').value = prod.description || '';
            document.getElementById('prodSpecs').value = prod.specs || '';
            document.getElementById('prodIsNew').checked = prod.is_new === 1;

            document.getElementById('prodImagePreview').src = prod.image;
            document.getElementById('prodImagePreview').style.display = 'block';
            document.getElementById('prodImagePlaceholder').style.display = 'none';
        } else {
            title.textContent = 'Yangi Mahsulot Qo\'shish';
            form.reset();
            document.getElementById('prodId').readOnly = false;
            document.getElementById('prodImagePreview').style.display = 'none';
            document.getElementById('prodImagePlaceholder').style.display = 'block';
        }
    },

    closeProductModal() {
        document.getElementById('productModal').style.display = 'none';
    },

    async saveProduct() {
        const submitBtn = document.querySelector('#productForm button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saqlanmoqda...';

        let prodId = document.getElementById('prodId').value.trim();
        if (!prodId) {
            // Auto generate ID if empty
            prodId = Date.now().toString().slice(-6);
        }

        const payload = {
            id: prodId,
            name: document.getElementById('prodName').value,
            brand: document.getElementById('prodBrand').value,
            category: document.getElementById('prodCategory').value,
            price: parseInt(document.getElementById('prodPrice').value),
            old_price: document.getElementById('prodOldPrice').value ? parseInt(document.getElementById('prodOldPrice').value) : null,
            image: document.getElementById('prodImage').value,
            description: document.getElementById('prodDesc').value,
            specs: document.getElementById('prodSpecs').value,
            is_new: document.getElementById('prodIsNew').checked ? 1 : 0,
            discount_percent: parseInt(document.getElementById('prodDiscount').value) || 0
        };

        const isExisting = this.products.some(p => p.id == prodId);
        const method = isExisting ? 'PUT' : 'POST';
        const url = isExisting ? `${CRM_API_URL}/api/products/${prodId}` : `${CRM_API_URL}/api/products`;

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                await this.loadProducts();
                this.renderProducts(document.getElementById('adminProductSearch').value);
                this.closeProductModal();
            } else {
                alert("Xatolik yuz berdi!");
            }
        } catch (e) {
            console.error(e);
            alert("Ulanish xatosi!");
        }

        submitBtn.disabled = false;
        submitBtn.textContent = 'Saqlash';
    },

    async deleteProduct(id) {
        if (!confirm('Ushbu mahsulotni haqiqatdan ham o\'chirmoqchimisiz?')) return;
        try {
            const res = await fetch(`${CRM_API_URL}/api/products/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                await this.loadProducts();
                this.renderProducts(document.getElementById('adminProductSearch').value);
            } else {
                alert("O'chirishda xatolik yuz berdi.");
            }
        } catch (e) {
            alert("Ulanishda xatolik.");
        }
    },

    openBulkDiscountModal() {
        const modal = document.getElementById('bulkDiscountModal');
        const form = document.getElementById('bulkDiscountForm');
        form.reset();

        const dtBrand = document.getElementById('brandList');
        if (dtBrand) {
            const uBrands = [...new Set(this.products.map(p => p.brand))].sort();
            dtBrand.innerHTML = uBrands.map(b => `<option value="${b}">`).join('');
        }

        modal.style.display = 'flex';
    },

    closeBulkDiscountModal() {
        document.getElementById('bulkDiscountModal').style.display = 'none';
    },

    async saveBulkDiscount() {
        const btn = document.querySelector('#bulkDiscountForm button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Saqlanmoqda...';

        const category = document.getElementById('bulkCategory').value;
        const brand = document.getElementById('bulkBrand').value.trim() || 'all';
        const discount_percent = parseInt(document.getElementById('bulkPercent').value) || 0;

        try {
            const res = await fetch(`${CRM_API_URL}/api/products/bulk-discount`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category, brand, discount_percent })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    alert(`${data.affected} ta mahsulotga chegirma qo'llanildi!`);
                    await this.loadProducts();
                    this.renderProducts(document.getElementById('adminProductSearch').value);
                    this.closeBulkDiscountModal();
                } else {
                    alert("Xatolik: " + data.error);
                }
            } else {
                alert("Serverda xatolik yuz berdi.");
            }
        } catch (err) {
            alert("Ulanishda xato!");
        }

        btn.disabled = false;
        btn.textContent = 'Saqlash';
    },

    // ==========================================
    // BANNERS & PROMOS LOGIC
    // ==========================================

    renderBanners() {
        const list = document.getElementById('bannersList');
        if (!list) return;
        list.innerHTML = this.data.banners.map(item => `
            <div class="admin-item glass-card">
                <span class="section-tag">${item.badge}</span>
                <h4>${item.title}</h4>
                <p>${item.subtitle}</p>
                <div class="admin-item__actions">
                    <button class="btn btn--glass" onclick="adminApp.openModal('banner', ${item.id})">Tahrirlash</button>
                    <button class="btn btn--glass" style="color: #ef4444" onclick="adminApp.deleteItem('banner', ${item.id})">O'chirish</button>
                </div>
            </div>
        `).join('');
    },

    renderPromos() {
        const list = document.getElementById('promotionsList');
        if (!list) return;
        list.innerHTML = this.data.promotions.map(item => `
            <div class="admin-item glass-card">
                <span class="section-tag">${item.badge}</span>
                <h4>${item.icon} ${item.title}</h4>
                <p>${item.desc}</p>
                <div class="admin-item__actions">
                    <button class="btn btn--glass" onclick="adminApp.openModal('promo', ${item.id})">Tahrirlash</button>
                    <button class="btn btn--glass" style="color: #ef4444" onclick="adminApp.deleteItem('promo', ${item.id})">O'chirish</button>
                </div>
            </div>
        `).join('');
    },

    openModal(type, id = null) {
        const modal = document.getElementById('editModal');
        const form = document.getElementById('editForm');
        modal.style.display = 'flex';

        document.getElementById('editType').value = type;
        document.getElementById('editId').value = id || '';
        document.getElementById('modalTitle').textContent = id ? 'Tahrirlash' : 'Yangi qo\'shish';

        document.getElementById('promoFields').style.display = type === 'promo' ? 'block' : 'none';
        document.getElementById('bannerFields').style.display = type === 'banner' ? 'block' : 'none';

        if (id) {
            const item = this.data[type === 'banner' ? 'banners' : 'promotions'].find(i => i.id == id);
            if (item) {
                document.getElementById('fieldBadge').value = item.badge || '';
                document.getElementById('fieldTitle').value = item.title || '';
                document.getElementById('fieldDesc').value = type === 'banner' ? (item.subtitle || '') : (item.desc || '');

                if (type === 'promo') {
                    document.getElementById('fieldIcon').value = item.icon || '';
                    document.getElementById('fieldPrice').value = item.price || '';
                } else {
                    document.getElementById('fieldCtaText').value = item.ctaText || '';
                    document.getElementById('fieldCtaLink').value = item.ctaLink || '';
                }
            }
        } else {
            form.reset();
        }
    },

    closeModal() {
        document.getElementById('editModal').style.display = 'none';
    },

    handleSaveLocal() {
        const type = document.getElementById('editType').value;
        const id = document.getElementById('editId').value;
        const key = type === 'banner' ? 'banners' : 'promotions';

        const newItem = {
            id: id ? parseInt(id) : Date.now(),
            badge: document.getElementById('fieldBadge').value,
            title: document.getElementById('fieldTitle').value,
        };

        if (type === 'banner') {
            newItem.subtitle = document.getElementById('fieldDesc').value;
            newItem.ctaText = document.getElementById('fieldCtaText').value;
            newItem.ctaLink = document.getElementById('fieldCtaLink').value;
            newItem.image = "";
        } else {
            newItem.desc = document.getElementById('fieldDesc').value;
            newItem.icon = document.getElementById('fieldIcon').value;
            newItem.price = document.getElementById('fieldPrice').value;
            newItem.link = "#";
        }

        if (id) {
            const index = this.data[key].findIndex(i => i.id == id);
            this.data[key][index] = newItem;
        } else {
            this.data[key].push(newItem);
        }

        this.saveLocalData();
        this.render();
        this.closeModal();
    },

    deleteItem(type, id) {
        if (!confirm('Haqiqatdan ham o\'chirmoqchimisiz?')) return;
        const key = type === 'banner' ? 'banners' : 'promotions';
        this.data[key] = this.data[key].filter(i => i.id != id);
        this.saveLocalData();
        this.render();
    }
};

adminApp.init();
