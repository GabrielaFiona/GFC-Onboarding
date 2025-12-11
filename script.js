// --- STATE MANAGEMENT ---
const state = {
    // package: { id, name, price, includedPages, brandKitBundlePrice, extraPageCost }
    package: null,
    brandKit: false, // Boolean
    pages: [],       // Array of page name strings
    addons: []       // Array of { id, name, price }
};

const BASE_BRAND_KIT_PRICE = 500; // Standalone brand kit price

// --- STATE PERSISTENCE (localStorage) ---
function saveState() {
    try {
        const stateJSON = JSON.stringify(state);
        localStorage.setItem('onboardingState', stateJSON);
    } catch (e) {
        console.error('Error saving state:', e);
    }
}

function loadState() {
    try {
        const stateJSON = localStorage.getItem('onboardingState');
        if (!stateJSON) return;
        const loaded = JSON.parse(stateJSON);
        Object.assign(state, loaded);
    } catch (e) {
        console.error('Error loading state:', e);
    }
}

// --- NAVIGATION ---
function nextStep(stepNumber) {
    saveState();
    if (stepNumber >= 1 && stepNumber <= 4) {
        window.location.href = `step${stepNumber}.html`;
    } else {
        console.error('Invalid step number:', stepNumber);
    }
}

// --- PACKAGE SELECTION ---
function selectPackage(id, name, price, includedPages, brandKitBundlePrice, extraPageCost, element) {
    // 1. Visual selection
    document.querySelectorAll('.package-card').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');

    // 2. Update state with the chosen package
    state.package = {
        id,
        name,
        price,
        includedPages,
        brandKitBundlePrice,
        extraPageCost // package-specific extra page cost
    };

    // 3. Update UI text (included pages + extra-page rate), if elements exist
    const includedPagesEl = document.getElementById('included-pages-count');
    if (includedPagesEl) includedPagesEl.innerText = includedPages;

    const extraPageCostEl = document.getElementById('extra-page-unit-cost');
    if (extraPageCostEl) extraPageCostEl.innerText = extraPageCost;

    // 4. Reveal the addons / sitemap section (but do NOT scroll)
    const addonsSection = document.getElementById('addons-section');
    if (addonsSection) addonsSection.classList.remove('hidden');

    // 5. Recalculate totals, but leave the widget collapsed unless you open it
    calculateTotal();

    // 6. Optionally persist immediately
    saveState();
    updateBrandKitDisplay();
}

// --- BRAND KIT ---
function toggleBrandKit(element) {
    state.brandKit = !state.brandKit;
    if (element) {
        element.classList.toggle('selected', state.brandKit);
    }
    updateBrandKitDisplay();
    calculateTotal();
    saveState();
}

function updateBrandKitDisplay() {
    const bar = document.getElementById('brand-kit-bar');
    if (!bar) return;

    const ogPriceEl = bar.querySelector('.og-price');
    const discountLabelEl = bar.querySelector('.discount-label');
    const finalPriceEl = bar.querySelector('.final-price');

    if (!finalPriceEl) return;

    if (state.brandKit && state.package && state.package.brandKitBundlePrice) {
        const bundled = state.package.brandKitBundlePrice;
        if (ogPriceEl) {
            ogPriceEl.textContent = `$${BASE_BRAND_KIT_PRICE.toLocaleString()}`;
            ogPriceEl.style.display = 'inline';
        }
        if (discountLabelEl) {
            discountLabelEl.style.display = 'block';
        }
        finalPriceEl.textContent = `$${bundled.toLocaleString()}`;
    } else {
        if (ogPriceEl) ogPriceEl.style.display = 'none';
        if (discountLabelEl) discountLabelEl.style.display = 'none';
        finalPriceEl.textContent = `$${BASE_BRAND_KIT_PRICE.toLocaleString()}`;
    }
}

// --- PAGES ---
function addPage() {
    const input = document.getElementById('newPageName');
    if (!input) return;
    const name = input.value.trim();
    if (!name) return;

    state.pages.push(name);
    input.value = '';
    renderPageList();
    calculateTotal();
    saveState();
}

function removePage(index) {
    if (index < 0 || index >= state.pages.length) return;
    state.pages.splice(index, 1);
    renderPageList();
    calculateTotal();
    saveState();
}

