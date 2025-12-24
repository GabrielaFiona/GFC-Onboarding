// --- STATE MANAGEMENT ---
const state = {
  package: null,
  brandKit: false,
  industry: "",
  pages: [],
  addons: [],
  pagePlans: {},
  brandingProvided: null,
  customBranding: { active: false, name: "", price: 0 }
};

const BASE_BRAND_KIT_PRICE = 500;

const SUGGESTION_DB = {
  "restaurant": ["Menu", "Reservations", "Events", "About Us", "Gallery", "Catering"],
  "boutique": ["Shop", "Lookbook", "About Us", "FAQ", "Press", "Returns"],
  "contractor": ["Services", "Projects", "Testimonials", "About Us", "Get Quote"],
  "hotel": ["Rooms", "Amenities", "Local Guide", "Booking", "Gallery"],
  "ecommerce": ["Shop All", "New Arrivals", "About", "Shipping Info", "Track Order"],
  "default": ["Home", "Contact", "About", "Services", "Gallery"]
};

// --- PERSISTENCE ---
function saveState() {
  localStorage.setItem('onboardingState', JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem('onboardingState');
  if (raw) Object.assign(state, JSON.parse(raw));
}

function nextStep(stepNumber) {
  saveState();
  window.location.href = `step${stepNumber}.html`;
}

// --- STEP 2 LOGIC ---
function selectPackage(id, name, price, limit, brandKitBundlePrice, extraPageCost, element) {
  document.querySelectorAll('.package-card').forEach(el => el.classList.remove('selected'));
  if (element) element.classList.add('selected');

  state.package = { id, name, price, limit, brandKitBundlePrice, extraPageCost };
  
  if (state.pages.length === 0) state.pages = ['Home', 'Contact'];
  
  handlePackageSelected();
  calculateTotal();
  updateBrandKitDisplay();
  updatePageBuilderUI(); 
  saveState();
}

function handlePackageSelected(isRestore) {
  const notice = document.getElementById('brandingLockedNotice');
  const unlocked = document.getElementById('brandingUnlocked');
  const pageBuilder = document.getElementById('pageBuilderSection');
  
  if (notice) notice.classList.add('hidden');
  if (unlocked) unlocked.classList.remove('hidden');
  if (pageBuilder) {
    pageBuilder.classList.remove('hidden');
    // Only auto-open page builder if branding is already settled or restored
    if (!isRestore && state.brandingProvided) {
      const pbCol = document.querySelector('[data-key="step2-pages"]');
      if (pbCol) pbCol.classList.remove('collapsed');
    }
  }

  const branding = document.getElementById('brandingSection');
  if (branding && !isRestore) branding.classList.remove('collapsed');
  
  if (window.initCollapsibles) window.initCollapsibles(); 
}

// BRANDING TOGGLES
function toggleBrandingPanels(value) {
  state.brandingProvided = value;
  const yesPanel = document.getElementById('brandingProvidedPanel');
  const noPanel = document.getElementById('brandingNotProvidedPanel');
  
  if (yesPanel) yesPanel.classList.toggle('hidden', value !== 'yes');
  if (noPanel) noPanel.classList.toggle('hidden', value !== 'no');
  
  saveState();
}

// FILE UPLOAD & DOWNLOAD
let uploadedFiles = []; // Store file references in memory

function handleFileUpload(e) {
  const files = e.target.files;
  const box = document.getElementById('file-staging-box');
  const list = document.getElementById('file-list-content');
  
  if (!files || !files.length) {
    box.classList.add('hidden');
    return;
  }
  
  box.classList.remove('hidden');
  list.innerHTML = ''; 
  uploadedFiles = Array.from(files); // Save for download all

  uploadedFiles.forEach(file => {
    const row = document.createElement('div');
    row.className = 'file-list-item';
    const nameSpan = document.createElement('span');
    nameSpan.textContent = file.name;
    
    // Individual Download Link
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.className = 'btn-download-mini';
    link.textContent = 'Download';
    
    row.appendChild(nameSpan);
    row.appendChild(link);
    list.appendChild(row);
  });
}

function downloadAllFiles() {
  if (uploadedFiles.length === 0) {
    alert("No files to download.");
    return;
  }
  // Trigger download for each file
  uploadedFiles.forEach(file => {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

// CUSTOM BRANDING LOGIC
function toggleCustomBrandingUI(panelId) {
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.toggle('hidden');
}

function updateCustomBrandingState() {
  // We sync inputs from both panels (Yes and No)
  // Use the inputs that are currently visible or just query all and take the one with value
  const names = document.querySelectorAll('.custom-brand-name');
  const prices = document.querySelectorAll('.custom-brand-price');
  
  let nameVal = "";
  let priceVal = 0;

  names.forEach(input => { if(input.value) nameVal = input.value; });
  prices.forEach(input => { if(input.value) priceVal = Number(input.value); });
  
  // Sync all inputs to match (so switching Yes/No keeps the data)
  names.forEach(input => input.value = nameVal);
  prices.forEach(input => input.value = priceVal || "");

  state.customBranding = {
    active: (priceVal > 0),
    name: nameVal || "Custom Branding",
    price: priceVal
  };
  
  calculateTotal();
  saveState();
}

// PAGE BUILDER
function initPageBuilder() {
  const input = document.getElementById('industryInput');
  const fileInput = document.getElementById('brandingUploads');
  
  if (fileInput) fileInput.addEventListener('change', handleFileUpload);

  // Restore Branding Toggles
  if (state.brandingProvided) {
    const radio = document.querySelector(`input[name="brandingProvided"][value="${state.brandingProvided}"]`);
    if (radio) {
      radio.checked = true;
      toggleBrandingPanels(state.brandingProvided);
    }
  }

  // Restore Custom Branding
  if (state.customBranding && state.customBranding.price > 0) {
     const names = document.querySelectorAll('.custom-brand-name');
     const prices = document.querySelectorAll('.custom-brand-price');
     names.forEach(i => i.value = state.customBranding.name);
     prices.forEach(i => i.value = state.customBranding.price);
     
     // Open panels
     document.querySelectorAll('.custom-panel').forEach(p => p.classList.remove('hidden'));
  }

  if (!input) return;
  renderActivePages();
  input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      generateSuggestions(input.value);
      state.industry = input.value;
      saveState();
    }
  });
  if (state.industry) {
    input.value = state.industry;
    generateSuggestions(state.industry);
  }
}

function generateSuggestions(query) {
  const container = document.getElementById('suggestionChips');
  if (!container) return;
  container.innerHTML = '';
  let found = false;
  Object.keys(SUGGESTION_DB).forEach(key => {
    if (query.toLowerCase().includes(key)) {
      renderChips(SUGGESTION_DB[key], container);
      found = true;
    }
  });
  if (!found) renderChips(SUGGESTION_DB['default'], container);
}

function renderChips(pages, container) {
  pages.forEach(page => {
    const chip = document.createElement('div');
    chip.className = 'suggestion-chip';
    if (state.pages.includes(page)) chip.classList.add('added');
    chip.textContent = `+ ${page}`;
    chip.onclick = () => addPage(page);
    container.appendChild(chip);
  });
}

function addPage(nameRaw) {
  const input = document.getElementById('customPageInput');
  const name = nameRaw || input.value.trim();
  if (!name) return;
  if (!state.pages.includes(name)) {
    state.pages.push(name);
    if (input) input.value = '';
    renderActivePages();
    generateSuggestions(state.industry || '');
    calculateTotal();
    saveState();
  }
}

function removePage(name) {
  state.pages = state.pages.filter(p => p !== name);
  renderActivePages();
  generateSuggestions(state.industry || '');
  calculateTotal();
  saveState();
}

function renderActivePages() {
  const list = document.getElementById('activePagesList');
  const countEl = document.getElementById('pageCountDisplay');
  const warning = document.getElementById('pageLimitWarning');
  
  if (!list || !state.package) return;
  list.innerHTML = '';
  state.pages.forEach(page => {
    const tag = document.createElement('div');
    tag.className = 'page-tag';
    tag.innerHTML = `${page} <span class="page-tag-remove" onclick="removePage('${page}')">&times;</span>`;
    list.appendChild(tag);
  });

  const limit = state.package.limit;
  const current = state.pages.length;
  if (countEl) countEl.textContent = `${current}/${limit}`;

  if (current > limit) {
    const extra = current - limit;
    const cost = extra * state.package.extraPageCost;
    warning.innerHTML = `You are ${extra} page(s) over your limit. Added cost: <strong>$${cost}</strong>`;
    warning.classList.add('visible');
  } else {
    warning.classList.remove('visible');
  }
}

function updatePageBuilderUI() { renderActivePages(); }

function calculateTotal() {
  const fwItems = document.getElementById('fw-items');
  if (!fwItems) return;

  let html = '';
  let total = 0;

  if (state.package) {
    html += `<div class="fw-item"><span>${state.package.name}</span><span>$${state.package.price.toLocaleString()}</span></div>`;
    total += state.package.price;
    if (state.pages.length > state.package.limit) {
      const extra = state.pages.length - state.package.limit;
      const extraCost = extra * state.package.extraPageCost;
      html += `<div class="fw-item"><span style="color:#ff6b6b">${extra} Extra Pages</span><span>$${extraCost.toLocaleString()}</span></div>`;
      total += extraCost;
    }
  }

  // BRAND KIT
  if (state.brandKit) {
    let kitPrice = BASE_BRAND_KIT_PRICE;
    let label = 'Brand Kit';
    if (state.package && state.package.brandKitBundlePrice) {
      kitPrice = Number(state.package.brandKitBundlePrice);
      label += ' (Bundled)';
    }
    html += `<div class="fw-item"><span>+ ${label}</span><span>$${kitPrice.toLocaleString()}</span></div>`;
    total += kitPrice;
  }

  // CUSTOM BRANDING
  if (state.customBranding && state.customBranding.price > 0) {
    html += `<div class="fw-item"><span>+ ${state.customBranding.name}</span><span>$${state.customBranding.price.toLocaleString()}</span></div>`;
    total += state.customBranding.price;
  }

  state.addons.forEach(addon => {
    html += `<div class="fw-item"><span>+ ${addon.name}</span><span>$${Number(addon.price).toLocaleString()}</span></div>`;
    total += Number(addon.price) || 0;
  });

  if (!html) html = '<p class="empty-state">Select a package to start...</p>';
  fwItems.innerHTML = html;
  
  const headerTotalEl = document.getElementById('fw-header-total');
  if (headerTotalEl) headerTotalEl.textContent = `$${total.toLocaleString()}`;
  const fullTotalEl = document.getElementById('fw-full-total');
  if (fullTotalEl) fullTotalEl.textContent = `$${total.toLocaleString()}`;
  const depositEl = document.getElementById('fw-deposit');
  if (depositEl) depositEl.textContent = `$${(total / 2).toLocaleString()}`;
}

// --- STEP 3: PLAN & CANVAS LOGIC ---
function initStep3() {
  if (!document.body.classList.contains('step3')) return;
  const container = document.getElementById('planContainer');
  const pkgId = state.package ? state.package.id : 'basic';
  container.innerHTML = ''; 

  if (pkgId === 'basic') renderBasicPlan(container);
  else if (pkgId === 'standard') renderStandardPlan(container);
  else if (pkgId === 'advanced') renderAdvancedPlan(container);
}

function renderBasicPlan(container) {
  state.pages.forEach((page, index) => {
    const noteVal = state.pagePlans[page]?.notes || '';
    const html = `
      <div class="plan-card">
        <div class="plan-card-header"><span>${index + 1}. ${page}</span></div>
        <div class="plan-card-body">
          <label>Page Goals & Content Notes</label>
          <textarea rows="5" oninput="savePageNote('${page}', this.value)" placeholder="What should be on this page?">${noteVal}</textarea>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
  });
}

function renderStandardPlan(container) {
  const intro = `<div style="text-align:center; margin-bottom:30px;"><p>Sketch your layout for Mobile and Desktop views.</p></div>`;
  container.insertAdjacentHTML('beforeend', intro);

  state.pages.forEach((page, index) => {
    const mobileId = `cvs-m-${index}`;
    const desktopId = `cvs-d-${index}`;
    const groupName = `group-${index}`;

    const html = `
      <div class="plan-card">
        <div class="plan-card-header"><span>${page} Layout</span></div>
        <div class="plan-card-body">
          
          <div class="mockup-toolbar" id="toolbar-${index}">
            <button class="tool-btn active" onclick="setTool('${groupName}', 'pencil', this)">✏️ Pencil</button>
            <button class="tool-btn" onclick="setTool('${groupName}', 'box', this)">⬜ Box</button>
            <button class="tool-btn" onclick="setTool('${groupName}', 'rect', this)">▬ Rect</button>
            <button class="tool-btn" onclick="setTool('${groupName}', 'triangle', this)">🔺 Tri</button>
            <button class="tool-btn" onclick="setTool('${groupName}', 'circle', this)">⭕ Circ</button>
            <button class="tool-btn" onclick="setTool('${groupName}', 'text', this)">T Text</button>
            <button class="tool-btn" onclick="setTool('${groupName}', 'eraser', this)">🧹 Eraser</button>
            <button class="tool-btn tool-btn-danger" style="margin-left:auto;" onclick="resetCanvasGroup('${mobileId}', '${desktopId}')">↺ Reset</button>
          </div>

          <div class="canvas-pair-container">
            <div class="canvas-wrap">
              <span class="canvas-label">Mobile</span>
              <canvas id="${mobileId}" class="canvas-standard" width="240" height="400"></canvas>
            </div>
            <div class="canvas-wrap">
              <span class="canvas-label">Desktop</span>
              <canvas id="${desktopId}" class="canvas-standard" width="550" height="400"></canvas>
            </div>
          </div>

          <div class="plan-action-row">
            <div class="file-upload-box">
              <label>Attach File (optional)</label>
              <input type="file" onchange="console.log('File attached for ${page}')" />
            </div>
            <div style="flex-grow:1; margin: 0 20px;">
              <textarea rows="2" style="margin:0;" oninput="savePageNote('${page}', this.value)" placeholder="Additional notes...">${state.pagePlans[page]?.notes || ''}</textarea>
            </div>
            <button class="btn btn-secondary btn-download-mini" style="font-size:0.8rem; padding:10px 15px;" 
              onclick="downloadMockups('${page}', '${mobileId}', '${desktopId}')">Download Layouts ⇩</button>
          </div>

        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
    
    setTimeout(() => {
      initCanvas(mobileId, groupName);
      initCanvas(desktopId, groupName);
    }, 100);
  });
}

function renderAdvancedPlan(container) {
  const html = `
    <div class="integration-row">
      <div class="plan-card">
        <div class="plan-card-header">System Flowchart</div>
        <div class="plan-card-body">
          <div class="mockup-toolbar">
            <button class="tool-btn" onclick="setTool('advancedGroup', 'box')">⬜ Box</button>
            <button class="tool-btn" onclick="setTool('advancedGroup', 'line')">🔗 Line</button>
            <button class="tool-btn" onclick="resetCanvasGroup('advancedCanvas')">🗑️ Clear</button>
          </div>
          <canvas id="advancedCanvas" class="canvas-container" style="background:#0f1322; width:100%; height:500px;" width="800" height="500"></canvas>
        </div>
      </div>
      <div class="integration-list">
        <h4>Integrations</h4>
        <div class="integration-item">Stripe / Payments</div>
        <div class="integration-item">Mailchimp</div>
        <textarea rows="10" oninput="saveAdvancedNotes(this.value)">${state.advancedNotes || ''}</textarea>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', html);
  setTimeout(() => initCanvas('advancedCanvas', 'advancedGroup'), 100);
}

function savePageNote(pageName, text) {
  if (!state.pagePlans[pageName]) state.pagePlans[pageName] = {};
  state.pagePlans[pageName].notes = text;
  saveState();
}

function saveAdvancedNotes(text) {
  state.advancedNotes = text;
  saveState();
}

// --- CANVAS TOOLS ---
const canvasState = {}; 

function setTool(groupName, tool, btn) {
  if (!canvasState[groupName]) canvasState[groupName] = { tool: 'pencil' };
  canvasState[groupName].tool = tool;
  
  if (btn) {
    const parent = btn.parentElement;
    parent.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
}

function initCanvas(canvasId, groupName) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  if (!canvasState[groupName]) canvasState[groupName] = { tool: 'pencil' };

  let isDrawing = false;
  let startX, startY;

  ctx.strokeStyle = '#2CA6E0';
  ctx.lineWidth = 3; 
  ctx.lineCap = 'round';
  ctx.fillStyle = 'rgba(44, 166, 224, 0.1)';

  canvas.addEventListener('mousedown', e => {
    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
    const tool = canvasState[groupName].tool;
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);

    if (tool === 'text') {
       const text = prompt("Enter text:", "Header");
       if (text) {
         ctx.fillStyle = '#fff';
         ctx.font = '16px Montserrat';
         ctx.fillText(text, startX, startY);
         ctx.fillStyle = 'rgba(44, 166, 224, 0.1)'; 
       }
       isDrawing = false;
    }
  });

  canvas.addEventListener('mousemove', e => {
    if (!isDrawing) return;
    const tool = canvasState[groupName].tool;
    const x = e.offsetX;
    const y = e.offsetY;

    if (tool === 'pencil') {
      ctx.lineWidth = 3;
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'eraser') {
      ctx.lineWidth = 20;
      ctx.globalCompositeOperation = 'destination-out'; 
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over'; 
    }
  });

  canvas.addEventListener('mouseup', e => {
    if (!isDrawing) return;
    isDrawing = false;
    const endX = e.offsetX;
    const endY = e.offsetY;
    const tool = canvasState[groupName].tool;

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#2CA6E0';
    ctx.globalCompositeOperation = 'source-over';

    if (tool === 'box' || tool === 'rect') {
      const w = endX - startX;
      const h = (tool === 'box') ? w : (endY - startY); 
      ctx.rect(startX, startY, w, h);
      ctx.fill();
      ctx.stroke();
    } else if (tool === 'circle') {
      const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    } else if (tool === 'triangle') {
      ctx.beginPath();
      ctx.moveTo(startX, startY); 
      ctx.lineTo(endX, endY); 
      ctx.lineTo(startX - (endX - startX), endY); 
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  });
}

function resetCanvasGroup(id1, id2) {
  if(confirm("Clear sketches?")) {
    [id1, id2].forEach(id => {
      const c = document.getElementById(id);
      if(c) {
        const ctx = c.getContext('2d');
        ctx.clearRect(0, 0, c.width, c.height);
      }
    });
  }
}

function downloadMockups(pageName, mobileId, desktopId) {
  const mCanvas = document.getElementById(mobileId);
  const dCanvas = document.getElementById(desktopId);
  
  const gap = 20;
  const w = mCanvas.width + dCanvas.width + gap;
  const h = Math.max(mCanvas.height, dCanvas.height);
  
  const comp = document.createElement('canvas');
  comp.width = w;
  comp.height = h;
  const ctx = comp.getContext('2d');
  
  ctx.fillStyle = '#0f1322';
  ctx.fillRect(0,0,w,h);
  
  ctx.drawImage(mCanvas, 0, 0);
  ctx.drawImage(dCanvas, mCanvas.width + gap, 0);
  
  ctx.fillStyle = '#fff';
  ctx.font = '20px Montserrat';
  ctx.fillText("Mobile", 10, 30);
  ctx.fillText("Desktop", mCanvas.width + gap + 10, 30);
  
  const link = document.createElement('a');
  link.download = `${pageName}-layout-sketch.png`;
  link.href = comp.toDataURL();
  link.click();
}

function toggleBrandKit(element) {
  state.brandKit = !state.brandKit;
  // Visual update handled by refreshing both cards if they exist
  document.querySelectorAll('.brand-kit-ref').forEach(el => {
    el.classList.toggle('selected', state.brandKit);
  });
  
  calculateTotal();
  updateBrandKitDisplay();
  saveState();
}

function updateBrandKitDisplay() {
  document.querySelectorAll('.brand-kit-ref').forEach(bar => {
    const ogPriceEl = bar.querySelector('.bk-og-price');
    const discountLabelEl = bar.querySelector('.bk-discount-label');
    const finalPriceEl = bar.querySelector('.bk-final-price');
    if (!finalPriceEl) return;
    
    const hasBundle = !!(state.package && state.package.brandKitBundlePrice);
    const displayPrice = hasBundle ? Number(state.package.brandKitBundlePrice) : BASE_BRAND_KIT_PRICE;
    
    if (hasBundle && displayPrice !== BASE_BRAND_KIT_PRICE) {
      if (ogPriceEl) { ogPriceEl.textContent = `$${BASE_BRAND_KIT_PRICE.toLocaleString()}`; ogPriceEl.style.display = 'inline'; }
      if (discountLabelEl) discountLabelEl.style.display = 'block';
    } else {
      if (ogPriceEl) ogPriceEl.style.display = 'none';
      if (discountLabelEl) discountLabelEl.style.display = 'none';
    }
    finalPriceEl.textContent = `$${displayPrice.toLocaleString()}`;
    bar.classList.toggle('selected', !!state.brandKit);
  });
}

function toggleWidget() {
  const widget = document.getElementById('floating-widget');
  if (widget) widget.classList.toggle('collapsed');
}

function togglePackageDetails(buttonEl) {
  const card = buttonEl.closest('.package-card');
  if (card) {
    const expanded = card.classList.toggle('expanded');
    buttonEl.textContent = expanded ? 'Close Details' : 'View Details';
  }
}

function initCollapsibles() {
  const sections = document.querySelectorAll('[data-collapsible]');
  sections.forEach(section => {
    const header = section.querySelector('[data-collapsible-header]');
    if (!header || header.hasAttribute('data-has-listener')) return;
    header.setAttribute('data-has-listener', 'true');
    header.addEventListener('click', (e) => {
      e.preventDefault();
      section.classList.toggle('collapsed');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initCollapsibles();
  if (window.location.pathname.includes('step2')) {
    initPageBuilder();
    if(state.package) handlePackageSelected(true);
  }
  if (window.location.pathname.includes('step3')) initStep3();
  calculateTotal();
  updateBrandKitDisplay();
});
