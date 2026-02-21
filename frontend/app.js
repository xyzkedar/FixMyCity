/**
 * FixMyCity — Core Application Logic
 * Integrates UI interactions with Supabase Backend
 */

// --- SUPABASE CONFIGURATION ---
// You will replace these with your actual keys from the Supabase Dashboard
const SUPABASE_URL = 'https://wfajevdditvelmzlkgmi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmYWpldmRkaXR2ZWxtemxrZ21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MjEyMjEsImV4cCI6MjA4NzA5NzIyMX0.Rzxlfc1bp5LWlU3VlmmVfIEnIY8ChvIE99GEzbchRWQ';
// const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- NAVIGATION & PAGE ROUTING ---
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);
  }
  
  // Update Nav links UI
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  
  // Refresh data if entering feed or dashboard
  if(pageId === 'feed') fetchReports();
  if(pageId === 'dashboard') fetchStats();
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

// --- DATA ACTIONS (SUPABASE INTEGRATION POINTS) ---

async function handleSignup(type) {
  // TODO: Use supabase.auth.signUp({ email, password })
  console.log(`Signing up as ${type}...`);
  closeModal(type);
  showPage(type === 'citizen' ? 'feed' : 'dashboard');
  showToast(`Welcome to FixMyCity!`);
}

async function handleLogin(type) {
  // TODO: Use supabase.auth.signInWithPassword({ email, password })
  console.log(`Logging in as ${type}...`);
  closeModal(type);
  showPage(type === 'citizen' ? 'feed' : 'dashboard');
}

async function submitReport() {
  // TODO: Use supabase.from('reports').insert([{ title, category, severity, lat, long }])
  showToast('✅ Report submitted! Syncing with database...');
  closeModal('report');
}

async function fetchReports() {
  // TODO: Use supabase.from('reports').select('*').order('created_at')
  console.log("Fetching live reports from Supabase...");
}

// --- UI UTILITIES ---

function selectCat(el) {
  document.querySelectorAll('.cat-opt').forEach(o => o.classList.remove('sel'));
  el.classList.add('sel');
}

function selectSev(el, sev) {
  document.querySelectorAll('.sev-opt').forEach(o => o.classList.remove('sel'));
  el.classList.add('sel');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  console.log("FixMyCity Prototype Ready for Supabase");
});