// --- STATE MANAGEMENT ---
const state = {
  package: null,
  brandKit: false,
  industry: "",
  pages: [],
  addons: [],
  pagePlans: {}, // Stores notes, sketches, and strategy data
  brandingProvided: null,
  customBranding: { active: false, name: "", price: 0 },
  flowchartData: { nodes: [], connections: [] } // For Advanced Package Flowchart
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

// --- STEP 2 LOGIC (Packages & Pages) ---
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

// STEP 2 FILE UPLOAD
let uploadedFiles = []; 
function handleFileUpload(e) {
  const files = e.target.files;
  const box = document.getElementById('file-staging-box');
  const list = document.getElementById('file-list-content');
  if (!files || !files.length) { box.classList.add('hidden'); return; }
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
    link.href = url; link.download = file.name; link.className = 'btn-download-mini'; link.textContent = 'Download';
    row.appendChild(nameSpan); row.appendChild(link); list.appendChild(row);
  });
}

function downloadAllFiles() {
  if (uploadedFiles.length === 0) { alert("No files to download."); return; }
  uploadedFiles.forEach(file => {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url; link.download = file.name;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  });
}

function toggleCustomBrandingUI(panelId) {
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.toggle('hidden');
}

function updateCustomBrandingState() {
  const names = document.querySelectorAll('.custom-brand-name');
  const prices = document.querySelectorAll('.custom-brand-price');
  let nameVal = ""; let priceVal = 0;
  names.forEach(input => { if(input.value) nameVal = input.value; });
  prices.forEach(input => { if(input.value) priceVal = Number(input.value); });
  names.forEach(input => input.value = nameVal);
  prices.forEach(input => input.value = priceVal || "");
  state.customBranding = { active: (priceVal > 0), name: nameVal || "Custom Branding", price: priceVal };
  calculateTotal(); saveState();
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
    renderActivePages(); generateSuggestions(state.industry || ''); calculateTotal(); saveState();
  }
}

function removePage(name) {
  state.pages = state.pages.filter(p => p !== name);
  renderActivePages(); generateSuggestions(state.industry || ''); calculateTotal(); saveState();
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

// --- RENDER FUNCTIONS FOR PACKAGES ---
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
      </div>`;
    container.insertAdjacentHTML('beforeend', html);
  });
}

function renderStandardPlan(container) {
  const intro = `<div style="text-align:center; margin-bottom:30px;"><p>Sketch your layout for Mobile and Desktop views.</p></div>`;
  container.insertAdjacentHTML('beforeend', intro);
  generatePageCards(container);
  appendDownloadAllBtn(container);
}

function renderAdvancedPlan(container) {
  // 1. Ecosystem Map (Flowchart)
  const intro = `<div style="text-align:center; margin-bottom:30px;"><p>Part 1: Ecosystem Flow Map. Visualize how pages and tools connect.</p></div>`;
  container.insertAdjacentHTML('beforeend', intro);

  const flowchartHtml = `
    <div class="collapsible">
      <div class="collapsible-header">
        <div class="collapsible-title">Ecosystem Flowchart</div>
        <div class="collapsible-chevron">▼</div>
      </div>
      <div class="collapsible-body" style="display:block; padding:25px;">
        <div class="flowchart-toolbar">
           <div>
             <button class="fc-btn" onclick="addFlowchartNode('tool', 'Booking Tool')">+ Booking</button>
             <button class="fc-btn" onclick="addFlowchartNode('tool', 'Payment')">+ Payment</button>
             <button class="fc-btn" onclick="addFlowchartNode('tool', 'Email')">+ Email</button>
             <button class="fc-btn" onclick="addFlowchartNode('tool', 'Custom Tool')">+ Custom Node</button>
           </div>
           <div>
             <button class="fc-btn active" id="fcModeBtn" onclick="toggleFlowchartMode()">Mode: Move</button>
             <button class="fc-btn" onclick="clearFlowchart()">Reset Map</button>
           </div>
        </div>
        <canvas id="flowchartCanvas" class="flowchart-container" width="900" height="600"></canvas>
        <p style="font-size:0.8rem; opacity:0.7; text-align:center; margin-top:10px;">Drag nodes to arrange. Switch mode to 'Connect' to draw arrows between them.</p>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', flowchartHtml);
  setTimeout(initAdvancedFlowchart, 100);

  // 2. Page Planners with Strategy Board
  const part2 = `<div style="text-align:center; margin: 50px 0 30px 0;"><h2>Part 2: Detailed Page Planners</h2><p>Define strategy, SEO, and Layout for each page.</p></div>`;
  container.insertAdjacentHTML('beforeend', part2);
  
  // Use the same generator as Standard, but we will inject Strategy Boards inside
  generatePageCards(container, true); 
  appendDownloadAllBtn(container);
}

