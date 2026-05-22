// ===== JR Digital Studio - Main Script =====

// Navbar Active Link
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.remove('active');
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// Hamburger Menu
function initHamburger() {
  const ham = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav-links');
  if (!ham) return;
  ham.addEventListener('click', () => {
    nav.classList.toggle('open');
    ham.classList.toggle('open');
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      ham.classList.remove('open');
    });
  });
}

// Scroll Reveal
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

// Toast Notification
function showToast(msg, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  requestAnimationFrame(() => {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  });
}

// Navbar Scroll Effect
function initNavbarScroll() {
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 4px 24px rgba(0,87,255,0.12)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });
}

// Work Portfolio - Load from JSON
async function loadWorks() {
  const grid = document.querySelector('.work-grid');
  if (!grid) return;

  try {
    const stored = localStorage.getItem('jr_works');
    let works;
    if (stored) {
      works = JSON.parse(stored);
    } else {
      const res = await fetch('works-data.json');
      const data = await res.json();
      works = data.works;
    }
    renderWorks(works, grid);
    initFilters(works);
  } catch (e) {
    // Fallback sample works
    const works = getSampleWorks();
    renderWorks(works, grid);
    initFilters(works);
  }
}

function getSampleWorks() {
  return [
    { id:1, title:"Restaurant Brand Identity", category:"branding", categoryLabel:"Branding", emoji:"🍽️", description:"Complete brand identity design" },
    { id:2, title:"E-Commerce Website", category:"web", categoryLabel:"Web Design", emoji:"🛒", description:"Full e-commerce with custom UI" },
    { id:3, title:"Social Media Campaign", category:"social", categoryLabel:"Social Media", emoji:"📱", description:"30-day social media campaign" },
    { id:4, title:"Corporate Logo Design", category:"branding", categoryLabel:"Branding", emoji:"✏️", description:"Minimalist logo for tech startup" },
    { id:5, title:"YouTube Channel Art", category:"social", categoryLabel:"Social Media", emoji:"🎬", description:"YouTube branding complete kit" },
    { id:6, title:"Real Estate Website", category:"web", categoryLabel:"Web Design", emoji:"🏠", description:"Modern real estate listing site" }
  ];
}

function renderWorks(works, grid) {
  if (!grid) return;
  grid.innerHTML = '';
  works.forEach(w => {
    const card = document.createElement('div');
    card.className = 'work-card reveal';
    card.dataset.category = w.category;
    const kwords = (w.keywords||[]).slice(0,4).map(k=>`<span class="work-keyword">#${k}</span>`).join('');
    card.innerHTML = `
      <div class="work-img">
        ${w.image ? `<img src="${w.image}" alt="${w.title}" loading="lazy">` : `<span style="font-size:52px">${w.emoji || '🎨'}</span>`}
        <div class="work-overlay">
          <div class="work-overlay-text">
            <div style="font-size:14px;font-weight:800">${w.title}</div>
            <span style="font-size:12px;opacity:0.8">${(w.caption||w.description||'').substring(0,80)}${(w.caption||w.description||'').length>80?'...':''}</span>
          </div>
        </div>
      </div>
      <div class="work-info">
        <span class="work-tag">${w.categoryLabel}</span>
        <h4>${w.title}</h4>
        ${w.caption ? `<p class="work-caption">${w.caption.substring(0,90)}${w.caption.length>90?'...':''}</p>` : ''}
        ${kwords ? `<div class="work-keywords">${kwords}</div>` : ''}
      </div>
    `;
    grid.appendChild(card);
  });
  initReveal();
}

function initFilters(works) {
  const btns = document.querySelectorAll('.filter-btn');
  const grid = document.querySelector('.work-grid');
  if (!btns.length || !grid) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      const filtered = filter === 'all' ? works : works.filter(w => w.category === filter);
      grid.style.opacity = '0';
      setTimeout(() => {
        renderWorks(filtered, grid);
        grid.style.opacity = '1';
      }, 200);
    });
  });
}

// Load Packages from JSON/localStorage
async function loadPackages() {
  const grid = document.querySelector('.packages-grid');

  try {
    const stored = localStorage.getItem('jr_packages');
    let packages;
    if (stored) {
      packages = JSON.parse(stored);
    } else {
      const res = await fetch('works-data.json');
      const data = await res.json();
      packages = data.packages;
    }
    if (grid) renderPackages(packages, grid);
    renderCompareTable(packages);
  } catch (e) {
    // fallback
  }
}

function renderPackages(packages, grid) {
  if (!grid || !packages) return;
  grid.innerHTML = '';
  packages.forEach(pkg => {
    const card = document.createElement('div');
    card.className = `package-card${pkg.featured ? ' featured' : ''}`;
    card.innerHTML = `
      ${pkg.featured ? '<span class="featured-badge">⭐ POPULAR</span>' : ''}
      <div class="pkg-name">${pkg.name}</div>
      <div class="pkg-price"><sup>₹</sup>${pkg.price}</div>
      <div class="pkg-duration">${pkg.duration}</div>
      <div class="pkg-divider"></div>
      <ul class="pkg-features">
        ${pkg.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
      <a href="https://wa.me/918320146648?text=Hi!%20I'm%20interested%20in%20the%20${encodeURIComponent(pkg.name)}%20Package%20of%20JR%20Digital%20Studio" 
         target="_blank" class="pkg-btn">Get Started →</a>
    `;
    grid.appendChild(card);
  });
}

