/* BukuKu PWA — JavaScript murni, tanpa framework */
'use strict';

/* ===================== UTIL ===================== */
const esc = s => String(s ?? '').replace(/[&<>"']/g,
  c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const inisial = s => (s ? String(s)[0].toUpperCase() : '?');

/* ===================== DATA / API ===================== */
let localData = null;

async function loadLocal() {
  if (!localData) {
    const r = await fetch('data/data.json');
    if (!r.ok) throw new Error('Data lokal tidak ditemukan');
    localData = await r.json();
  }
  return localData;
}

// Coba API dulu; kalau gagal pakai data lokal.
async function fetchData(path, fallback) {
  if (CONFIG.API_URL) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 6000);
      const r = await fetch(`${CONFIG.API_URL}/${path}`, { signal: ctrl.signal });
      clearTimeout(timer);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return { data: await r.json(), source: 'api' };
    } catch (e) { /* lanjut ke data lokal */ }
  }
  return { data: await fallback(await loadLocal()), source: 'lokal' };
}

const namaPenulis = (d, id) => (d.penulis.find(p => p.id == id) || {}).nama || '';

const API = {
  buku: () => fetchData('buku.php', d =>
    d.buku.map(b => ({ ...b, penulis: namaPenulis(d, b.penulis_id) }))),

  bukuDetail: id => fetchData(`buku.php?id=${id}`, d => {
    const b = d.buku.find(x => x.id == id);
    if (!b) throw new Error('Buku tidak ditemukan');
    return { ...b, penulis: namaPenulis(d, b.penulis_id) };
  }),

  penulis: () => fetchData('penulis.php', d => d.penulis),

  penulisDetail: id => fetchData(`penulis.php?id=${id}`, d => {
    const p = d.penulis.find(x => x.id == id);
    if (!p) throw new Error('Penulis tidak ditemukan');
    return { ...p, buku: d.buku.filter(b => b.penulis_id == id) };
  })
};

/* ===================== KOMPONEN KECIL ===================== */
const loading = () => `<div class="state"><div class="spinner"></div>Memuat data…</div>`;
const errorView = msg => `
  <div class="state">
    <div style="font-size:48px">📡</div>
    <p><b>Gagal memuat data</b></p><p>${esc(msg)}</p>
    <button class="btn" data-retry>Coba lagi</button>
  </div>`;
const sourceNote = src => src === 'lokal'
  ? `<div class="note">Server tidak terjangkau — menampilkan data lokal.</div>` : '';

/* ===================== HALAMAN ===================== */
let installPrompt = null;

function pageHome(el) {
  el.innerHTML = `
    <div class="hero">
      <p>Selamat Datang 👋</p>
      <h2>Jelajahi Koleksi Buku</h2>
      <p>Temukan buku favoritmu dan kenali penulis-penulis hebat di BukuKu.</p>
    </div>
    <h3>Menu Cepat</h3>
    <div class="grid">
      <a class="menu" href="#/buku">📖<b>Daftar Buku</b></a>
      <a class="menu" href="#/penulis">✍️<b>Daftar Penulis</b></a>
    </div>
    <button id="installBtn" class="btn" ${installPrompt ? '' : 'hidden'}>⬇ Pasang Aplikasi</button>`;
  bindInstall();
}

async function pageBukuList(el, _m, stale) {
  el.innerHTML = loading();
  const { data, source } = await API.buku();
  if (stale()) return;

  const row = b => `
    <a class="card item" href="#/buku/${b.id}">
      <div class="avatar">${esc(inisial(b.judul))}</div>
      <div class="info"><b>${esc(b.judul)}</b><small>${esc(b.penulis)} • ${esc(b.tahun)}</small></div>
      <span class="arrow">›</span>
    </a>`;
  el.innerHTML = `${sourceNote(source)}
    <input class="search" id="q" type="search" placeholder="Cari judul atau penulis…">
    <div id="list">${data.map(row).join('') || '<div class="state">Belum ada buku</div>'}</div>`;

  el.querySelector('#q').addEventListener('input', e => {
    const k = e.target.value.toLowerCase().trim();
    const hasil = data.filter(b => (b.judul + ' ' + b.penulis).toLowerCase().includes(k));
    el.querySelector('#list').innerHTML =
      hasil.map(row).join('') || '<div class="state">Buku tidak ditemukan</div>';
  });
}

async function pageBukuDetail(el, m, stale) {
  el.innerHTML = loading();
  const { data: b, source } = await API.bukuDetail(m[1]);
  if (stale()) return;
  el.innerHTML = `${sourceNote(source)}
    <div class="cover">📖</div>
    <div class="title">${esc(b.judul)}</div>
    <div class="chips"><span class="chip">${esc(b.genre)}</span><span class="chip">${esc(b.tahun)}</span></div>
    <p>👤 <b>Penulis: ${esc(b.penulis)}</b></p>
    <hr>
    <div class="label">Sinopsis</div>
    <p class="text">${esc(b.sinopsis)}</p>`;
}