// --- HELPER: Generate Page Cards (Shared by Standard & Advanced) ---
function generatePageCards(container, isAdvanced = false) {
  state.pages.forEach((page, index) => {
    const mobileId = `cvs-m-${index}`;
    const desktopId = `cvs-d-${index}`;
    const groupName = `group-${index}`;
    const fileListId = `file-list-${index}`;
    const orderOptions = state.pages.map((_, i) => `<option value="${i}" ${i === index ? 'selected' : ''}>Order: ${i + 1}</option>`).join('');

    // Strategy Board HTML (Only for Advanced)
    let strategyHtml = '';
    if (isAdvanced) {
      const plan = state.pagePlans[page] || {};
      const seo = plan.seo || '';
      const conv = plan.conversion || 'none';
      const integrations = plan.integrations || [];
      
      strategyHtml = `
        <div class="strategy-board">
          <h4>Strategy & Tech Specs</h4>
          <div class="strategy-grid">
            <div>
              <label>SEO Focus Keyword</label>
              <input type="text" placeholder="e.g. Luxury Hotel Miami" value="${seo}" oninput="savePageStrategy('${page}', 'seo', this.value)" />
            </div>
            <div>
              <label>Conversion Action</label>
              <select onchange="savePageStrategy('${page}', 'conversion', this.value)">
                <option value="none" ${conv === 'none' ? 'selected' : ''}>No specific action</option>
                <option value="book" ${conv === 'book' ? 'selected' : ''}>Book Appointment</option>
                <option value="buy" ${conv === 'buy' ? 'selected' : ''}>Buy Product</option>
                <option value="contact" ${conv === 'contact' ? 'selected' : ''}>Fill Contact Form</option>
                <option value="subscribe" ${conv === 'subscribe' ? 'selected' : ''}>Subscribe / Sign Up</option>
                <option value="call" ${conv === 'call' ? 'selected' : ''}>Click to Call</option>
              </select>
            </div>
          </div>
          <label>Integration Needs</label>
          <div class="integration-pills">
            ${['Booking System', 'Payment Gateway', 'Contact Form', 'Analytics', 'Social Feed', 'Live Chat'].map(tech => 
              `<div class="int-pill ${integrations.includes(tech) ? 'active' : ''}" onclick="togglePageIntegration('${page}', '${tech}', this)">${tech}</div>`
            ).join('')}
          </div>
        </div>
      `;
    }

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
          ${strategyHtml}
          
          <div class="mockup-toolbar" id="toolbar-${index}">
            <button class="tool-btn active" onclick="setTool('${groupName}', 'pencil', this)">✏️</button>
            <button class="tool-btn" onclick="setTool('${groupName}', 'box', this)">⬜</button>
            <button class="tool-btn" onclick="setTool('${groupName}', 'rect', this)">▬</button>
            <button class="tool-btn" onclick="setTool('${groupName}', 'triangle', this)">🔺</button>
            <button class="tool-btn" onclick="setTool('${groupName}', 'circle', this)">⭕</button>
            <button class="tool-btn" onclick="setTool('${groupName}', 'text', this)">T</button>
            <button class="tool-btn" onclick="setTool('${groupName}', 'eraser', this)">🧹</button>
            <div style="width:1px; height:20px; background:var(--border-light); margin:0 10px;"></div>
            <button class="tool-btn tool-btn-danger" onclick="resetCanvasGroup('${mobileId}', '${desktopId}')">🗑️</button>
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
                 <label for="file-input-${index}" class="custom-file-upload"><span style="font-size:1.2rem;">📂</span><br>Click to Upload</label>
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
}

function appendDownloadAllBtn(container) {
  const btn = `<button class="btn-download-all" onclick="downloadAllProjectAssets()">Download Full Project Assets</button>`;
  container.insertAdjacentHTML('beforeend', btn);
}

// --- ADVANCED STRATEGY LOGIC ---
function savePageStrategy(page, key, value) {
  if (!state.pagePlans[page]) state.pagePlans[page] = {};
  state.pagePlans[page][key] = value;
  saveState();
}

function togglePageIntegration(page, tech, pillEl) {
  if (!state.pagePlans[page]) state.pagePlans[page] = {};
  let ints = state.pagePlans[page].integrations || [];
  if (ints.includes(tech)) {
    ints = ints.filter(t => t !== tech);
    pillEl.classList.remove('active');
  } else {
    ints.push(tech);
    pillEl.classList.add('active');
  }
  state.pagePlans[page].integrations = ints;
  saveState();
}

// --- ADVANCED FLOWCHART ENGINE ---
let fcCanvas, fcCtx;
let fcNodes = []; 
let fcConnections = [];
let fcMode = 'move'; // 'move' or 'connect'
let fcDragging = null;
let fcStartNode = null; // For connection line

function initAdvancedFlowchart() {
  fcCanvas = document.getElementById('flowchartCanvas');
  if (!fcCanvas) return;
  fcCtx = fcCanvas.getContext('2d');

  // Auto-populate nodes if empty
  if (state.flowchartData && state.flowchartData.nodes.length > 0) {
    fcNodes = state.flowchartData.nodes;
    fcConnections = state.flowchartData.connections || [];
  } else {
    // Initial setup based on pages
    let x = 50, y = 50;
    state.pages.forEach((page, i) => {
      fcNodes.push({ id: `p${i}`, text: page, x: x, y: y, w: 120, h: 60, type: 'page' });
      x += 150;
      if (x > 700) { x = 50; y += 100; }
    });
  }

  drawFlowchart();

  // Event Listeners
  fcCanvas.addEventListener('mousedown', fcMouseDown);
  fcCanvas.addEventListener('mousemove', fcMouseMove);
  fcCanvas.addEventListener('mouseup', fcMouseUp);
}

function drawFlowchart() {
  fcCtx.clearRect(0, 0, fcCanvas.width, fcCanvas.height);
  
  // Draw Connections
  fcCtx.strokeStyle = '#2CA6E0'; fcCtx.lineWidth = 2;
  fcConnections.forEach(conn => {
    const n1 = fcNodes.find(n => n.id === conn.from);
    const n2 = fcNodes.find(n => n.id === conn.to);
    if (n1 && n2) {
      fcCtx.beginPath();
      fcCtx.moveTo(n1.x + n1.w/2, n1.y + n1.h/2);
      fcCtx.lineTo(n2.x + n2.w/2, n2.y + n2.h/2);
      fcCtx.stroke();
      // Arrowhead
      const angle = Math.atan2((n2.y + n2.h/2) - (n1.y + n1.h/2), (n2.x + n2.w/2) - (n1.x + n1.w/2));
      fcCtx.beginPath();
      fcCtx.moveTo(n2.x + n2.w/2, n2.y + n2.h/2);
      fcCtx.lineTo((n2.x + n2.w/2) - 10 * Math.cos(angle - Math.PI/6), (n2.y + n2.h/2) - 10 * Math.sin(angle - Math.PI/6));
      fcCtx.lineTo((n2.x + n2.w/2) - 10 * Math.cos(angle + Math.PI/6), (n2.y + n2.h/2) - 10 * Math.sin(angle + Math.PI/6));
      fcCtx.fillStyle = '#2CA6E0'; fcCtx.fill();
    }
  });

  // Draw Temp Connection Line
  if (fcMode === 'connect' && fcStartNode && fcDragging) {
    fcCtx.beginPath();
    fcCtx.moveTo(fcStartNode.x + fcStartNode.w/2, fcStartNode.y + fcStartNode.h/2);
    fcCtx.lineTo(fcDragging.x, fcDragging.y); // Mouse pos
    fcCtx.strokeStyle = 'rgba(44, 166, 224, 0.5)'; fcCtx.setLineDash([5, 5]); fcCtx.stroke(); fcCtx.setLineDash([]);
  }

  // Draw Nodes
  fcNodes.forEach(node => {
    fcCtx.fillStyle = node.type === 'page' ? '#1a1e2e' : '#050508';
    fcCtx.strokeStyle = node === fcStartNode ? '#fff' : '#2CA6E0';
    fcCtx.lineWidth = node === fcStartNode ? 2 : 1;
    fcCtx.fillRect(node.x, node.y, node.w, node.h);
    fcCtx.strokeRect(node.x, node.y, node.w, node.h);
    
    fcCtx.fillStyle = '#fff'; fcCtx.font = '12px Montserrat'; fcCtx.textAlign = 'center';
    fcCtx.fillText(node.text, node.x + node.w/2, node.y + node.h/2 + 4);
  });
}

function fcMouseDown(e) {
  const { x, y } = getMousePos(e);
  const clickedNode = fcNodes.find(n => x >= n.x && x <= n.x + n.w && y >= n.y && y <= n.y + n.h);

  if (fcMode === 'move') {
    if (clickedNode) { fcDragging = clickedNode; fcDragging.offsetX = x - clickedNode.x; fcDragging.offsetY = y - clickedNode.y; }
  } else if (fcMode === 'connect') {
    if (clickedNode) { fcStartNode = clickedNode; fcDragging = { x, y }; } // dragging obj just stores mouse pos for line drawing
  }
}

function fcMouseMove(e) {
  const { x, y } = getMousePos(e);
  if (fcMode === 'move' && fcDragging) {
    fcDragging.x = x - fcDragging.offsetX; fcDragging.y = y - fcDragging.offsetY;
    drawFlowchart();
  } else if (fcMode === 'connect' && fcStartNode) {
    fcDragging = { x, y };
    drawFlowchart();
  }
}

function fcMouseUp(e) {
  const { x, y } = getMousePos(e);
  if (fcMode === 'move') {
    fcDragging = null;
    saveFlowchart();
  } else if (fcMode === 'connect' && fcStartNode) {
    const droppedNode = fcNodes.find(n => x >= n.x && x <= n.x + n.w && y >= n.y && y <= n.y + n.h);
    if (droppedNode && droppedNode !== fcStartNode) {
      fcConnections.push({ from: fcStartNode.id, to: droppedNode.id });
      saveFlowchart();
    }
    fcStartNode = null; fcDragging = null;
    drawFlowchart();
  }
}

function getMousePos(evt) {
  const rect = fcCanvas.getBoundingClientRect();
  return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
}

function addFlowchartNode(type, defaultText) {
  const name = prompt("Enter Name:", defaultText);
  if (name) {
    fcNodes.push({ id: 'n' + Date.now(), text: name, x: 50, y: 50, w: 120, h: 60, type: type });
    drawFlowchart();
    saveFlowchart();
  }
}

function toggleFlowchartMode() {
  fcMode = fcMode === 'move' ? 'connect' : 'move';
  document.getElementById('fcModeBtn').textContent = `Mode: ${fcMode.charAt(0).toUpperCase() + fcMode.slice(1)}`;
  document.getElementById('fcModeBtn').classList.toggle('active', fcMode === 'connect');
}

function clearFlowchart() {
  if (confirm("Reset flowchart?")) {
    state.flowchartData = { nodes: [], connections: [] };
    fcNodes = []; fcConnections = [];
    initAdvancedFlowchart(); // re-init to pull pages
    saveState();
  }
}

function saveFlowchart() {
  state.flowchartData = { nodes: fcNodes, connections: fcConnections };
  saveState();
}

// --- STANDARD CANVAS & FILE UTILS (Shared) ---
function savePageNote(pageName, text) { if (!state.pagePlans[pageName]) state.pagePlans[pageName] = {}; state.pagePlans[pageName].notes = text; saveState(); }
function saveAdvancedNotes(text) { state.advancedNotes = text; saveState(); }

const canvasState = {}; 
function setTool(groupName, tool, btn) {
  if (!canvasState[groupName]) canvasState[groupName] = { tool: 'pencil' };
  canvasState[groupName].tool = tool;
  if (btn) { btn.parentElement.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); }
}

function initCanvas(canvasId, groupName) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!canvasState[groupName]) canvasState[groupName] = { tool: 'pencil' };
  let isDrawing = false; let startX, startY;
  ctx.strokeStyle = '#2CA6E0'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.fillStyle = 'rgba(44, 166, 224, 0.1)';

  canvas.addEventListener('mousedown', e => {
    isDrawing = true; startX = e.offsetX; startY = e.offsetY;
    const tool = canvasState[groupName].tool;
    ctx.beginPath(); ctx.moveTo(startX, startY);
    if (tool === 'text') {
       const text = prompt("Enter text:", "Header");
       if (text) { ctx.fillStyle = '#fff'; ctx.font = '16px Montserrat'; ctx.fillText(text, startX, startY); ctx.fillStyle = 'rgba(44, 166, 224, 0.1)'; }
       isDrawing = false;
    }
  });
  canvas.addEventListener('mousemove', e => {
    if (!isDrawing) return;
    const tool = canvasState[groupName].tool;
    const x = e.offsetX; const y = e.offsetY;
    if (tool === 'pencil') { ctx.lineWidth = 3; ctx.globalCompositeOperation = 'source-over'; ctx.lineTo(x, y); ctx.stroke(); }
    else if (tool === 'eraser') { ctx.lineWidth = 20; ctx.globalCompositeOperation = 'destination-out'; ctx.lineTo(x, y); ctx.stroke(); ctx.globalCompositeOperation = 'source-over'; }
  });
  canvas.addEventListener('mouseup', e => {
    if (!isDrawing) return; isDrawing = false;
    const endX = e.offsetX; const endY = e.offsetY;
    const tool = canvasState[groupName].tool;
    ctx.lineWidth = 3; ctx.strokeStyle = '#2CA6E0'; ctx.globalCompositeOperation = 'source-over';
    if (tool === 'box' || tool === 'rect') { ctx.rect(startX, startY, endX - startX, (tool === 'box' ? endX - startX : endY - startY)); ctx.fill(); ctx.stroke(); }
    else if (tool === 'circle') { const r = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)); ctx.beginPath(); ctx.arc(startX, startY, r, 0, 2*Math.PI); ctx.fill(); ctx.stroke(); }
    else if (tool === 'triangle') { ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(endX, endY); ctx.lineTo(startX - (endX - startX), endY); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  });
}