function handleEnter(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        addPage();
    }
}

function renderPageList() {
    const list = document.getElementById('page-list');
    if (!list) return;

    list.innerHTML = '';
    state.pages.forEach((page, index) => {
        const div = document.createElement('div');
        div.className = 'page-item';
        div.innerHTML = `
            <span>${page}</span>
            <span class="remove-page" onclick="removePage(${index})">&times;</span>
        `;
        list.appendChild(div);
    });

    const countEl = document.getElementById('total-page-count');
    if (countEl) countEl.textContent = state.pages.length;
}

// --- ADDONS ---
function toggleAddon(id, name, price, element) {
    if (element) {
        element.classList.toggle('selected');
    }
    const existingIndex = state.addons.findIndex(a => a.id === id);
    if (existingIndex === -1) {
        state.addons.push({ id, name, price });
    } else {
        state.addons.splice(existingIndex, 1);
    }
    calculateTotal();
    saveState();
}

// --- INVOICE CALCULATION ---
function calculateTotal() {
    const fwItems = document.getElementById('fw-items');
    if (!fwItems) return;

    let html = '';
    let total = 0;
    let extraCost = 0;

    // Package
    if (state.package) {
        html += `<div class="fw-item"><span>${state.package.name}</span><span>$${state.package.price.toLocaleString()}</span></div>`;
        total += state.package.price;
    }

    // Brand Kit
    if (state.brandKit) {
        let kitPrice = BASE_BRAND_KIT_PRICE;
        let label = 'Brand Kit';
        if (state.package && state.package.brandKitBundlePrice) {
            kitPrice = state.package.brandKitBundlePrice;
            label += ' (Bundled)';
        }
        html += `<div class="fw-item"><span>+ ${label}</span><span>$${kitPrice.toLocaleString()}</span></div>`;
        total += kitPrice;
    }

    // Extra pages
    if (state.package) {
        const included = Number(state.package.includedPages || 0);
        const pageRate = Number(state.package.extraPageCost || 0);
        const extraPages = Math.max(0, state.pages.length - included);

        if (extraPages > 0 && pageRate > 0) {
            extraCost = extraPages * pageRate;
            html += `<div class="fw-item"><span>Extra Pages (${extraPages} × $${pageRate})</span><span>$${extraCost.toLocaleString()}</span></div>`;
            total += extraCost;
        }

        const extraTag = document.getElementById('extra-page-cost');
        if (extraTag) {
            if (extraCost > 0) {
                extraTag.style.display = 'inline';
                extraTag.textContent = `+ Extra Cost: $${extraCost.toLocaleString()}`;
            } else {
                extraTag.style.display = 'none';
            }
        }
    }

    // Addons
    state.addons.forEach(addon => {
        html += `<div class="fw-item"><span>+ ${addon.name}</span><span>$${addon.price.toLocaleString()}</span></div>`;
        total += addon.price;
    });

    if (!html) {
        html = '<p class="empty-state">Select a package to start...</p>';
    }

    fwItems.innerHTML = html;

    // Totals
    const headerTotalEl = document.getElementById('fw-header-total');
    if (headerTotalEl) headerTotalEl.textContent = `$${total.toLocaleString()}`;

    const fullTotalEl = document.getElementById('fw-full-total');
    if (fullTotalEl) fullTotalEl.textContent = `$${total.toLocaleString()}`;

    const depositEl = document.getElementById('fw-deposit');
    if (depositEl) depositEl.textContent = `$${(total / 2).toLocaleString()}`;
}

// --- WIDGET ---
function toggleWidget() {
    const widget = document.getElementById('floating-widget');
    if (!widget) return;
    widget.classList.toggle('collapsed');
}

// Expose globals
window.state = state;
window.BASE_BRAND_KIT_PRICE = BASE_BRAND_KIT_PRICE;
window.saveState = saveState;
window.loadState = loadState;
window.nextStep = nextStep;
window.selectPackage = selectPackage;
window.toggleBrandKit = toggleBrandKit;
window.addPage = addPage;
window.removePage = removePage;
window.handleEnter = handleEnter;
window.toggleAddon = toggleAddon;
window.calculateTotal = calculateTotal;
window.updateBrandKitDisplay = updateBrandKitDisplay;
window.renderPageList = renderPageList;
window.toggleWidget = toggleWidget;
