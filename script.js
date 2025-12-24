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

// Store files in memory
const pageAttachments = {}; 

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
    if (!isRestore && state.brandingProvided) {
      const pbCol = document.querySelector('[data-key="step2-pages"]');
      if (pbCol) pbCol.classList.remove('collapsed');
    }
  }

  const branding = document.getElementById('brandingSection');
  if (branding && !isRestore) branding.classList.remove('collapsed');
  
  if (window.initCollapsibles) window.initCollapsibles(); 
}

function toggleBrandingPanels(value) {
  state.brandingProvided = value;
  const yesPanel = document.getElementById('brandingProvidedPanel');
  const noPanel = document.getElementById('brandingNotProvidedPanel');
  if (yesPanel) yesPanel.classList.toggle('hidden', value !== 'yes');
  if (noPanel) noPanel.classList.toggle('hidden', value !== 'no');
  saveState();
}

// STEP 2 FILE UPLOAD (BRANDING)
let uploadedFiles = []; 
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
  uploadedFiles = Array.from(files); 

  uploadedFiles.forEach(file => {
    const row = document.createElement('div');
    row.className = 'file-list-item';
    const nameSpan = document.createElement('span');
    nameSpan.textContent = file.name;
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
  if (uploadedFiles.length === 0) { alert("No files to download."); return; }
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

function toggleCustomBrandingUI(panelId) {
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.toggle('hidden');
}

function updateCustomBrandingState() {
  const names = document.querySelectorAll('.custom-brand-name');
  const prices = document.querySelectorAll('.custom-brand-price');
  let nameVal = "";
  let priceVal = 0;

  names.forEach(input => { if(input.value) nameVal = input.value; });
  prices.forEach(input => { if(input.value) priceVal = Number(input.value); });
  
  names.forEach(input => input.value = nameVal);
  prices.forEach(input => input.value = priceVal || "");

  state.customBranding = { active: (priceVal > 0), name: nameVal || "Custom Branding", price: priceVal };
  calculateTotal();
  saveState();
}

function initPageBuilder() {
  const input = document.getElementById('industryInput');
  const fileInput = document.getElementById('brandingUploads');
  if (fileInput) fileInput.addEventListener('change', handleFileUpload);

  if (state.brandingProvided) {
    const radio = document.querySelector(`input[name="brandingProvided"][value="${state.brandingProvided}"]`);
    if (radio) { radio.checked = true; toggleBrandingPanels(state.brandingProvided); }
  }
  if (state.customBranding && state.customBranding.price > 0) {
     const names = document.querySelectorAll('.custom-brand-name');
     const prices = document.querySelectorAll('.custom-brand-price');
     names.forEach(i => i.value = state.customBranding.name);
     prices.forEach(i => i.value = state.customBranding.price);
     document.querySelectorAll('.custom-panel').forEach(p => p.classList.remove('hidden'));
  }
  if (!input) return;
  renderActivePages();
  input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') { generateSuggestions(input.value); state.industry = input.value; saveState(); }
  });
  if (state.industry) { input.value = state.industry; generateSuggestions(state.industry); }
}