function resetCanvasGroup(id1, id2) {
  if(confirm("Clear sketches?")) { [id1, id2].forEach(id => { const c = document.getElementById(id); if(c) c.getContext('2d').clearRect(0, 0, c.width, c.height); }); }
}

function handlePageFileUpload(pageName, input, listId) {
  if (input.files && input.files.length > 0) {
    if (!pageAttachments[pageName]) pageAttachments[pageName] = [];
    Array.from(input.files).forEach(f => pageAttachments[pageName].push(f));
    renderPageFileList(pageName, listId);
  }
}
function removePageFile(pageName, index, listId) {
  if (pageAttachments[pageName]) { pageAttachments[pageName].splice(index, 1); renderPageFileList(pageName, listId); }
}
function renderPageFileList(pageName, listId) {
  const container = document.getElementById(listId); if (!container) return;
  container.innerHTML = ''; const files = pageAttachments[pageName] || [];
  if (files.length === 0) { container.innerHTML = '<div style="font-size:0.75rem; color:var(--text-muted); text-align:center; margin-top:5px;">No files attached</div>'; return; }
  files.forEach((file, i) => {
    const div = document.createElement('div'); div.className = 'page-file-item';
    div.innerHTML = `<span>📎 ${file.name}</span>`;
    const delBtn = document.createElement('span'); delBtn.innerHTML = '&times;'; delBtn.className = 'delete-file-btn'; delBtn.onclick = () => removePageFile(pageName, i, listId);
    div.appendChild(delBtn); container.appendChild(div);
  });
}

