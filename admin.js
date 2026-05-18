// ===== JR Digital Studio - Admin Panel Script =====

const ADMIN_USER = 'jradmin';
const ADMIN_PASS = 'jrdigital2025'; // Change this password!

// ===== AUTH =====
function checkAuth() {
  return sessionStorage.getItem('jr_admin_auth') === 'true';
}

function login() {
  const u = document.getElementById('adminUser').value;
  const p = document.getElementById('adminPass').value;
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    sessionStorage.setItem('jr_admin_auth', 'true');
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminApp').style.display = 'flex';
    loadDashboard();
  } else {
    showAdminToast('❌ Invalid username or password', 'error');
  }
}

function logout() {
  sessionStorage.removeItem('jr_admin_auth');
  location.reload();
}

// ===== DATA MANAGEMENT =====
function getWorks() {
  try {
    return JSON.parse(localStorage.getItem('jr_works')) || getDefaultWorks();
  } catch { return getDefaultWorks(); }
}

function saveWorks(works) {
  localStorage.setItem('jr_works', JSON.stringify(works));
}

function getPackages() {
  try {
    return JSON.parse(localStorage.getItem('jr_packages')) || getDefaultPackages();
  } catch { return getDefaultPackages(); }
}

function savePackages(packages) {
  localStorage.setItem('jr_packages', JSON.stringify(packages));
}

function getDefaultWorks() {
  return [
    { id:1, title:"Restaurant Brand Identity", category:"branding", categoryLabel:"Branding", emoji:"🍽️", description:"Complete brand identity design", date:"2024-12-01" },
    { id:2, title:"E-Commerce Website", category:"web", categoryLabel:"Web Design", emoji:"🛒", description:"Full e-commerce with custom UI", date:"2024-11-15" },
    { id:3, title:"Social Media Campaign", category:"social", categoryLabel:"Social Media", emoji:"📱", description:"30-day social media campaign", date:"2024-11-01" },
    { id:4, title:"Corporate Logo Design", category:"branding", categoryLabel:"Branding", emoji:"✏️", description:"Minimalist logo for tech startup", date:"2024-10-20" },
    { id:5, title:"YouTube Channel Art", category:"social", categoryLabel:"Social Media", emoji:"🎬", description:"YouTube branding complete kit", date:"2024-10-10" },
    { id:6, title:"Real Estate Website", category:"web", categoryLabel:"Web Design", emoji:"🏠", description:"Modern real estate listing site", date:"2024-09-25" }
  ];
}

function getDefaultPackages() {
  return [
    { id:1, name:"Starter", price:"4,999", duration:"per month", featured:false, features:["5 Social Media Posts","1 Logo Design","Basic SEO Setup","WhatsApp Support","1 Revision Round"] },
    { id:2, name:"Professional", price:"9,999", duration:"per month", featured:true, features:["15 Social Media Posts","Complete Brand Identity","Full SEO Optimization","Website Design (5 Pages)","Priority Support 24/7","3 Revision Rounds","Monthly Report"] },
    { id:3, name:"Enterprise", price:"19,999", duration:"per month", featured:false, features:["Unlimited Social Posts","Full Branding Suite","Advanced SEO + Ads","Custom Website","Dedicated Manager","Unlimited Revisions","Weekly Reports"] }
  ];
}

// ===== NAVIGATION =====
function showSection(id) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.admin-nav a').forEach(a => a.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelector(`[data-section="${id}"]`).classList.add('active');
  // Update title
  const titles = { dashboard:'Dashboard', works:'Manage Our Work', packages:'Manage Packages', settings:'Settings' };
  document.getElementById('pageTitle').textContent = titles[id] || id;
}

