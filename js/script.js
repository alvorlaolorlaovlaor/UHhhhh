/* ============================================================
   Website Profil Siswa - script.js
   Pure JavaScript: interaksi, animasi, dan tema.
   ============================================================ */

console.log(
  '%c Halo dari Console! %c\n' +
  'Selamat datang di website profil siswa.\n' +
  'Coba buka tab Console ini untuk lihat log interaksi.\n' +
  'Tip: ada easter egg Konami Code ↑↑↓↓←→←→BA :)',
  'background:#4f46e5;color:#fff;font-size:14px;font-weight:bold;padding:4px 8px;border-radius:4px;',
  'color:#475569;font-size:12px;'
);

/* =================================================
   1. LOADER - sembunyikan setelah halaman siap
   ================================================= */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 400);
  }
  showToast('Halaman berhasil dimuat ✓', 'success');
});

/* =================================================
   2. TEMA TERANG / GELAP
   ================================================= */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  if (themeIcon) themeIcon.innerHTML = theme === 'dark' ? '&#9728;' : '&#9790;';
  try { localStorage.setItem('site-theme', theme); } catch (e) {}
}

(function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem('site-theme'); } catch (e) {}
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));
})();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    showToast(`Tema: ${next === 'dark' ? 'Gelap 🌙' : 'Terang ☀️'}`, 'info');
    console.log('[Tema] diubah ke:', next);
  });
}

/* =================================================
   3. NAVBAR - burger menu + active link + shadow
   ================================================= */
const navBurger = document.getElementById('navBurger');
const navMenu = document.getElementById('navMenu');
const navbar = document.getElementById('navbar');

if (navBurger && navMenu) {
  navBurger.addEventListener('click', () => {
    navBurger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });
  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navBurger.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });
}

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 10);
});

/* =================================================
   4. SCROLL PROGRESS BAR + BACK TO TOP
   ================================================= */
const progressBar = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');

function onScroll() {
  const h = document.documentElement;
  const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  if (progressBar) progressBar.style.width = (scrolled || 0) + '%';
  if (backToTop) backToTop.classList.toggle('visible', h.scrollTop > 400);
}
window.addEventListener('scroll', onScroll, { passive: true });

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log('[Nav] kembali ke atas');
  });
}

/* =================================================
   5. ACTIVE NAV LINK saat scroll
   ================================================= */
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  let activeId = '';
  const offset = 100;
  sections.forEach(sec => {
    if (window.scrollY + offset >= sec.offsetTop) activeId = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + activeId);
  });
}
window.addEventListener('scroll', updateActiveLink, { passive: true });

/* =================================================
   6. REVEAL ON SCROLL (IntersectionObserver)
   ================================================= */
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && reveals.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(r => io.observe(r));
} else {
  reveals.forEach(r => r.classList.add('visible'));
}

/* =================================================
   7. LIVE CLOCK + UCAPAN BERDASARKAN WAKTU
   ================================================= */
const clockEl = document.getElementById('liveClock');
const greetEl = document.getElementById('greeting');

function pad(n) { return String(n).padStart(2, '0'); }

function tick() {
  const now = new Date();
  if (clockEl) {
    clockEl.textContent =
      pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
  }
  if (greetEl) {
    const h = now.getHours();
    let g = 'Halo';
    if (h < 11) g = 'Selamat pagi ☀️';
    else if (h < 15) g = 'Selamat siang 🌤️';
    else if (h < 18) g = 'Selamat sore 🌅';
    else g = 'Selamat malam 🌙';
    greetEl.textContent = g + ', semoga harimu menyenangkan!';
  }
}
tick();
setInterval(tick, 1000);

/* =================================================
   8. TYPING EFFECT pada judul header
   ================================================= */