// DOWNLOADING
async function downloadAllProjectAssets() {
  if (!confirm("Download all assets? (Allow multiple downloads if prompted)")) return;
  for (const page of state.pages) {
    const index = state.pages.indexOf(page);
    downloadPageSketchOnly(page, `cvs-m-${index}`, `cvs-d-${index}`);
    await new Promise(r => setTimeout(r, 800));
    const files = pageAttachments[page] || [];
    for (const file of files) {
      const link = document.createElement('a'); link.href = URL.createObjectURL(file); link.download = `[${page}] ${file.name}`;
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
      await new Promise(r => setTimeout(r, 500));
    }
  }
}
function downloadPageAssets(pageName, mId, dId) {
  downloadPageSketchOnly(pageName, mId, dId);
  const files = pageAttachments[pageName] || [];
  let delay = 500;
  files.forEach(file => { setTimeout(() => {
      const link = document.createElement('a'); link.href = URL.createObjectURL(file); link.download = file.name;
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
    }, delay); delay += 500;
  });
}
function downloadPageSketchOnly(pageName, mId, dId) {
  const m = document.getElementById(mId); const d = document.getElementById(dId);
  if (m && d) {
    const w = m.width + d.width + 20; const h = Math.max(m.height, d.height);
    const c = document.createElement('canvas'); c.width = w; c.height = h; const ctx = c.getContext('2d');
    ctx.fillStyle = '#0f1322'; ctx.fillRect(0,0,w,h);
    ctx.drawImage(m, 0, 0); ctx.drawImage(d, m.width + 20, 0);
    ctx.fillStyle = '#fff'; ctx.font = '20px Montserrat'; ctx.fillText("Mobile", 10, 30); ctx.fillText("Desktop", m.width + 30, 30);
    const link = document.createElement('a'); link.download = `${pageName}-layout-sketch.png`; link.href = c.toDataURL();
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  }
}

