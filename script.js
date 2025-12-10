// --- STATE MANAGEMENT ---
const state = {
    package: null,   // { id, name, price, includedPages }
    pages: [],       // Array of strings (Page Names)
    addons: []       // Array of { id, name, price }
};

const EXTRA_PAGE_COST = 150; 

// --- PACKAGE SELECTION ---
function selectPackage(id, price, includedPages, element) {
    // 1. Visual selection
    document.querySelectorAll('.package-card').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');

    // 2. Update State
    const title = element.querySelector('.package-title').innerText;
    state.package = { id, name: title, price, includedPages };

    // 3. Update UI text
    document.getElementById('included-pages-count').innerText = includedPages;
    document.getElementById('addons-section').classList.remove('hidden');

    // 4. Smooth scroll to addons
    setTimeout(() => {
        document.getElementById('addons-section').scrollIntoView({ behavior: 'smooth' });
    }, 200);

    // 5. Open invoice if closed
    const widget = document.getElementById('floating-widget');
    if(widget.classList.contains('collapsed')) {
        widget.classList.remove('collapsed');
    }

    calculateTotal();
}

// --- PAGE BUILDER LOGIC ---
function addPage() {
    const input = document.getElementById('newPageName');
    const name = input.value.trim();

    if (name) {
        state.pages.push(name);
        input.value = ''; // Clear input
        renderPageList();
        calculateTotal();
    }
}

function removePage(index) {
    state.pages.splice(index, 1);
    renderPageList();
    calculateTotal();
}

function handleEnter(e) {
    if (e.key === 'Enter') addPage();
}

function renderPageList() {
    const list = document.getElementById('page-list');
    list.innerHTML = ''; // Clear current list

    state.pages.forEach((page, index) => {
        const div = document.createElement('div');
        div.className = 'page-item';
        div.innerHTML = `
            ${page}
            <span class="remove-page" onclick="removePage(${index})">&times;</span>
        `;
        list.appendChild(div);
    });

    document.getElementById('total-page-count').innerText = state.pages.length;
}

// --- ADDONS LOGIC ---
function toggleAddon(id, price, element) {
    element.classList.toggle('selected');
    const name = element.querySelector('.addon-name').innerText;

    if (element.classList.contains('selected')) {
        state.addons.push({ id, name, price });
    } else {
        state.addons = state.addons.filter(a => a.id !== id);
    }
    calculateTotal();
}

// --- INVOICE CALCULATION ---
function calculateTotal() {
    const fwItems = document.getElementById('fw-items');
    let html = '';
    let total = 0;

    // 1. Base Package
    if (state.package) {
        html += `<div class="fw-item"><span>${state.package.name}</span><span>$${state.package.price.toLocaleString()}</span></div>`;
        total += state.package.price;
    }

    // 2. Extra Pages Calculation
    if (state.package) {
        const extraPages = Math.max(0, state.pages.length - state.package.includedPages);
        if (extraPages > 0) {
            const extraCost = extraPages * EXTRA_PAGE_COST;
            html += `<div class="fw-item"><span>Extra Pages (${extraPages} x $150)</span><span>$${extraCost.toLocaleString()}</span></div>`;
            total += extraCost;
            
            // Update UI tag
            const tag = document.getElementById('extra-page-cost');
            tag.style.display = 'inline';
            tag.innerText = `+ Extra Cost: $${extraCost}`;
        } else {
            // Check if tag exists before trying to style it
             const tag = document.getElementById('extra-page-cost');
             if (tag) {
                tag.style.display = 'none';
             }
        }
    }

    // 3. Add-ons
    state.addons.forEach(addon => {
        html += `<div class="fw-item"><span>+ ${addon.name}</span><span>$${addon.price.toLocaleString()}</span></div>`;
        total += addon.price;
    });

    // Render
    if (html === '') html = '<p class="empty-state">Select a package to start...</p>';
    fwItems.innerHTML = html;

    document.getElementById('fw-header-total').innerText = '$' + total.toLocaleString();
    document.getElementById('fw-full-total').innerText = '$' + total.toLocaleString();
    document.getElementById('fw-deposit').innerText = '$' + (total / 2).toLocaleString();
}

function toggleWidget() {
    document.getElementById('floating-widget').classList.toggle('collapsed');
}
