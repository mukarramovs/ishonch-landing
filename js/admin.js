/**
 * ISHONCH ADMIN PANEL LOGIC
 */

const adminApp = {
    data: null,
    currentTab: 'banners',

    init() {
        this.checkAuth();
        this.loadData();
        this.bindEvents();
    },

    checkAuth() {
        const isAuth = sessionStorage.getItem('ishonch_admin_auth');
        if (isAuth) {
            document.getElementById('authModal').style.display = 'none';
            document.getElementById('adminPanel').style.display = 'block';
            this.render();
        }
    },

    loadData() {
        const raw = localStorage.getItem('ishonch_app_data');
        this.data = raw ? JSON.parse(raw) : { banners: [], promotions: [] };
    },

    saveData() {
        localStorage.setItem('ishonch_app_data', JSON.stringify(this.data));
    },

    bindEvents() {
        // Login
        document.getElementById('loginBtn').addEventListener('click', () => {
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

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            sessionStorage.removeItem('ishonch_admin_auth');
            location.reload();
        });

        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

                btn.classList.add('active');
                const tab = btn.dataset.tab;
                document.getElementById(`${tab}Tab`).classList.add('active');
            });
        });

        // Form
        document.getElementById('editForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSave();
        });
    },

    render() {
        this.renderBanners();
        this.renderPromos();
        if (window.lucide) {
            window.lucide.createIcons();
        }
    },

    renderBanners() {
        const list = document.getElementById('bannersList');
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

        // Toggle fields
        document.getElementById('promoFields').style.display = type === 'promo' ? 'block' : 'none';
        document.getElementById('bannerFields').style.display = type === 'banner' ? 'block' : 'none';

        if (id) {
            const item = this.data[type === 'banner' ? 'banners' : 'promotions'].find(i => i.id == id);
            document.getElementById('fieldBadge').value = item.badge;
            document.getElementById('fieldTitle').value = item.title;
            document.getElementById('fieldDesc').value = type === 'banner' ? item.subtitle : item.desc;

            if (type === 'promo') {
                document.getElementById('fieldIcon').value = item.icon;
                document.getElementById('fieldPrice').value = item.price;
            } else {
                document.getElementById('fieldCtaText').value = item.ctaText;
                document.getElementById('fieldCtaLink').value = item.ctaLink;
            }
        } else {
            form.reset();
        }
    },

    closeModal() {
        document.getElementById('editModal').style.display = 'none';
    },

    handleSave() {
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

        this.saveData();
        this.render();
        this.closeModal();
    },

    deleteItem(type, id) {
        if (!confirm('Haqiqatdan ham o\'chirmoqchimisiz?')) return;
        const key = type === 'banner' ? 'banners' : 'promotions';
        this.data[key] = this.data[key].filter(i => i.id != id);
        this.saveData();
        this.render();
    }
};

adminApp.init();