function togglePlanCard(header) { header.closest('.plan-card').classList.toggle('collapsed'); }
function changePageOrder(oldIndex, newIndexStr) {
  const newIndex = parseInt(newIndexStr); if (oldIndex === newIndex) return;
  saveAllCanvasStates();
  const item = state.pages.splice(oldIndex, 1)[0]; state.pages.splice(newIndex, 0, item);
  saveState(); initStep3();
}
function saveAllCanvasStates() {
  state.pages.forEach((page, idx) => {
    const m = document.getElementById(`cvs-m-${idx}`); const d = document.getElementById(`cvs-d-${idx}`);
    if (m && d) { if (!state.pagePlans[page]) state.pagePlans[page] = {}; state.pagePlans[page].mobileData = m.toDataURL(); state.pagePlans[page].desktopData = d.toDataURL(); }
  });
  saveState();
}
function restoreCanvasData(page, mId, dId) {
  const plan = state.pagePlans[page]; if (!plan) return;
  if (plan.mobileData) { const i = new Image(); i.onload = () => document.getElementById(mId).getContext('2d').drawImage(i,0,0); i.src = plan.mobileData; }
  if (plan.desktopData) { const i = new Image(); i.onload = () => document.getElementById(dId).getContext('2d').drawImage(i,0,0); i.src = plan.desktopData; }
}
function toggleBrandKit(element) { state.brandKit = !state.brandKit; document.querySelectorAll('.brand-kit-ref').forEach(el => el.classList.toggle('selected', state.brandKit)); calculateTotal(); updateBrandKitDisplay(); saveState(); }
function updateBrandKitDisplay() {
  document.querySelectorAll('.brand-kit-ref').forEach(bar => {
    const finalPriceEl = bar.querySelector('.bk-final-price'); if (!finalPriceEl) return;
    const hasBundle = !!(state.package && state.package.brandKitBundlePrice);
    finalPriceEl.textContent = `$${(hasBundle ? Number(state.package.brandKitBundlePrice) : BASE_BRAND_KIT_PRICE).toLocaleString()}`;
    bar.classList.toggle('selected', !!state.brandKit);
  });
}
function toggleWidget() { document.getElementById('floating-widget').classList.toggle('collapsed'); }
function togglePackageDetails(buttonEl) {
  const card = buttonEl.closest('.package-card'); if (card) { const expanded = card.classList.toggle('expanded'); buttonEl.textContent = expanded ? 'Close Details' : 'View Details'; }
}
function initCollapsibles() {
  document.querySelectorAll('[data-collapsible]').forEach(s => {
    const h = s.querySelector('[data-collapsible-header]');
    if (!h || h.hasAttribute('dhl')) return;
    h.setAttribute('dhl', 'true'); h.addEventListener('click', (e) => { e.preventDefault(); s.classList.toggle('collapsed'); });
  });
}
document.addEventListener('DOMContentLoaded', () => {
  loadState(); initCollapsibles();
  if (window.location.pathname.includes('step2')) { initPageBuilder(); if(state.package) handlePackageSelected(true); }
  if (window.location.pathname.includes('step3')) initStep3();
  calculateTotal(); updateBrandKitDisplay();
});
