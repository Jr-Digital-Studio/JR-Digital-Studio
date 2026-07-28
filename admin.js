// ===== JR Digital Studio - Admin Panel Script =====

const ADMIN_USER = '8128075345';
const ADMIN_PASS = 'Jiya@2026';

// GitHub Configuration (Aapki details set hain)
// GitHub Configuration
const GH_USER = "Jr-Digital-Studio"; 
const GH_REPO = "JR-Digital-Studio"; 
const GH_TOKEN = "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";

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

// ===== DATA =====
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

function getSeoSettings() {
  try { return JSON.parse(localStorage.getItem('jr_seo')) || {}; }
  catch { return {}; }
}
function saveSeoSettings(data) { localStorage.setItem('jr_seo', JSON.stringify(data)); }

function getDefaultWorks() {
  return [
    { id:1, title:"Restaurant Brand Identity", category:"branding", categoryLabel:"Branding", emoji:"🍽️", description:"Complete brand identity design", caption:"Professional brand identity for a restaurant chain. Logo, colors, menu design sab kuch ek hi package mein.", keywords:["branding","logo","restaurant","identity"], seoTitle:"Restaurant Branding - JR Digital Studio", seoDesc:"Complete restaurant brand identity design", date:"2024-12-01" },
    { id:2, title:"E-Commerce Website", category:"web", categoryLabel:"Web Design", emoji:"🛒", description:"Full e-commerce with custom UI", caption:"Fully functional e-commerce website with beautiful UI, product pages aur checkout system.", keywords:["website","ecommerce","webdesign","shopping"], seoTitle:"E-Commerce Website Design", seoDesc:"Custom e-commerce website development", date:"2024-11-15" },
    { id:3, title:"Social Media Campaign", category:"social", categoryLabel:"Social Media", emoji:"📱", description:"30-day social media campaign", caption:"30 din ka social media campaign jisme 90+ posts, reels aur stories shamil hain.", keywords:["socialmedia","instagram","campaign","marketing"], seoTitle:"Social Media Campaign", seoDesc:"30-day social media marketing campaign", date:"2024-11-01" },
    { id:4, title:"Corporate Logo Design", category:"branding", categoryLabel:"Branding", emoji:"✏️", description:"Minimalist logo for tech startup", caption:"Clean aur minimal logo design for a tech company. Multiple concepts diye aur final version SVG format mein deliver kiya.", keywords:["logo","logodesign","branding","startup"], seoTitle:"Corporate Logo Design", seoDesc:"Professional logo design for tech startup", date:"2024-10-20" },
    { id:5, title:"YouTube Channel Art", category:"social", categoryLabel:"Social Media", emoji:"🎬", description:"YouTube branding complete kit", caption:"Complete YouTube channel branding - banner, thumbnails, intro template aur logo.", keywords:["youtube","thumbnail","channelart","content"], seoTitle:"YouTube Branding Kit", seoDesc:"Complete YouTube channel art and branding", date:"2024-10-10" },
    { id:6, title:"Real Estate Website", category:"web", categoryLabel:"Web Design", emoji:"🏠", description:"Modern real estate listing site", caption:"Modern real estate website with property listings, search filters aur contact forms.", keywords:["realestate","website","property","webdesign"], seoTitle:"Real Estate Website Design", seoDesc:"Modern property listing website development", date:"2024-09-25" }
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
  const titles = { dashboard:'Dashboard', works:'Manage Our Work', packages:'Manage Packages', seo:'SEO Settings', settings:'Settings' };
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
      <td style="font-size:22px">${w.emoji||'🎨'}</td>
      <td>
        <strong>${w.title}</strong><br>
        <small style="color:rgba(255,255,255,0.38)">${w.caption ? w.caption.substring(0,50)+'...' : w.description||''}</small><br>
        <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">
           ${(w.keywords||[]).map(k=>`<span style="background:rgba(0,87,255,0.2);color:#4D8EFF;padding:1px 6px;border-radius:4px;font-size:10px;font-weight:700">#${k}</span>`).join('')}
        </div>
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
  
  // Fields ko manually clear karna
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

// ===== UPDATED SAVE WORK WITH GITHUB API AUTO-PUSH & PHOTO UPLOAD =====
async function saveWork() {
  const title = document.getElementById('workTitle').value.trim();
  const category = document.getElementById('workCategory').value;
  if (!title || !category) { showAdminToast('❌ Title aur category zaroori hain', 'error'); return; }

  showAdminToast("⏳ GitHub par sync ho raha hai...", "success");

  try {
    const catLabels = { web:'Web Design', branding:'Branding', social:'Social Media', print:'Print Design', video:'Video' };
    const works = getWorks();
    const kwRaw = document.getElementById('workKeywordsInput').value;
    const keywords = kwRaw.split(',').map(k=>k.trim().replace(/^#/,'')).filter(Boolean);

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
      description: document.getElementById('workDesc').value.trim(),
      caption: document.getElementById('workCaption').value.trim(),
      keywords,
      seoTitle: document.getElementById('workSeoTitle').value.trim(),
      seoDesc: document.getElementById('workSeoDesc').value.trim(),
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

    // Update works-data.json directly on GitHub
    const packages = getPackages();
    const fullJsonData = JSON.stringify({ works, packages }, null, 2);
    
    const fileInfo = await githubApiRequest('contents/works-data.json', 'GET');
    const fileSha = fileInfo.sha;

    await githubApiRequest('contents/works-data.json', 'PUT', {
      message: 'Update works-data.json via Admin Panel',
      content: btoa(unescape(encodeURIComponent(fullJsonData))),
      sha: fileSha,
      branch: 'main'
    });

    closeModal('workModal');
    loadWorksTable();
    loadDashboard();
    showAdminToast('✅ Sab kuch successfully live ho gaya!');

  } catch (error) {
    console.error(error);
    showAdminToast("❌ Error: " + error.message, "error");
  }
}

// Helper: File to Base64
const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

// Helper: GitHub API Request
async function githubApiRequest(endpoint, method, bodyData = null) {
  const url = `https://api.github.com/repos/${GH_USER}/${GH_REPO}/${endpoint}`;
  const options = {
    method: method,
    headers: {
      'Authorization': `token ${GH_TOKEN}`,
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

function deleteWork(id) {
  if (!confirm('Yeh work item delete karna chahte ho?')) return;
  saveWorks(getWorks().filter(w => w.id !== id));
  loadWorksTable();
  loadDashboard();
  showAdminToast('🗑️ Work delete ho gaya');
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
  showAdminToast('✅ SEO settings save ho gayi! HTML files me manually update karo.');
}

// ===== MODAL =====
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ===== TOAST =====
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

// ===== SETTINGS =====
function saveSettings() { showAdminToast('✅ Settings save ho gayi!'); }

function resetData() {
  if (!confirm('Sabhi data default par reset ho jayega. Pakka?')) return;
  localStorage.removeItem('jr_works');
  localStorage.removeItem('jr_packages');
  localStorage.removeItem('jr_seo');
  loadDashboard(); loadWorksTable(); loadPackagesTable(); loadSeoSettings();
  showAdminToast('✅ Data reset ho gaya');
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

// Data Export Function Backup
function exportLiveJson() {
    const works = getWorks();
    const packages = getPackages();
    
    const fullData = {
        works: works,
        packages: packages
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
