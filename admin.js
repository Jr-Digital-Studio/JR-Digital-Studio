// ===== JR Digital Studio - Admin Panel Script =====

const ADMIN_USER = '8128075345';
const ADMIN_PASS = 'Jiya@2026';

// ===== GITHUB CONFIGURATION (Secure LocalStorage Method) =====
const GH_USER = "Jr-Digital-Studio"; 
const GH_REPO = "JR-Digital-Studio"; 

// Yeh function aapke browser ke LocalStorage se token uthayega taaki GitHub kabhi block na kare
function getGhToken() {
  return localStorage.getItem('jr_gh_token') || "";
}

// ===== AUTH =====
function checkAuth() { return sessionStorage.getItem('jr_admin_auth') === 'true'; }

function login() {
  const u = document.getElementById('adminUser').value;
  const p = document.getElementById('adminPass').value;
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    sessionStorage.setItem('jr_admin_auth', 'true');
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminApp').style.display = 'flex';
    loadDashboard();
  } else {
    showAdminToast('❌ Galat username ya password', 'error');
  }
}

function logout() {
  sessionStorage.removeItem('jr_admin_auth');
  location.reload();
}

// ===== DATA FETCHING & SAVING =====
function getWorks() {
  try { return JSON.parse(localStorage.getItem('jr_works')) || getDefaultWorks(); }
  catch { return getDefaultWorks(); }
}
function saveWorks(works) { localStorage.setItem('jr_works', JSON.stringify(works)); }

function getPackages() {
  try { return JSON.parse(localStorage.getItem('jr_packages')) || getDefaultPackages(); }
  catch { return getDefaultPackages(); }
}
function savePackages(packages) { localStorage.setItem('jr_packages', JSON.stringify(packages)); }

// NEW: Reels Data Logic
function getReels() {
  try { return JSON.parse(localStorage.getItem('jr_reels_data')) || []; }
  catch { return []; }
}
function saveReels(reels) { localStorage.setItem('jr_reels_data', JSON.stringify(reels)); }

function getSeoSettings() {
  try { return JSON.parse(localStorage.getItem('jr_seo')) || {}; }
  catch { return {}; }
}
function saveSeoSettings(data) { localStorage.setItem('jr_seo', JSON.stringify(data)); }

function getDefaultWorks() {
  return [
    { id:1, title:"Restaurant Brand Identity", category:"branding", categoryLabel:"Branding", emoji:"🍽️", description:"Complete brand identity design", caption:"Professional brand identity for a restaurant chain.", keywords:["branding","logo","restaurant"], seoTitle:"Restaurant Branding", seoDesc:"Complete restaurant brand identity design", date:"2024-12-01" }
  ];
}

function getDefaultPackages() {
  return [
    { id:1, name:"Starter", price:"4,999", duration:"per month", featured:false, features:["5 Social Media Posts","1 Logo Design"] }
  ];
}

// ===== NAVIGATION =====
function showSection(id) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.admin-nav a').forEach(a => a.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelector(`[data-section="${id}"]`).classList.add('active');
  
  const titles = { 
      dashboard: 'Dashboard', 
      works: 'Manage Our Work', 
      packages: 'Manage Packages', 
      reels: 'Manage Reels & Shorts', // Added Reels Title
      seo: 'SEO Settings', 
      settings: 'Settings' 
  };
  document.getElementById('pageTitle').textContent = titles[id] || id;
}

