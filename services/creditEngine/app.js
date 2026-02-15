/* ==========================================
   1. CREDIT ENGINE UI
   ========================================== */
function updateCreditUI(score) {
    const maxScore = 2000;
    const percentage = (score / maxScore) * 100;
    const scoreDisplay = document.querySelector('.credit-score-value');
    const progressBar = document.querySelector('.credit-progress-fill');
    const statusLabel = document.querySelector('#credit-status');

    if (scoreDisplay) scoreDisplay.innerHTML = `${score} <span style="font-size: 12px; opacity: 0.3;">/ ${maxScore}</span>`;
    if (progressBar) {
        progressBar.style.width = percentage + '%';
        progressBar.style.background = score >= 1200 ? '#FFFFFF' : '#0000FF'; 
    }
    if (statusLabel) {
        if (score < 500) statusLabel.innerText = "BUILDING";
        else if (score < 1200) statusLabel.innerText = "STABLE";
        else statusLabel.innerText = "ELITE";
    }
}

/* ==========================================
   2. ACTIVITY CENTER (RIGHT SIDEBAR)
   ========================================== */
const ActivityCenter = {
    notifications: [],
    currentFilter: 'all',
    init() {
        const panel = document.getElementById('right-panel');
        if (!panel) return;
        let touchStartX = 0;
        panel.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; });
        panel.addEventListener('touchend', e => {
            if (e.changedTouches[0].screenX > touchStartX + 80) this.closePanel();
        });
    },
    spawn(data) {
        const newNotif = { 
            id: Date.now(), 
            title: data.title, 
            message: data.message, 
            type: data.type || "system", 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        };
        this.notifications.unshift(newNotif);
        this.updateBadge();
        this.renderFeed();
        this.openPanel();
    },
    updateBadge() {
        const count = this.notifications.length;
        document.querySelectorAll('#nav-badge').forEach(badge => {
            badge.innerText = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    },
    renderFeed() {
        const feed = document.getElementById('activity-feed');
        if (!feed) return;
        const filtered = this.currentFilter === 'all' ? this.notifications : this.notifications.filter(n => n.type === this.currentFilter);
        feed.innerHTML = filtered.map(n => `
            <div class="notif-card" style="background:rgba(255,255,255,0.03); padding:15px; border-radius:12px; margin-bottom:12px; border-left: 2px solid #0000FF;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                    <span style="font-size:9px; color:#fff; font-weight:bold; text-transform:uppercase; opacity:0.6;">${n.type}</span>
                    <span style="font-size:10px; opacity:0.3;">${n.time}</span>
                </div>
                <h4 style="margin:0; font-size:14px; color:#fff;">${n.title}</h4>
                <p style="margin:5px 0 0 0; font-size:12px; opacity:0.5; line-height:1.4;">${n.message}</p>
            </div>
        `).join('');
    },
    openPanel() { 
        document.getElementById('right-panel').classList.add('active'); 
        document.getElementById('panel-overlay').classList.add('active'); 
    },
    closePanel() { 
        document.getElementById('right-panel').classList.remove('active'); 
        document.getElementById('panel-overlay').classList.remove('active'); 
    },
    togglePanel() { 
        const panel = document.getElementById('right-panel');
        panel.classList.contains('active') ? this.closePanel() : this.openPanel(); 
    }
};

/* ==========================================
   3. LOCATION & DYNAMIC ASSET ENGINE
   ========================================== */
const AppEngine = {
    userCity: "Abuja",
    lastScrollY: window.scrollY,

    init() {
        this.setupLocation();
        this.setupScrollLogic();
    },

    async setupLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => this.getCityFromCoords(pos.coords.latitude, pos.coords.longitude),
                () => this.getCityFromIP()
            );
        } else { this.getCityFromIP(); }
    },

    async getCityFromCoords(lat, lng) {
        try {
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
            const data = await res.json();
            this.applyLocation(data.city || data.locality);
        } catch(e) { this.getCityFromIP(); }
    },

    async getCityFromIP() {
        try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            this.applyLocation(data.city);
        } catch (e) { this.applyLocation("Abuja"); }
    },

    applyLocation(city) {
        if (!city) return;
        this.userCity = city;
        
        // Dynamic Label Updates
        document.querySelectorAll('.current-city-label').forEach(el => el.innerText = city);

        // UI ASSET SWAP (Small Cube/Landmark Asset)
        const asset = document.getElementById('dynamic-city-cube');
        if(asset) {
            const cityNameFormatted = city.toLowerCase().replace(/\s+/g, '-');
            const imgPath = `assets/landmarks/${cityNameFormatted}-cube.webp`; // Scaled down asset
            
            const tester = new Image();
            tester.src = imgPath;
            tester.onload = () => { asset.src = imgPath; };
            tester.onerror = () => { asset.src = 'assets/landmarks/default-cube.webp'; };
        }
    },

    setupScrollLogic() {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            const bottomNav = document.querySelector('.bottom-nav');
            
            // Hide/Show Bottom Nav on scroll
            if (currentScrollY > this.lastScrollY && currentScrollY > 60) {
                if (bottomNav) bottomNav.style.transform = "translateY(110%)";
            } else {
                if (bottomNav) bottomNav.style.transform = "translateY(0)";
            }
            this.lastScrollY = currentScrollY;
        }, { passive: true });
    }
};

/* ==========================================
   4. UTILITY & NAVIGATION
   ========================================== */
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if(sidebar) sidebar.classList.toggle('active');
}

function togglePrivacy() {
    const balance = document.getElementById('walletDisplay');
    if (!balance) return;
    balance.style.filter = (balance.style.filter === 'blur(15px)') ? 'blur(0px)' : 'blur(15px)';
}

function triggerExplore() {
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('explore-view').style.display = 'block';
    window.scrollTo(0, 0);
}

function goHome() {
    document.getElementById('explore-view').style.display = 'none';
    document.getElementById('home-view').style.display = 'block';
}

/* ==========================================
   5. DOM READY
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    ActivityCenter.init();
    AppEngine.init();

    // Notification Trigger
    const bell = document.getElementById('nav-bell-icon');
    if (bell) {
        bell.parentElement.onclick = (e) => {
            e.stopPropagation();
            ActivityCenter.togglePanel();
        };
    }
    
    // Overlay logic for all panels
    const overlay = document.getElementById('panel-overlay');
    if(overlay) {
        overlay.onclick = () => {
            ActivityCenter.closePanel();
            const sidebar = document.querySelector('.sidebar');
            if(sidebar) sidebar.classList.remove('active');
        };
    }
});