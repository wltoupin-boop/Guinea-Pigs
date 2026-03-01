/* =========================================================
   Guinea Pig Paradise — Script
   ========================================================= */

// ---- Tab switching ----
const allTabBtns = document.querySelectorAll('.tab-btn');
const allPanels  = document.querySelectorAll('.tab-panel');

function switchTab(tabName) {
  // Update buttons
  allTabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  // Update panels
  allPanels.forEach(panel => {
    panel.classList.toggle('active', panel.id === `tab-${tabName}`);
  });
  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Close mobile nav
  mobileNav.classList.remove('open');
}

allTabBtns.forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// ---- Home page card / CTA navigation ----
document.querySelectorAll('[data-goto]').forEach(el => {
  el.addEventListener('click', () => switchTab(el.dataset.goto));
});

// ---- Mobile hamburger ----
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});

// ---- Add Video Modal ----
const modalOverlay = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');
const modalSave    = document.getElementById('modalSave');
const modalUrl     = document.getElementById('modalUrl');
const modalTitle   = document.getElementById('modalTitle');
const modalDesc    = document.getElementById('modalDesc');

let activeSection = null;

// Open modal
document.querySelectorAll('.add-video-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    activeSection = btn.dataset.section;
    modalUrl.value   = '';
    modalTitle.value = '';
    modalDesc.value  = '';
    modalOverlay.classList.add('open');
    modalUrl.focus();
  });
});

// Close modal
function closeModal() {
  modalOverlay.classList.remove('open');
  activeSection = null;
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// Save video
modalSave.addEventListener('click', () => {
  const url   = modalUrl.value.trim();
  const title = modalTitle.value.trim() || 'Guinea Pig Video';
  const desc  = modalDesc.value.trim() || '';

  if (!url) {
    modalUrl.focus();
    modalUrl.style.borderColor = '#ff8fab';
    return;
  }
  modalUrl.style.borderColor = '';

  const grid = document.getElementById(`video-grid-${activeSection}`);
  if (!grid) return;

  const card = document.createElement('div');
  card.className = 'video-card';
  card.innerHTML = `
    <div class="video-placeholder">
      <iframe
        src="${sanitizeUrl(url)}"
        title="${escapeHtml(title)}"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
    <div class="video-info">
      <h3 class="video-title">${escapeHtml(title)}</h3>
      <p class="video-desc">${escapeHtml(desc)}</p>
    </div>
  `;
  grid.appendChild(card);
  closeModal();
});

// ---- Helpers ----
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sanitizeUrl(url) {
  // Only allow youtube embed URLs
  try {
    const u = new URL(url);
    const allowed = ['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com'];
    if (allowed.includes(u.hostname) && u.pathname.startsWith('/embed/')) {
      return url;
    }
  } catch (_) { /* invalid url */ }
  return '';
}