// ===== DASHBOARD =====
function loadDashboard() {
  const works = getWorks();
  const pkgs = getPackages();
  document.getElementById('totalWorks').textContent = works.length;
  document.getElementById('totalPackages').textContent = pkgs.length;

  // Category counts
  const cats = works.reduce((a,w) => { a[w.category] = (a[w.category]||0)+1; return a; }, {});
  document.getElementById('totalWeb').textContent = cats.web || 0;
  document.getElementById('totalBranding').textContent = cats.branding || 0;

  // Recent works
  const recents = [...works].reverse().slice(0, 5);
  const tbody = document.getElementById('recentWorksTable');
  tbody.innerHTML = recents.map(w => `
    <tr>
      <td>${w.emoji || '🎨'} ${w.title}</td>
      <td><span class="badge badge-blue">${w.categoryLabel}</span></td>
      <td>${w.date || 'N/A'}</td>
      <td>
        <button class="admin-btn admin-btn-primary" onclick="editWork(${w.id})" style="margin-right:6px">Edit</button>
        <button class="admin-btn admin-btn-danger" onclick="deleteWork(${w.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

// ===== WORKS MANAGEMENT =====
let editingWorkId = null;

function loadWorksTable() {
  const works = getWorks();
  const tbody = document.getElementById('worksTableBody');
  tbody.innerHTML = works.map(w => `
    <tr>
      <td style="font-size:24px">${w.emoji || '🎨'}</td>
      <td><strong>${w.title}</strong><br><small style="color:rgba(255,255,255,0.4)">${w.description || ''}</small></td>
      <td><span class="badge badge-blue">${w.categoryLabel}</span></td>
      <td style="color:rgba(255,255,255,0.5)">${w.date || 'N/A'}</td>
      <td>
        <button class="admin-btn admin-btn-primary" onclick="editWork(${w.id})" style="margin-right:6px">✏️ Edit</button>
        <button class="admin-btn admin-btn-danger" onclick="deleteWork(${w.id})">🗑️ Delete</button>
      </td>
    </tr>
  `).join('');
}

function openAddWorkModal() {
  editingWorkId = null;
  document.getElementById('workModalTitle').textContent = '➕ Add New Work';
  document.getElementById('workForm').reset();
  document.getElementById('workId').value = '';
  openModal('workModal');
}

function editWork(id) {
  const works = getWorks();
  const w = works.find(x => x.id === id);
  if (!w) return;
  editingWorkId = id;
  document.getElementById('workModalTitle').textContent = '✏️ Edit Work';
  document.getElementById('workId').value = w.id;
  document.getElementById('workTitle').value = w.title;
  document.getElementById('workCategory').value = w.category;
  document.getElementById('workEmoji').value = w.emoji || '';
  document.getElementById('workDesc').value = w.description || '';
  document.getElementById('workDate').value = w.date || '';
  openModal('workModal');
}

function saveWork() {
  const title = document.getElementById('workTitle').value.trim();
  const category = document.getElementById('workCategory').value;
  if (!title || !category) { showAdminToast('❌ Title and category are required', 'error'); return; }

  const catLabels = { web:'Web Design', branding:'Branding', social:'Social Media', print:'Print Design', video:'Video' };
  const works = getWorks();

  const workData = {
    title,
    category,
    categoryLabel: catLabels[category] || category,
    emoji: document.getElementById('workEmoji').value || '🎨',
    description: document.getElementById('workDesc').value.trim(),
    date: document.getElementById('workDate').value || new Date().toISOString().split('T')[0],
    image: ''
  };

  if (editingWorkId) {
    const idx = works.findIndex(w => w.id === editingWorkId);
    if (idx !== -1) { works[idx] = { ...works[idx], ...workData }; }
  } else {
    workData.id = Date.now();
    works.push(workData);
  }

  saveWorks(works);
  closeModal('workModal');
  loadWorksTable();
  loadDashboard();
  showAdminToast('✅ Work saved successfully!');
}

function deleteWork(id) {
  if (!confirm('Are you sure you want to delete this work item?')) return;
  const works = getWorks().filter(w => w.id !== id);
  saveWorks(works);
  loadWorksTable();
  loadDashboard();
  showAdminToast('🗑️ Work deleted');
}

// ===== PACKAGES MANAGEMENT =====
let editingPkgId = null;

function loadPackagesTable() {
  const packages = getPackages();
  const tbody = document.getElementById('packagesTableBody');
  tbody.innerHTML = packages.map(pkg => `
    <tr>
      <td><strong>${pkg.name}</strong>${pkg.featured ? ' <span class="badge badge-green">⭐ Featured</span>' : ''}</td>
      <td style="font-family:'Syne',sans-serif;font-weight:700;color:var(--accent)">₹${pkg.price}</td>
      <td style="color:rgba(255,255,255,0.5)">${pkg.duration}</td>
      <td style="color:rgba(255,255,255,0.5)">${pkg.features.length} features</td>
      <td>
        <button class="admin-btn admin-btn-primary" onclick="editPackage(${pkg.id})" style="margin-right:6px">✏️ Edit</button>
        <button class="admin-btn admin-btn-danger" onclick="deletePackage(${pkg.id})">🗑️ Delete</button>
      </td>
    </tr>
  `).join('');
}

function openAddPackageModal() {
  editingPkgId = null;
  document.getElementById('pkgModalTitle').textContent = '➕ Add New Package';
  document.getElementById('pkgForm').reset();
  document.getElementById('pkgId').value = '';
  document.getElementById('pkgFeaturesInput').value = '';
  openModal('pkgModal');
}

function editPackage(id) {
  const packages = getPackages();
  const pkg = packages.find(p => p.id === id);
  if (!pkg) return;
  editingPkgId = id;
  document.getElementById('pkgModalTitle').textContent = '✏️ Edit Package';
  document.getElementById('pkgId').value = pkg.id;
  document.getElementById('pkgName').value = pkg.name;
  document.getElementById('pkgPrice').value = pkg.price;
  document.getElementById('pkgDuration').value = pkg.duration;
  document.getElementById('pkgFeatured').checked = pkg.featured;
  document.getElementById('pkgFeaturesInput').value = pkg.features.join('\n');
  openModal('pkgModal');
}

function savePackage() {
  const name = document.getElementById('pkgName').value.trim();
  const price = document.getElementById('pkgPrice').value.trim();
  if (!name || !price) { showAdminToast('❌ Name and price are required', 'error'); return; }

  const featuresRaw = document.getElementById('pkgFeaturesInput').value.trim();
  const features = featuresRaw.split('\n').map(f => f.trim()).filter(Boolean);
  if (features.length === 0) { showAdminToast('❌ Add at least one feature', 'error'); return; }

  const packages = getPackages();
  const pkgData = {
    name,
    price,
    duration: document.getElementById('pkgDuration').value.trim() || 'per month',
    featured: document.getElementById('pkgFeatured').checked,
    features
  };

  if (editingPkgId) {
    const idx = packages.findIndex(p => p.id === editingPkgId);
    if (idx !== -1) packages[idx] = { ...packages[idx], ...pkgData };
  } else {
    pkgData.id = Date.now();
    packages.push(pkgData);
  }

  savePackages(packages);
  closeModal('pkgModal');
  loadPackagesTable();
  loadDashboard();
  showAdminToast('✅ Package saved successfully!');
}

function deletePackage(id) {
  if (!confirm('Delete this package?')) return;
  const packages = getPackages().filter(p => p.id !== id);
  savePackages(packages);
  loadPackagesTable();
  loadDashboard();
  showAdminToast('🗑️ Package deleted');
}

// ===== MODAL =====
function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

// ===== TOAST =====
function showAdminToast(msg, type = 'success') {
  let toast = document.querySelector('.admin-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'admin-toast';
    toast.style.cssText = 'position:fixed;bottom:32px;right:32px;z-index:9999;padding:14px 24px;border-radius:12px;font-size:14px;font-weight:600;transition:all 0.3s ease;transform:translateY(20px);opacity:0;pointer-events:none;color:white;box-shadow:0 8px 32px rgba(0,0,0,0.3)';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.background = type === 'error' ? '#FF3D57' : '#00C853';
  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    setTimeout(() => {
      toast.style.transform = 'translateY(20px)';
      toast.style.opacity = '0';
    }, 3500);
  });
}

// ===== SETTINGS =====
function saveSettings() {
  showAdminToast('✅ Settings saved!');
}

function resetData() {
  if (!confirm('This will reset ALL portfolio and package data to defaults. Are you sure?')) return;
  localStorage.removeItem('jr_works');
  localStorage.removeItem('jr_packages');
  loadDashboard();
  loadWorksTable();
  loadPackagesTable();
  showAdminToast('✅ Data reset to defaults');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  if (checkAuth()) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminApp').style.display = 'flex';
    loadDashboard();
  }

  // Enter key for login
  document.getElementById('adminPass')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') login();
  });
});