const typedEl = document.getElementById('typedTitle');
if (typedEl) {
  const phrases = [
    '[Judul Website]',
    'Profil Siswa Interaktif',
    'Selamat Datang!'
  ];
  let pIndex = 0, cIndex = 0, deleting = false;
  function typeLoop() {
    const text = phrases[pIndex];
    if (!deleting) {
      typedEl.textContent = text.slice(0, ++cIndex);
      if (cIndex === text.length) {
        deleting = true;
        setTimeout(typeLoop, 1600);
        return;
      }
    } else {
      typedEl.textContent = text.slice(0, --cIndex);
      if (cIndex === 0) {
        deleting = false;
        pIndex = (pIndex + 1) % phrases.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 90);
  }
  typeLoop();
}

/* =================================================
   9. UPLOAD FOTO (preview lokal, tidak diunggah)
   ================================================= */
const uploadBtn = document.getElementById('uploadBtn');
const photoInput = document.getElementById('photoInput');
const photoFrame = document.getElementById('photoFrame');

if (uploadBtn && photoInput && photoFrame) {
  uploadBtn.addEventListener('click', () => photoInput.click());
  photoInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('File harus berupa gambar!', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      photoFrame.innerHTML = '<img src="' + ev.target.result + '" alt="Foto siswa" />';
      showToast('Foto berhasil diunggah ✓', 'success');
      console.log('[Foto] preview diatur, ukuran:', file.size, 'bytes');
    };
    reader.readAsDataURL(file);
  });
}

/* =================================================
   10. TABEL NILAI - kategori, statistik, search, sort
   ================================================= */
const tableBody = document.querySelector('#tableNilai tbody');

function classifyNilai(n) {
  if (n >= 85) return { label: 'Baik', cls: 'baik' };
  if (n >= 75) return { label: 'Cukup', cls: 'cukup' };
  return { label: 'Kurang', cls: 'kurang' };
}

function renderKategori() {
  if (!tableBody) return;
  tableBody.querySelectorAll('tr').forEach(tr => {
    const cell = tr.querySelector('td[data-nilai]');
    const catCell = tr.children[3];
    if (!cell || !catCell) return;
    const n = parseInt(cell.dataset.nilai, 10);
    const k = classifyNilai(n);
    catCell.innerHTML = `<span class="kategori ${k.cls}">${k.label}</span>`;
  });
}
renderKategori();

function animateCount(el, target, duration = 1200) {
  if (!el) return;
  const start = parseFloat(el.textContent) || 0;
  const startTime = performance.now();
  function step(now) {
    const p = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = start + (target - start) * eased;
    el.textContent = Number.isInteger(target) ? Math.round(val) : val.toFixed(1);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function getNilaiList() {
  if (!tableBody) return [];
  return Array.from(tableBody.querySelectorAll('td[data-nilai]'))
    .map(td => parseInt(td.dataset.nilai, 10))
    .filter(n => !isNaN(n));
}

function updateStats() {
  const arr = getNilaiList();
  if (!arr.length) return;
  const sum = arr.reduce((a, b) => a + b, 0);
  const avg = +(sum / arr.length).toFixed(1);
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  animateCount(document.getElementById('statAvg'), avg);
  animateCount(document.getElementById('statMax'), max);
  animateCount(document.getElementById('statMin'), min);
  animateCount(document.getElementById('statCount'), arr.length);
}

// trigger animasi statistik saat section nilai terlihat
const nilaiSection = document.getElementById('nilai');
if (nilaiSection && 'IntersectionObserver' in window) {
  const sObs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        updateStats();
        sObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.3 });
  sObs.observe(nilaiSection);
} else {
  updateStats();
}

// search
const searchInput = document.getElementById('searchNilai');
if (searchInput && tableBody) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    tableBody.querySelectorAll('tr').forEach(tr => {
      const text = tr.children[1].textContent.toLowerCase();
      tr.style.display = text.includes(q) ? '' : 'none';
    });
  });
}

// sort
const sortSelect = document.getElementById('sortNilai');
if (sortSelect && tableBody) {
  sortSelect.addEventListener('change', () => {
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    const mode = sortSelect.value;
    rows.sort((a, b) => {
      const nA = parseInt(a.children[2].dataset.nilai, 10);
      const nB = parseInt(b.children[2].dataset.nilai, 10);
      const tA = a.children[1].textContent.toLowerCase();
      const tB = b.children[1].textContent.toLowerCase();
      switch (mode) {
        case 'asc': return nA - nB;
        case 'desc': return nB - nA;
        case 'az': return tA.localeCompare(tB);
        default: return parseInt(a.children[0].textContent, 10) - parseInt(b.children[0].textContent, 10);
      }
    });
    rows.forEach(r => tableBody.appendChild(r));
    console.log('[Tabel] diurutkan:', mode);
  });
}

