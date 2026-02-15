const eClearPillars = [
    { id: 'Accommodations', name: 'Accommodations', icon: 'Accommodations.webp', isNew: false },
    { id: 'Taxi', name: 'Taxi', icon: 'Taxi.webp', isNew: false },
    { id: 'Food', name: 'Food', icon: 'Food.webp', isNew: false },
    { id: 'Logistics', name: 'Logistics', icon: 'Logistics.webp', isNew: false },
    { id: 'Events', name: 'Events', icon: 'Events.webp', isNew: true }, 
    { id: 'Rent-a-Car', name: 'Rent a Car', icon: 'Rent-a-Car.webp', isNew: false },
    { id: 'Pro-Services', name: 'Pro Services', icon: 'Pros.webp', isNew: true }
];

function generatePillars() {
    const scrollContainer = document.querySelector('.pillar-scroll');
    if (!scrollContainer) return;

    scrollContainer.innerHTML = '';

    eClearPillars.forEach(pillar => {
        const pillarHTML = `
            <div class="pillar-item" onclick="selectPill('${pillar.id}', this)">
                <div class="icon-box">
                    <img src="assets/icons/${pillar.icon}" alt="${pillar.name}">
                    ${pillar.isNew ? '<span class="new-badge">NEW</span>' : ''}
                </div>
                <span class="pillar-label">${pillar.name}</span>
                <div class="active-indicator"></div>
            </div>
        `;
        scrollContainer.innerHTML += pillarHTML;
    });
}

document.addEventListener('DOMContentLoaded', generatePillars);

function updateWalletUI() {
    const wallDisp = document.getElementById('walletDisplay');
    const scoreDisp = document.getElementById('scoreDisplay');
    const tag = document.getElementById('statusTag');

    // Check if eClearDB exists before trying to read it
    if (typeof eClearDB !== 'undefined' && eClearDB.user) {
        if(wallDisp) wallDisp.innerText = `₦${eClearDB.user.walletBalance}`;
        if(scoreDisp) scoreDisp.innerText = eClearDB.user.creditScore;
        if(tag) {
            tag.innerText = eClearDB.user.creditStatus;
            tag.style.display = 'inline-block';
        }
    }
}

function showHomeFeed() {
    const contentArea = document.getElementById('contentArea');
    if (!contentArea) return;

    // Reset active states
    document.querySelectorAll('.pillar-item, .nav-item').forEach(item => item.classList.remove('active'));
    
    const homeNav = document.querySelector('.nav-item:first-child');
    if(homeNav) homeNav.classList.add('active');

    contentArea.innerHTML = '<h3 style="font-size:14px; margin: 20px 0; opacity:0.5;">Discovery Feed</h3>';
    
    if (typeof eClearDB !== 'undefined' && eClearDB.offerings) {
        eClearDB.offerings.forEach(item => { 
            if (typeof createCardHTML === 'function') {
                contentArea.innerHTML += createCardHTML(item); 
            }
        });
    }
}

function selectPill(id, element) {
    // 1. Visual Feedback
    const allItems = document.querySelectorAll('.pillar-item, .nav-item');
    allItems.forEach(item => item.classList.remove('active'));
    if(element) element.classList.add('active');

    // 2. Smooth Scroll
    if (element && element.classList.contains('pillar-item')) {
        element.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }

    console.log("eClear Navigation to:", id);

    // 3. Navigation Switch (Safer than a Map for some browsers)
    switch(id) {
        case 'Events': window.location.href = 'events.html'; break;
        case 'Taxi': window.location.href = 'taxi.html'; break;
        case 'Food': window.location.href = 'food.html'; break;
        case 'Accommodations': window.location.href = 'accommodations.html'; break;
        case 'Logistics': window.location.href = 'logistics.html'; break;
        case 'Rent-a-Car': window.location.href = 'mobility.html'; break;
        case 'Pro-Services': window.location.href = 'pro-services.html'; break;
        default: console.log("No page defined for:", id);
    }
}

// Global initialization
window.onload = () => {
    updateWalletUI();
    showHomeFeed();
};

function toggleMenu() { document.body.classList.toggle('menu-open'); }
function closeMenu() { document.body.classList.remove('menu-open'); }
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });