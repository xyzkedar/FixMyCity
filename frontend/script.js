/**
 * FixMyCity — Core Application Logic
 * Handles: Navigation, Modals, Forms, and UI State
 */

// --- NAVIGATION & PAGE ROUTING ---
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Show target page
  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);
  }
  // Update Nav links UI
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
}

// --- MODAL CONTROLS ---
function openModal(id) {
  const modal = document.getElementById('modal-' + id);
  if (modal) modal.classList.add('open');
}

function closeModal(id) {
  const modal = document.getElementById('modal-' + id);
  if (modal) modal.classList.remove('open');
}

// --- FORM INTERACTIONS ---
function switchTab(el, type) {
  const parent = el.closest('.modal');
  parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

function selectCat(el) {
  document.querySelectorAll('.cat-opt').forEach(o => o.classList.remove('sel'));
  el.classList.add('sel');
}

function selectSev(el, sev) {
  document.querySelectorAll('.sev-opt').forEach(o => o.classList.remove('sel'));
  el.classList.add('sel');
}

// --- MOCK API ACTIONS ---
function submitReport() {
  closeModal('report');
  showToast('✅ Report submitted! Authorities notified.');
}

function handleSignup(type) {
  closeModal(type);
  if (type === 'citizen') {
    showPage('feed');
    setTimeout(() => {
      openModal('report');
      showToast('🎉 Welcome! Now file your first report 📍');
    }, 400);
  } else {
    showPage('dashboard');
    showToast('🏛 Authority registered! Pending verification.');
  }
}

function handleLogin(type) {
  closeModal(type);
  if (type === 'citizen') {
    showPage('feed');
    showToast('🔓 Logged in! Report a problem anytime.');
  } else {
    showPage('dashboard');
    showToast('🏛 Welcome back, Authority!');
  }
}

// --- UTILITIES (TOAST) ---
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3000);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  console.log("FixMyCity Initialized");
});
// Initialize Supabase Client
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// --- UPDATED SIGNUP LOGIC ---
async function handleSignup(type) {
  const email = document.querySelector(`#modal-${type} input[type="email"]`).value;
  const password = document.querySelector(`#modal-${type} input[type="password"]`).value;

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    showToast(`❌ Error: ${error.message}`);
  } else {
    showToast('🎉 Account created! Check your email.');
    closeModal(type);
    showPage('feed');
  }
}

// --- UPDATED LOGIN LOGIC ---
async function handleLogin(type) {
  const email = document.querySelector(`#modal-${type} input[type="email"]`).value;
  const password = document.querySelector(`#modal-${type} input[type="password"]`).value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    showToast(`❌ Login Failed: ${error.message}`);
  } else {
    showToast('🔓 Welcome back!');
    closeModal(type);
    showPage(type === 'citizen' ? 'feed' : 'dashboard');
  }
}