/* =================================================
   11. CONTACT FORM dengan localStorage
   ================================================= */
const cf = document.getElementById('contactForm');
const cfName = document.getElementById('cfName');
const cfMsg = document.getElementById('cfMsg');
const messageList = document.getElementById('messageList');

function loadMessages() {
  try {
    return JSON.parse(localStorage.getItem('site-messages') || '[]');
  } catch (e) { return []; }
}
function saveMessages(arr) {
  try { localStorage.setItem('site-messages', JSON.stringify(arr)); } catch (e) {}
}
function renderMessages() {
  if (!messageList) return;
  const arr = loadMessages();
  messageList.innerHTML = '';
  arr.forEach((m, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="msg-name">${escapeHtml(m.name)}</span>
      <span class="msg-time">${new Date(m.time).toLocaleString('id-ID')}</span>
      <span class="msg-text">${escapeHtml(m.text)}</span>
      <button class="msg-del" data-idx="${idx}">Hapus</button>
    `;
    messageList.appendChild(li);
  });
  messageList.querySelectorAll('.msg-del').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.idx, 10);
      const arr = loadMessages();
      arr.splice(i, 1);
      saveMessages(arr);
      renderMessages();
      showToast('Pesan dihapus', 'info');
    });
  });
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
renderMessages();

if (cf) {
  cf.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = cfName.value.trim();
    const text = cfMsg.value.trim();
    if (!name || !text) {
      showToast('Mohon isi semua field!', 'error');
      return;
    }
    const arr = loadMessages();
    arr.unshift({ name, text, time: Date.now() });
    saveMessages(arr);
    renderMessages();
    cf.reset();
    showToast('Pesan berhasil dikirim ✓', 'success');
    console.log('[Form] pesan disimpan oleh', name);
  });
}

/* =================================================
   13. TOAST NOTIFICATION
   ================================================= */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = message;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

/* =================================================
   14. FOOTER YEAR
   ================================================= */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =================================================
   15. EASTER EGG - KONAMI CODE
   ================================================= */
(function konami() {
  const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
               'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let i = 0;
  document.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === seq[i]) {
      i++;
      if (i === seq.length) {
        i = 0;
        triggerConfetti();
        showToast('🎉 Konami Code aktif! Selamat menikmati confetti!', 'success');
        alert('🎉 Konami Code ditemukan! Kamu menemukan easter egg.');
        console.log('[Easter Egg] Konami Code aktif!');
      }
    } else {
      i = (key === seq[0]) ? 1 : 0;
    }
  });
})();

function triggerConfetti() {
  const colors = ['#4f46e5', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4'];
  for (let i = 0; i < 80; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.top = '-20px';
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDuration = (2 + Math.random() * 2) + 's';
    c.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4500);
  }
}

/* =================================================
   16. EFEK TILT / 3D ringan pada project card
   ================================================= */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * -6;
    const ry = ((x / rect.width) - 0.5) * 6;
    card.style.transform = `translateY(-6px) perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* =================================================
   17. KEYBOARD SHORTCUTS
   ================================================= */
document.addEventListener('keydown', (e) => {
  // Jangan trigger saat fokus di input
  const tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea') return;
  if (e.key === 't' || e.key === 'T') {
    if (themeToggle) themeToggle.click();
  }
  if (e.key === 'Home') window.scrollTo({ top: 0, behavior: 'smooth' });
  if (e.key === 'End') window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});

/* =================================================
   18. ALERT SAMBUTAN (sekali per kunjungan)
   ================================================= */
(function welcomeAlert() {
  try {
    if (!sessionStorage.getItem('welcomed')) {
      setTimeout(() => {
        showToast('👋 Selamat datang! Coba tekan tombol bulan/matahari di pojok untuk ganti tema.', 'info');
        sessionStorage.setItem('welcomed', '1');
      }, 900);
    }
  } catch (e) {}
})();