// ===== DASHBOARD =====
function loadDashboard() {
  const works = getWorks();
  const pkgs = getPackages();
  document.getElementById('totalWorks').textContent = works.length;
  document.getElementById('totalPackages').textContent = pkgs.length;
  const cats = works.reduce((a,w) => { a[w.category] = (a[w.category]||0)+1; return a; }, {});
  document.getElementById('totalWeb').textContent = cats.web || 0;
  document.getElementById('totalBranding').textContent = cats.branding || 0;

  const recents = [...works].reverse().slice(0, 5);
  const tbody = document.getElementById('recentWorksTable');
  tbody.innerHTML = recents.map(w => `
    <tr>
      <td>${w.emoji||'🎨'} ${w.title}</td>
      <td><span class="badge badge-blue">${w.categoryLabel}</span></td>
      <td>${w.date||'N/A'}</td>
      <td>
        <button class="admin-btn admin-btn-primary" onclick="editWork(${w.id})" style="margin-right:6px">Edit</button>
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
      <td style="font-size:22px">${w.emoji||'🎨'}</td>
      <td>
        <strong>${w.title}</strong><br>
        <small style="color:rgba(255,255,255,0.38)">${w.caption ? w.caption.substring(0,50)+'...' : w.description||''}</small>
      </td>
      <td><span class="badge badge-blue">${w.categoryLabel}</span></td>
      <td style="color:rgba(255,255,255,0.4);font-size:12px">${w.date||'N/A'}</td>
      <td>
        <button class="admin-btn admin-btn-primary" onclick="editWork(${w.id})" style="margin-right:6px">✏️ Edit</button>
        <button class="admin-btn admin-btn-danger" onclick="deleteWork(${w.id})">🗑️ Delete</button>
      </td>
    </tr>
  `).join('');
}

function openAddWorkModal() {
  editingWorkId = null;
  document.getElementById('workModalTitle').textContent = '➕ Naya Work Add Karo';
  document.getElementById('workId').value = '';
  document.getElementById('workTitle').value = '';
  document.getElementById('workCategory').value = '';
  document.getElementById('workEmoji').value = '';
  document.getElementById('workDesc').value = '';
  document.getElementById('workCaption').value = '';
  document.getElementById('workKeywordsInput').value = '';
  document.getElementById('workSeoTitle').value = '';
  document.getElementById('workSeoDesc').value = '';
  document.getElementById('workDate').value = '';
  openModal('workModal');
}

function editWork(id) {
  const w = getWorks().find(x => x.id === id);
  if (!w) return;
  editingWorkId = id;
  document.getElementById('workModalTitle').textContent = '✏️ Work Edit Karo';
  document.getElementById('workId').value = w.id;
  document.getElementById('workTitle').value = w.title;
  document.getElementById('workCategory').value = w.category;
  document.getElementById('workEmoji').value = w.emoji||'';
  document.getElementById('workDesc').value = w.description||'';
  document.getElementById('workCaption').value = w.caption||'';
  document.getElementById('workKeywordsInput').value = (w.keywords||[]).join(', ');
  document.getElementById('workSeoTitle').value = w.seoTitle||'';
  document.getElementById('workSeoDesc').value = w.seoDesc||'';
  document.getElementById('workDate').value = w.date||'';
  openModal('workModal');
}