async function pagePenulisList(el, _m, stale) {
  el.innerHTML = loading();
  const { data, source } = await API.penulis();
  if (stale()) return;

  const row = p => `
    <a class="card item" href="#/penulis/${p.id}">
      <div class="avatar orange">${esc(inisial(p.nama))}</div>
      <div class="info"><b>${esc(p.nama)}</b><small>${esc(p.negara)}</small></div>
      <span class="arrow">›</span>
    </a>`;
  el.innerHTML = `${sourceNote(source)}
    <input class="search" id="q" type="search" placeholder="Cari penulis…">
    <div id="list">${data.map(row).join('') || '<div class="state">Belum ada penulis</div>'}</div>`;

  el.querySelector('#q').addEventListener('input', e => {
    const k = e.target.value.toLowerCase().trim();
    const hasil = data.filter(p => p.nama.toLowerCase().includes(k));
    el.querySelector('#list').innerHTML =
      hasil.map(row).join('') || '<div class="state">Penulis tidak ditemukan</div>';
  });
}

async function pagePenulisDetail(el, m, stale) {
  el.innerHTML = loading();
  const { data: p, source } = await API.penulisDetail(m[1]);
  if (stale()) return;
  const bukuList = (p.buku || []).map(b => `
    <a class="card item" href="#/buku/${b.id}">
      <div class="avatar">📖</div>
      <div class="info"><b>${esc(b.judul)}</b><small>${esc(b.genre)} • ${esc(b.tahun)}</small></div>
      <span class="arrow">›</span>
    </a>`).join('');
  el.innerHTML = `${sourceNote(source)}
    <div class="avatar big">${esc(inisial(p.nama))}</div>
    <div class="title center">${esc(p.nama)}</div>
    <p class="center" style="color:var(--muted)">${esc(p.negara)}</p>
    <hr>
    <div class="label">Biografi</div>
    <p class="text">${esc(p.biografi)}</p>
    <hr>
    <div class="label">Buku karya ${esc(p.nama)} (${(p.buku || []).length})</div>
    ${bukuList || '<p class="text">Belum ada buku.</p>'}`;
}

function pageProfil(el) {
  const P = CONFIG.PROFILE;
  const row = (ic, label, val) =>
    `<div class="profile-row"><span>${ic}</span><div><small>${label}</small>${esc(val)}</div></div>`;
  el.innerHTML = `
    <div class="avatar big">📚</div>
    <div class="title center">BukuKu v1.0</div>
    <p class="center" style="color:var(--muted)">Aplikasi Katalog Buku &amp; Penulis</p>
    <hr>
    ${row('👤', 'Nama', P.nama)}
    ${row('🪪', 'NIM', P.nim)}
    ${row('🏫', 'Kelas', P.kelas)}
    ${row('💻', 'Platform', 'PWA — HTML, CSS, JavaScript + PHP & MySQL')}
    ${row('🔗', 'GitHub', P.github)}
    <hr>
    <p class="text center">BukuKu adalah aplikasi sederhana untuk melihat katalog buku beserta penulisnya.
      Dibuat untuk memenuhi Tugas Akhir Praktikum PPB 2026.</p>
    <button id="installBtn" class="btn" ${installPrompt ? '' : 'hidden'}>⬇ Pasang Aplikasi</button>`;
  bindInstall();
}

/* ===================== ROUTER ===================== */
const routes = [
  { re: /^#\/home$/,           tab: 'home',    title: 'BukuKu',         render: pageHome },
  { re: /^#\/buku$/,           tab: 'buku',    title: 'Daftar Buku',    render: pageBukuList },
  { re: /^#\/buku\/(\d+)$/,    tab: 'buku',    title: 'Detail Buku',    render: pageBukuDetail,    back: true },
  { re: /^#\/penulis$/,        tab: 'penulis', title: 'Daftar Penulis', render: pagePenulisList },
  { re: /^#\/penulis\/(\d+)$/, tab: 'penulis', title: 'Detail Penulis', render: pagePenulisDetail, back: true },
  { re: /^#\/profil$/,         tab: 'profil',  title: 'Tentang Aplikasi', render: pageProfil }
];

const $app = document.getElementById('app');
const $title = document.getElementById('title');
const $back = document.getElementById('back');
let token = 0;

async function router() {
  const hash = location.hash || '#/home';
  let route = null, m = null;
  for (const r of routes) { m = hash.match(r.re); if (m) { route = r; break; } }
  if (!route) { location.replace('#/home'); return; }

  const my = ++token;
  const stale = () => my !== token;

  $title.textContent = route.title;
  document.title = route.title + ' — BukuKu';
  $back.hidden = !route.back;
  document.querySelectorAll('.bottom-nav a').forEach(a =>
    a.classList.toggle('active', a.dataset.tab === route.tab));
  window.scrollTo(0, 0);

  try {
    await route.render($app, m, stale);
  } catch (err) {
    if (!stale()) $app.innerHTML = errorView(err.message);
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);
$back.addEventListener('click', () => history.length > 1 ? history.back() : (location.hash = '#/home'));
$app.addEventListener('click', e => { if (e.target.closest('[data-retry]')) router(); });

/* ===================== PWA: INSTALL & SERVICE WORKER ===================== */
function bindInstall() {
  const btn = document.getElementById('installBtn');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    btn.hidden = true;
  });
}

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  installPrompt = e;
  const btn = document.getElementById('installBtn');
  if (btn) btn.hidden = false;
});
window.addEventListener('appinstalled', () => {
  installPrompt = null;
  const btn = document.getElementById('installBtn');
  if (btn) btn.hidden = true;
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('./sw.js').catch(err => console.warn('SW gagal:', err)));
}