function generateSuggestions(query) {
  const container = document.getElementById('suggestionChips');
  if (!container) return;
  container.innerHTML = '';
  let found = false;
  Object.keys(SUGGESTION_DB).forEach(key => {
    if (query.toLowerCase().includes(key)) { renderChips(SUGGESTION_DB[key], container); found = true; }
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
  } else { warning.classList.remove('visible'); }
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
  if (state.brandKit) {
    let kitPrice = BASE_BRAND_KIT_PRICE;
    let label = 'Brand Kit';
    if (state.package && state.package.brandKitBundlePrice) { kitPrice = Number(state.package.brandKitBundlePrice); label += ' (Bundled)'; }
    html += `<div class="fw-item"><span>+ ${label}</span><span>$${kitPrice.toLocaleString()}</span></div>`;
    total += kitPrice;
  }
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

// --- NEW STANDARD PLAN (Step 3) ---
function renderStandardPlan(container) {
  const intro = `<div style="text-align:center; margin-bottom:30px;"><p>Sketch your layout for Mobile and Desktop views.</p></div>`;
  container.insertAdjacentHTML('beforeend', intro);

  state.pages.forEach((page, index) => {
    const mobileId = `cvs-m-${index}`;
    const desktopId = `cvs-d-${index}`;
    const groupName = `group-${index}`;
    const fileListId = `file-list-${index}`;
    const orderOptions = state.pages.map((_, i) => `<option value="${i}" ${i === index ? 'selected' : ''}>Order: ${i + 1}</option>`).join('');

    const html = `
      <div class="plan-card" id="card-${index}">
        <div class="plan-card-header" onclick="togglePlanCard(this)">
          <div class="plan-card-title-group">
            <span class="plan-card-chevron">▼</span>
            <span>${page}</span>
          </div>
          <div onclick="event.stopPropagation()">
            <select class="order-select" onchange="changePageOrder(${index}, this.value)">
              ${orderOptions}
            </select>
          </div>
        </div>
        <div class="plan-card-body">
          
          <div class="mockup-toolbar" id="toolbar-${index}">
            <button class="tool-btn active" title="Pencil" onclick="setTool('${groupName}', 'pencil', this)">✏️</button>
            <button class="tool-btn" title="Box" onclick="setTool('${groupName}', 'box', this)">⬜</button>
            <button class="tool-btn" title="Rectangle" onclick="setTool('${groupName}', 'rect', this)">▬</button>
            <button class="tool-btn" title="Triangle" onclick="setTool('${groupName}', 'triangle', this)">🔺</button>
            <button class="tool-btn" title="Circle" onclick="setTool('${groupName}', 'circle', this)">⭕</button>
            <button class="tool-btn" title="Text" onclick="setTool('${groupName}', 'text', this)">T</button>
            <button class="tool-btn" title="Eraser" onclick="setTool('${groupName}', 'eraser', this)">🧹</button>
            <div style="width:1px; height:20px; background:var(--border-light); margin:0 10px;"></div>
            <button class="tool-btn tool-btn-danger" title="Clear Canvas" onclick="resetCanvasGroup('${mobileId}', '${desktopId}')">🗑️</button>
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

          <div class="plan-footer">
            <div class="plan-notes-area">
              <label>Layout Notes</label>
              <textarea oninput="savePageNote('${page}', this.value)" placeholder="Describe specific functionality or content...">${state.pagePlans[page]?.notes || ''}</textarea>
            </div>
            <div class="plan-files-area">
              <label>Page Assets</label>
              <div class="file-upload-wrapper">
                 <label for="file-input-${index}" class="custom-file-upload">
                   <span style="font-size:1.2rem;">📂</span><br>Click to Upload
                 </label>
                 <input id="file-input-${index}" type="file" multiple onchange="handlePageFileUpload('${page}', this, '${fileListId}')" />
              </div>
              
              <div id="${fileListId}" class="mini-file-list"></div>
              
              <button class="btn btn-secondary btn-download-mini" style="width:100%; margin-top:15px; padding:12px;" 
                onclick="downloadPageAssets('${page}', '${mobileId}', '${desktopId}')">Download Sketch & Files ⇩</button>
            </div>
          </div>

        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
    
    setTimeout(() => {
      initCanvas(mobileId, groupName);
      initCanvas(desktopId, groupName);
      restoreCanvasData(page, mobileId, desktopId);
      renderPageFileList(page, fileListId);
    }, 100);
  });

  // ADD "DOWNLOAD ALL" BUTTON AT BOTTOM
  const downloadAllBtn = `
    <button class="btn-download-all" onclick="downloadAllProjectAssets()">
      Download Full Project Assets
    </button>
  `;
  container.insertAdjacentHTML('beforeend', downloadAllBtn);
}

// --- FILE UPLOAD LOGIC ---
function handlePageFileUpload(pageName, input, listId) {
  if (input.files && input.files.length > 0) {
    if (!pageAttachments[pageName]) pageAttachments[pageName] = [];
    Array.from(input.files).forEach(f => pageAttachments[pageName].push(f));
    renderPageFileList(pageName, listId);
  }
}

function removePageFile(pageName, index, listId) {
  if (pageAttachments[pageName]) {
    pageAttachments[pageName].splice(index, 1);
    renderPageFileList(pageName, listId);
  }
}

function renderPageFileList(pageName, listId) {
  const container = document.getElementById(listId);
  if (!container) return;
  
  container.innerHTML = '';
  const files = pageAttachments[pageName] || [];
  
  if (files.length === 0) {
    container.innerHTML = '<div style="font-size:0.75rem; color:var(--text-muted); text-align:center; margin-top:5px;">No files attached</div>';
    return;
  }

  files.forEach((file, i) => {
    const div = document.createElement('div');
    div.className = 'page-file-item';
    div.innerHTML = `<span>📎 ${file.name}</span>`;
    
    const delBtn = document.createElement('span');
    delBtn.innerHTML = '&times;';
    delBtn.className = 'delete-file-btn';
    delBtn.title = 'Remove File';
    delBtn.onclick = () => removePageFile(pageName, i, listId);
    
    div.appendChild(delBtn);
    container.appendChild(div);
  });
}

// --- DOWNLOAD LOGIC ---
async function downloadAllProjectAssets() {
  if (!confirm("This will download all sketches and attached files for every page. If your browser prompts, please allow multiple downloads.")) return;

  for (const page of state.pages) {
    const index = state.pages.indexOf(page);
    const mobileId = `cvs-m-${index}`;
    const desktopId = `cvs-d-${index}`;
    
    // Download Sketch
    downloadPageSketchOnly(page, mobileId, desktopId);
    await new Promise(r => setTimeout(r, 800)); // Delay to prevent blocking

    // Download Files
    const files = pageAttachments[page] || [];
    for (const file of files) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = `[${page}] ${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      await new Promise(r => setTimeout(r, 500));
    }
  }
}

function downloadPageAssets(pageName, mobileId, desktopId) {
  downloadPageSketchOnly(pageName, mobileId, desktopId);
  
  const files = pageAttachments[pageName] || [];
  let delay = 500;
  files.forEach(file => {
    setTimeout(() => {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, delay);
    delay += 500;
  });
}

function downloadPageSketchOnly(pageName, mobileId, desktopId) {
  const mCanvas = document.getElementById(mobileId);
  const dCanvas = document.getElementById(desktopId);
  if (mCanvas && dCanvas) {
    const gap = 20;
    const w = mCanvas.width + dCanvas.width + gap;
    const h = Math.max(mCanvas.height, dCanvas.height);
    const comp = document.createElement('canvas');
    comp.width = w; comp.height = h;
    const ctx = comp.getContext('2d');
    ctx.fillStyle = '#0f1322'; ctx.fillRect(0,0,w,h);
    ctx.drawImage(mCanvas, 0, 0); ctx.drawImage(dCanvas, mCanvas.width + gap, 0);
    ctx.fillStyle = '#fff'; ctx.font = '20px Montserrat';
    ctx.fillText("Mobile", 10, 30); ctx.fillText("Desktop", mCanvas.width + gap + 10, 30);
    const link = document.createElement('a');
    link.download = `${pageName}-layout-sketch.png`;
    link.href = comp.toDataURL();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

function togglePlanCard(header) {
  const card = header.closest('.plan-card');
  card.classList.toggle('collapsed');
}

// REORDERING LOGIC
function changePageOrder(oldIndex, newIndexStr) {
  const newIndex = parseInt(newIndexStr);
  if (oldIndex === newIndex) return;
  saveAllCanvasStates();
  const item = state.pages.splice(oldIndex, 1)[0];
  state.pages.splice(newIndex, 0, item);
  saveState();
  initStep3();
}

function saveAllCanvasStates() {
  state.pages.forEach((page, idx) => {
    const mCanvas = document.getElementById(`cvs-m-${idx}`);
    const dCanvas = document.getElementById(`cvs-d-${idx}`);
    if (mCanvas && dCanvas) {
      if (!state.pagePlans[page]) state.pagePlans[page] = {};
      state.pagePlans[page].mobileData = mCanvas.toDataURL();
      state.pagePlans[page].desktopData = dCanvas.toDataURL();
    }
  });
  saveState();
}

function restoreCanvasData(page, mId, dId) {
  const plan = state.pagePlans[page];
  if (!plan) return;
  if (plan.mobileData) {
    const img = new Image();
    img.onload = function() { document.getElementById(mId).getContext('2d').drawImage(img, 0, 0); };
    img.src = plan.mobileData;
  }
  if (plan.desktopData) {
    const img = new Image();
    img.onload = function() { document.getElementById(dId).getContext('2d').drawImage(img, 0, 0); };
    img.src = plan.desktopData;
  }
}

function renderAdvancedPlan(container) {
  const html = `
    <div class="integration-row">
      <div class="plan-card">
        <div class="plan-card-header">System Flowchart</div>
        <div class="plan-card-body">
          <div class="mockup-toolbar">
            <button class="tool-btn" onclick="setTool('advancedGroup', 'box')">⬜</button>
            <button class="tool-btn" onclick="setTool('advancedGroup', 'line')">🔗</button>
            <button class="tool-btn" onclick="resetCanvasGroup('advancedCanvas')">🗑️</button>
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

function saveAdvancedNotes(text) { state.advancedNotes = text; saveState(); }

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
      ctx.lineWidth = 3; ctx.globalCompositeOperation = 'source-over'; ctx.lineTo(x, y); ctx.stroke();
    } else if (tool === 'eraser') {
      ctx.lineWidth = 20; ctx.globalCompositeOperation = 'destination-out'; ctx.lineTo(x, y); ctx.stroke(); ctx.globalCompositeOperation = 'source-over'; 
    }
  });

  canvas.addEventListener('mouseup', e => {
    if (!isDrawing) return;
    isDrawing = false;
    const endX = e.offsetX;
    const endY = e.offsetY;
    const tool = canvasState[groupName].tool;
    ctx.lineWidth = 3; ctx.strokeStyle = '#2CA6E0'; ctx.globalCompositeOperation = 'source-over';
    if (tool === 'box' || tool === 'rect') {
      const w = endX - startX;
      const h = (tool === 'box') ? w : (endY - startY); 
      ctx.rect(startX, startY, w, h); ctx.fill(); ctx.stroke();
    } else if (tool === 'circle') {
      const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      ctx.beginPath(); ctx.arc(startX, startY, radius, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    } else if (tool === 'triangle') {
      ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(endX, endY); ctx.lineTo(startX - (endX - startX), endY); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
  });
}

function resetCanvasGroup(id1, id2) {
  if(confirm("Clear sketches?")) {
    [id1, id2].forEach(id => {
      const c = document.getElementById(id);
      if(c) { c.getContext('2d').clearRect(0, 0, c.width, c.height); }
    });
  }
}

function toggleBrandKit(element) {
  state.brandKit = !state.brandKit;
  document.querySelectorAll('.brand-kit-ref').forEach(el => { el.classList.toggle('selected', state.brandKit); });
  calculateTotal(); updateBrandKitDisplay(); saveState();
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