async function saveWork() {
  const title = document.getElementById('workTitle').value.trim();
  const category = document.getElementById('workCategory').value;
  if (!title || !category) { showAdminToast('❌ Title aur category zaroori hain', 'error'); return; }

  showAdminToast("⏳ GitHub par sync ho raha hai...", "success");

  try {
    const catLabels = { web:'Web Design', branding:'Branding', social:'Social Media', print:'Print Design', video:'Video' };
    const works = getWorks();
    
    let kwRaw = document.getElementById('workKeywordsInput').value.trim();
    let keywords = kwRaw ? kwRaw.split(',').map(k=>k.trim().replace(/^#/,'')).filter(Boolean) : [category, 'digital agency', 'mehsana', 'gujarat'];

    let seoTitle = document.getElementById('workSeoTitle').value.trim();
    if (!seoTitle) seoTitle = `${title} - ${catLabels[category] || 'Digital Service'} | JR Digital Studio`;

    let seoDesc = document.getElementById('workSeoDesc').value.trim();
    if (!seoDesc) seoDesc = `Explore ${title}, a professional ${catLabels[category] || 'digital'} project by JR Digital Studio in Mehsana & Gujarat. Get custom solutions.`;

    let imagePath = "";
    const imageFileElem = document.getElementById('workImageFile');
    if (imageFileElem && imageFileElem.files && imageFileElem.files[0]) {
      const imageFile = imageFileElem.files[0];
      const fileName = `images/work-${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
      const base64Image = await toBase64(imageFile);
      const base64Content = base64Image.split(',')[1];

      await githubApiRequest(`contents/${fileName}`, 'PUT', {
        message: `Upload new project image: ${fileName}`,
        content: base64Content,
        branch: 'main'
      });
      imagePath = fileName;
    } else if (editingWorkId) {
      const existingWork = works.find(w => w.id === editingWorkId);
      if (existingWork) imagePath = existingWork.image || "";
    }

    const workData = {
      title, category,
      categoryLabel: catLabels[category]||category,
      emoji: document.getElementById('workEmoji').value||'🎨',
      description: document.getElementById('workDesc').value.trim() || title,
      caption: document.getElementById('workCaption').value.trim() || title,
      keywords, seoTitle, seoDesc,
      date: document.getElementById('workDate').value || new Date().toISOString().split('T')[0],
      image: imagePath
    };

    if (editingWorkId) {
      const idx = works.findIndex(w => w.id === editingWorkId);
      if (idx !== -1) works[idx] = { ...works[idx], ...workData };
    } else {
      workData.id = Date.now();
      works.push(workData);
    }
    saveWorks(works);

    // Sync all data to GitHub
    const packages = getPackages();
    const reels = getReels(); // Include reels so they aren't lost
    const fullJsonData = JSON.stringify({ works, packages, reels }, null, 2);
    
    const fileInfo = await githubApiRequest('contents/works-data.json', 'GET');
    await githubApiRequest('contents/works-data.json', 'PUT', {
      message: 'Update works-data.json via Admin Panel',
      content: btoa(unescape(encodeURIComponent(fullJsonData))),
      sha: fileInfo.sha,
      branch: 'main'
    });

    closeModal('workModal');
    loadWorksTable();
    loadDashboard();
    showAdminToast('✅ Sab kuch aur Auto-SEO successfully live ho gaya!');

  } catch (error) {
    console.error(error);
    showAdminToast("❌ Error: " + error.message, "error");
  }
}

async function deleteWork(id) {
  if (!confirm('Yeh work item delete karna chahte ho?')) return;
  saveWorks(getWorks().filter(w => w.id !== id));
  loadWorksTable();
  loadDashboard();
  showAdminToast('🗑️ Work delete ho gaya (Note: GitHub json mein tab update hoga jab naya work add karenge)');
}

// ===== REELS MANAGEMENT (NEW) =====
function loadReelsTable() {
  const reels = getReels();
  const tbody = document.getElementById('reelsTableBody');
  
  if (reels.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:rgba(255,255,255,0.3);padding:20px">No reels added yet. Click 'Naya Reel Add Karo'</td></tr>`;
    return;
  }

  tbody.innerHTML = reels.map(r => `
    <tr>
      <td>
        <div style="width:40px;height:40px;background:#1E2D4A;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;">🎬</div>
      </td>
      <td>
        <strong>${r.title}</strong><br>
        <a href="${r.embedUrl}" target="_blank" style="font-size:11px;color:#4D8EFF;text-decoration:none;">🔗 View Link</a>
      </td>
      <td><span class="badge badge-blue">${r.category || 'Reel'}</span></td>
      <td style="color:rgba(255,255,255,0.4);font-size:12px">${r.date||'N/A'}</td>
      <td>
        <button class="admin-btn admin-btn-danger" onclick="deleteReel(${r.id})">🗑️ Delete</button>
      </td>
    </tr>
  `).join('');
}

function openAddReelModal() {
  document.getElementById('reelTitle').value = '';
  document.getElementById('reelUrl').value = '';
  document.getElementById('reelCategory').value = '';
  openModal('reelModal');
}

async function saveReelData() {
  const title = document.getElementById('reelTitle').value.trim();
  const embedUrl = document.getElementById('reelUrl').value.trim();
  const category = document.getElementById('reelCategory').value.trim() || 'Reel';

  if (!title || !embedUrl) {
    showAdminToast('❌ Title aur URL zaroori hain', 'error');
    return;
  }

  showAdminToast("⏳ GitHub par Reel sync ho rahi hai...", "success");

  try {
    const reels = getReels();
    const newReel = {
      id: Date.now(),
      title,
      embedUrl,
      category,
      date: new Date().toISOString().split('T')[0]
    };

    reels.unshift(newReel); // Naya reel sabse upar
    saveReels(reels);

    // Sync to GitHub JSON
    const works = getWorks();
    const packages = getPackages();
    const fullJsonData = JSON.stringify({ works, packages, reels }, null, 2);

    const fileInfo = await githubApiRequest('contents/works-data.json', 'GET');
    await githubApiRequest('contents/works-data.json', 'PUT', {
      message: 'Added new Reel via Admin Panel',
      content: btoa(unescape(encodeURIComponent(fullJsonData))),
      sha: fileInfo.sha,
      branch: 'main'
    });

    closeModal('reelModal');
    loadReelsTable();
    showAdminToast('✅ Reel successfully live ho gayi!');

  } catch (error) {
    console.error(error);
    showAdminToast("❌ Error: " + error.message, "error");
  }
}

async function deleteReel(id) {
  if (!confirm('Yeh Reel website se delete karna chahte ho?')) return;
  showAdminToast("⏳ GitHub par sync ho raha hai...", "success");

  try {
    const reels = getReels().filter(r => r.id !== id);
    saveReels(reels);

    const works = getWorks();
    const packages = getPackages();
    const fullJsonData = JSON.stringify({ works, packages, reels }, null, 2);

    const fileInfo = await githubApiRequest('contents/works-data.json', 'GET');
    await githubApiRequest('contents/works-data.json', 'PUT', {
      message: 'Deleted Reel via Admin Panel',
      content: btoa(unescape(encodeURIComponent(fullJsonData))),
      sha: fileInfo.sha,
      branch: 'main'
    });

    loadReelsTable();
    showAdminToast('🗑️ Reel delete ho gayi aur GitHub par update ho gaya');
  } catch (error) {
    console.error(error);
    showAdminToast("❌ Error: " + error.message, "error");
  }
}

// ===== PACKAGES =====
let editingPkgId = null;

function loadPackagesTable() {
  const packages = getPackages();
  document.getElementById('packagesTableBody').innerHTML = packages.map(pkg => `
    <tr>
      <td><strong>${pkg.name}</strong>${pkg.featured?' <span class="badge badge-green">⭐ Featured</span>':''}</td>
      <td style="font-family:'Raleway',sans-serif;font-weight:900;color:#00C2FF">₹${pkg.price}</td>
      <td style="color:rgba(255,255,255,0.45)">${pkg.duration}</td>
      <td style="color:rgba(255,255,255,0.45)">${pkg.features.length} features</td>
      <td>
        <button class="admin-btn admin-btn-primary" onclick="editPackage(${pkg.id})" style="margin-right:6px">✏️ Edit</button>
        <button class="admin-btn admin-btn-danger" onclick="deletePackage(${pkg.id})">🗑️ Delete</button>
      </td>
    </tr>
  `).join('');
}

function openAddPackageModal() {
  editingPkgId = null;
  document.getElementById('pkgModalTitle').textContent = '➕ Naya Package Add Karo';
  document.getElementById('pkgId').value = '';
  document.getElementById('pkgName').value = '';
  document.getElementById('pkgPrice').value = '';
  document.getElementById('pkgDuration').value = 'per month';
  document.getElementById('pkgFeatured').checked = false;
  document.getElementById('pkgFeaturesInput').value = '';
  openModal('pkgModal');
}

function editPackage(id) {
  const pkg = getPackages().find(p => p.id === id);
  if (!pkg) return;
  editingPkgId = id;
  document.getElementById('pkgModalTitle').textContent = '✏️ Package Edit Karo';
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
  if (!name || !price) { showAdminToast('❌ Name aur price zaroori hain', 'error'); return; }
  const features = document.getElementById('pkgFeaturesInput').value.trim().split('\n').map(f=>f.trim()).filter(Boolean);
  if (!features.length) { showAdminToast('❌ Kam se kam ek feature add karo', 'error'); return; }

  const packages = getPackages();
  const pkgData = {
    name, price,
    duration: document.getElementById('pkgDuration').value.trim()||'per month',
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
  showAdminToast('✅ Package save ho gaya!');
}

function deletePackage(id) {
  if (!confirm('Package delete karna chahte ho?')) return;
  savePackages(getPackages().filter(p => p.id !== id));
  loadPackagesTable();
  loadDashboard();
  showAdminToast('🗑️ Package delete ho gaya');
}

// ===== SEO SETTINGS =====
function loadSeoSettings() {
  const seo = getSeoSettings();
  document.getElementById('seoSiteName').value = seo.siteName||'JR Digital Studio';
  document.getElementById('seoHomeTitle').value = seo.homeTitle||'JR Digital Studio | Creative Digital Agency';
  document.getElementById('seoHomeDesc').value = seo.homeDesc||'JR Digital Studio - Web Design, Branding, Social Media & SEO Services';
  document.getElementById('seoKeywords').value = seo.keywords||'digital agency, web design, logo design, social media, SEO, Gujarat';
  document.getElementById('seoAuthor').value = seo.author||'JR Digital Studio';
  document.getElementById('seoFbPage').value = seo.fbPage||'';
  document.getElementById('seoInstaPage').value = seo.instaPage||'';
}

function saveSeoForm() {
  const seo = {
    siteName: document.getElementById('seoSiteName').value,
    homeTitle: document.getElementById('seoHomeTitle').value,
    homeDesc: document.getElementById('seoHomeDesc').value,
    keywords: document.getElementById('seoKeywords').value,
    author: document.getElementById('seoAuthor').value,
    fbPage: document.getElementById('seoFbPage').value,
    instaPage: document.getElementById('seoInstaPage').value,
  };
  saveSeoSettings(seo);
  showAdminToast('✅ SEO settings save ho gayi!');
}

// ===== UTILS & HELPERS =====
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function showAdminToast(msg, type='success') {
  let t = document.querySelector('.admin-toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'admin-toast';
    t.style.cssText = 'position:fixed;bottom:28px;right:28px;z-index:9999;padding:12px 22px;border-radius:12px;font-size:13px;font-weight:700;transition:all 0.3s ease;transform:translateY(20px);opacity:0;pointer-events:none;color:white;box-shadow:0 6px 28px rgba(0,0,0,0.3);font-family:Nunito,sans-serif';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.background = type==='error'?'#FF3D57':'#00C853';
  requestAnimationFrame(() => {
    t.style.transform='translateY(0)';t.style.opacity='1';
    setTimeout(()=>{t.style.transform='translateY(20px)';t.style.opacity='0';},3200);
  });
}

const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

async function githubApiRequest(endpoint, method, bodyData = null) {
  const token = getGhToken();
  if (!token) {
    throw new Error('GitHub Token set nahi hai! Pehle settings mein token save karein.');
  }
  const url = `https://api.github.com/repos/${GH_USER}/${GH_REPO}/${endpoint}`;
  const options = {
    method: method,
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    }
  };
  if (bodyData) options.body = JSON.stringify(bodyData);

  const response = await fetch(url, options);
  if (!response.ok) {
    const errRes = await response.json();
    throw new Error(errRes.message || 'GitHub API Error');
  }
  return response.json();
}

// ===== SETTINGS & EXPORT =====
function saveSettings() { showAdminToast('✅ Settings save ho gayi!'); }

function resetData() {
  if (!confirm('Sabhi data default par reset ho jayega. Pakka?')) return;
  localStorage.removeItem('jr_works');
  localStorage.removeItem('jr_packages');
  localStorage.removeItem('jr_reels_data');
  localStorage.removeItem('jr_seo');
  loadDashboard(); loadWorksTable(); loadPackagesTable(); loadReelsTable(); loadSeoSettings();
  showAdminToast('✅ Data reset ho gaya');
}

function exportLiveJson() {
  const fullData = {
      works: getWorks(),
      packages: getPackages(),
      reels: getReels() // Reels data ab download JSON me aayega
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullData, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "works-data.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();

  showAdminToast("✅ JSON File Download ho gayi!");
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  if (checkAuth()) {
    document.getElementById('loginScreen').style.display='none';
    document.getElementById('adminApp').style.display='flex';
    loadDashboard();
  }
  document.getElementById('adminPass')?.addEventListener('keypress',(e)=>{ if(e.key==='Enter') login(); });
  document.getElementById('adminUser')?.addEventListener('keypress',(e)=>{ if(e.key==='Enter') login(); });
});