// Build comparison table dynamically from packages data
function renderCompareTable(packages) {
  const wrap = document.getElementById('compareTableWrap');
  if (!wrap || !packages || packages.length === 0) return;

  // Collect all unique features across all packages
  const allFeatures = [];
  packages.forEach(pkg => {
    (pkg.features || []).forEach(f => {
      if (!allFeatures.includes(f)) allFeatures.push(f);
    });
  });

  // Build header
  let headCols = packages.map((pkg, i) => {
    const isFeatured = pkg.featured;
    return `<th style="padding:16px 20px;text-align:center;color:white;font-family:'Raleway',sans-serif;font-size:14px;font-weight:900;${isFeatured ? 'background:var(--primary-dark)' : ''}">
      ${pkg.name}${isFeatured ? ' ⭐' : ''}
    </th>`;
  }).join('');

  // Build feature rows
  let featureRows = allFeatures.map(feature => {
    let cols = packages.map((pkg, i) => {
      const has = (pkg.features || []).includes(feature);
      const isFeatured = pkg.featured;
      return `<td style="padding:14px 20px;text-align:center;${isFeatured ? 'background:rgba(0,87,255,0.03);' : ''}${has ? 'color:var(--primary);font-weight:700' : 'color:var(--text-light)'}">
        ${has ? '✅' : '—'}
      </td>`;
    }).join('');
    return `<tr style="border-bottom:1px solid var(--light-gray)">
      <td style="padding:14px 20px;font-weight:700;color:var(--dark);font-size:13px">${feature}</td>
      ${cols}
    </tr>`;
  }).join('');

  // Price row
  let priceRow = packages.map((pkg, i) => {
    return `<td style="padding:18px 20px;text-align:center;font-family:'Raleway',sans-serif;font-weight:900;font-size:20px;color:var(--primary);${pkg.featured ? 'background:rgba(0,87,255,0.03)' : ''}">
      ₹${pkg.price}<span style="font-size:12px;font-weight:600;color:var(--text-light)">/${pkg.duration.replace('per ','')}</span>
    </td>`;
  }).join('');

  // Get Started row
  let btnRow = packages.map(pkg => {
    return `<td style="padding:14px 20px;text-align:center;${pkg.featured ? 'background:rgba(0,87,255,0.03)' : ''}">
      <a href="https://wa.me/918320146648?text=Hi!%20I'm%20interested%20in%20the%20${encodeURIComponent(pkg.name)}%20Package"
         target="_blank"
         style="display:inline-block;background:${pkg.featured ? 'var(--primary)' : 'var(--off-white)'};color:${pkg.featured ? 'white' : 'var(--primary)'};padding:9px 20px;border-radius:9px;text-decoration:none;font-weight:800;font-size:13px;font-family:'Raleway',sans-serif">
        Get Started →
      </a>
    </td>`;
  }).join('');

  wrap.innerHTML = `
    <table style="width:100%;border-collapse:collapse;background:white;border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow);min-width:480px">
      <thead>
        <tr style="background:var(--primary)">
          <th style="padding:16px 20px;text-align:left;color:white;font-family:'Raleway',sans-serif;font-size:14px;font-weight:900">Features</th>
          ${headCols}
        </tr>
      </thead>
      <tbody>
        ${featureRows}
        <tr style="border-bottom:1px solid var(--light-gray)">
          <td style="padding:18px 20px;font-family:'Raleway',sans-serif;font-weight:900;font-size:15px;color:var(--dark)">💰 Price</td>
          ${priceRow}
        </tr>
        <tr>
          <td style="padding:14px 20px;font-weight:700;color:var(--dark);font-size:13px">Get Started</td>
          ${btnRow}
        </tr>
      </tbody>
    </table>
  `;
}

// Contact Form
function initContactForm() {
  const form = document.querySelector('#contactForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const orig = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    await new Promise(r => setTimeout(r, 1200));
    showToast('✅ Message sent! We will contact you soon.', 'success');
    form.reset();
    btn.textContent = orig;
    btn.disabled = false;
  });
}

// Counter Animation
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target || el.textContent.replace(/\D/g, ''));
    const suffix = el.textContent.replace(/[\d,]/g, '');
    let current = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current) + suffix;
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

// Init everything
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initHamburger();
  initReveal();
  initNavbarScroll();
  loadWorks();
  loadPackages();
  initContactForm();

  // Animate counters when visible
  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        obs.disconnect();
      }
    });
    obs.observe(statsEl);
  }
});
