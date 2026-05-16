/* ============================================================
   HYPNOS PRIME — App principal
   Router por hash + estado de la app + renderizado de vistas.
   ============================================================ */

import { HypnosAudio } from './player.js';

// ---------- Datos demo ----------
const SESSIONS = [
  {
    id: 'reprogramacion-profunda',
    title: 'Reprogramación Subconsciente Profunda',
    master: 'Maestro Honorio Castillo',
    category: 'subconsciente',
    duration: 1365, // 22:45
    description: 'Una inmersión guiada para reescribir creencias limitantes en el nivel más profundo de tu mente.',
    badge: 'DESTACADO',
    carrier: 110, beat: 4.5,            // delta/theta — transición profunda
    padRoot: 110, padIntervals: [1, 1.5, 1.78],
    padLevel: 0.14, noiseLevel: 0.05,
    accent: '#9b6bff',
    cover: 'assets/img/sessions/portal.webp',
  },
  {
    id: 'descubrimiento-abundancia',
    title: 'Descubrimiento de Abundancia',
    master: 'Maestro Honorio Castillo',
    category: 'consciente',
    duration: 1800, // 30:00
    description: 'Activa la frecuencia interior que atrae prosperidad consciente y abre nuevos caminos.',
    badge: 'NUEVO',
    carrier: 174, beat: 7.83,            // Schumann ~ alfa
    padRoot: 130.8, padIntervals: [1, 1.5, 2],
    padLevel: 0.13, noiseLevel: 0.04,
    accent: '#f2ca50',
    cover: 'assets/img/sessions/abundance.webp',
  },
  {
    id: 'sueno-profundo',
    title: 'Sueño Profundo Restaurador',
    master: 'Maestro Honorio Castillo',
    category: 'equilibrio',
    duration: 2700, // 45:00
    description: 'Desciende suavemente a delta y permite que tu cuerpo y mente se reparen durante la noche.',
    badge: 'SUEÑO',
    carrier: 96, beat: 2.5,              // delta puro
    padRoot: 96, padIntervals: [1, 1.5, 1.78],
    padLevel: 0.16, noiseLevel: 0.06,
    accent: '#7a8ee8',
    cover: 'assets/img/sessions/moon.webp',
  },
  {
    id: 'enfoque-flow',
    title: 'Enfoque Total en Flow',
    master: 'Maestro Honorio Castillo',
    category: 'mente',
    duration: 1500, // 25:00
    description: 'Entrena tu mente para entrar en estado de alta concentración y producción creativa.',
    badge: 'ENFOQUE',
    carrier: 200, beat: 14,              // beta — alerta
    padRoot: 220, padIntervals: [1, 1.5, 1.68],
    padLevel: 0.10, noiseLevel: 0.03,
    accent: '#5dd4a8',
    cover: 'assets/img/sessions/focus.webp',
  },
  {
    id: 'sana-relacion',
    title: 'Sana tu Relación',
    master: 'Maestro Honorio Castillo',
    category: 'equilibrio',
    duration: 1200, // 20:00
    description: 'Libera resentimientos y reconecta con el amor consciente desde el corazón.',
    badge: 'CORAZÓN',
    carrier: 136.1, beat: 6,             // theta — apertura emocional
    padRoot: 136.1, padIntervals: [1, 1.5, 1.78],
    padLevel: 0.13, noiseLevel: 0.04,
    accent: '#e76f8f',
    cover: 'assets/img/sessions/moon.webp',
  },
  {
    id: 'transformacion-radical',
    title: 'Transformación Radical',
    master: 'Maestro Honorio Castillo',
    category: 'transformacion',
    duration: 1800, // 30:00
    description: 'Un protocolo intensivo para integrar una nueva versión de ti mismo en sólo 30 minutos.',
    badge: 'INTENSIVO',
    carrier: 256, beat: 10,              // alpha
    padRoot: 128, padIntervals: [1, 1.5, 1.78],
    padLevel: 0.12, noiseLevel: 0.04,
    accent: '#e76f8f',
    cover: 'assets/img/sessions/phoenix.webp',
  },
  {
    id: 'meditacion-amanecer',
    title: 'Meditación del Amanecer',
    master: 'Maestro Honorio Castillo',
    category: 'consciente',
    duration: 900, // 15:00
    description: 'Inicia tu día con claridad, gratitud y una intención poderosa.',
    badge: 'MAÑANA',
    carrier: 174, beat: 10,
    padRoot: 174, padIntervals: [1, 1.5, 2],
    padLevel: 0.11, noiseLevel: 0.03,
    accent: '#f2ca50',
    cover: 'assets/img/sessions/abundance.webp',
  },
];

const CATEGORIES = [
  { id: 'mente',         label: 'Mente',         icon: 'assets/icons/chakra-mente.svg' },
  { id: 'consciente',    label: 'Consciente',    icon: 'assets/icons/chakra-consciente.svg' },
  { id: 'subconsciente', label: 'Subconsciente', icon: 'assets/icons/chakra-subconsciente.svg' },
  { id: 'equilibrio',    label: 'Equilibrio',    icon: 'assets/icons/chakra-equilibrio.svg' },
  { id: 'transformacion',label: 'Transformación',icon: 'assets/icons/chakra-transformacion.svg' },
];

// ---------- Estado de la app ----------
const app = {
  currentView: 'home',
  libraryFilter: 'todas',
  searchTerm: '',
  favorites: new Set(JSON.parse(localStorage.getItem('hp_favs') || '[]')),
  settings: JSON.parse(localStorage.getItem('hp_settings') || '{"haptics":true,"keepAwake":true,"highContrast":false}'),
};

function persist() {
  localStorage.setItem('hp_favs', JSON.stringify([...app.favorites]));
  localStorage.setItem('hp_settings', JSON.stringify(app.settings));
}

// ---------- Helpers ----------
const $  = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

function fmt(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2,'0')}`;
}
function fmtLong(seconds) {
  return `${Math.round(seconds/60)} MIN`;
}
function escapeHtml(s='') {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 1800);
}

function haptic() {
  if (!app.settings.haptics) return;
  if (navigator.vibrate) navigator.vibrate(8);
}

// ---------- Router ----------
function route() {
  const hash = location.hash.replace(/^#\/?/, '') || 'welcome';
  const [name, param] = hash.split('/');
  navigate(name || 'welcome', param);
}

function navigate(view, param) {
  app.currentView = view;
  $$('.view, .view-flex').forEach(v => v.classList.remove('active'));
  const el = $(`#view-${view}`);
  if (!el) {
    $('#view-home').classList.add('active');
    app.currentView = 'home';
  } else {
    el.classList.add(el.classList.contains('view-flex') ? 'active' : 'active');
  }

  // bottom nav state
  $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));

  // mostrar / ocultar nav y mini player en welcome y player
  const showShell = !['welcome','player'].includes(view);
  $('#bottomNav').style.display = showShell ? '' : 'none';

  // Mini player oculto en welcome y player full
  updateMiniPlayerVisibility();

  if (view === 'player') {
    renderPlayer(param);
  } else if (view === 'library') {
    renderLibrary();
  } else if (view === 'search') {
    renderSearch();
  } else if (view === 'home') {
    renderHome();
  } else if (view === 'settings') {
    renderSettings();
  }

  window.scrollTo({ top: 0, behavior: 'instant' });
}

// ---------- Render: Home ----------
function renderHome() {
  const featured = SESSIONS[0]; // Reprogramación Subconsciente (portal)
  $('#home-content').innerHTML = `
    <section>
      <h2 class="font-headline text-3xl">Hola, <span class="gold-text">Buscador</span></h2>
      <p class="font-label text-[11px] text-[color:var(--on-variant)] mt-2">Tu sanctuario sonoro</p>
    </section>

    <section class="relative">
      <div class="glass rounded-2xl gilded-border relative overflow-hidden">
        <div class="relative h-48 sm:h-56 overflow-hidden">
          <img src="${featured.cover}" class="absolute inset-0 w-full h-full object-cover scale-110" alt=""/>
          <div class="absolute inset-0" style="background: linear-gradient(180deg, transparent 0%, rgba(15,13,12,0.55) 60%, rgba(15,13,12,0.95) 100%);"></div>
          <div class="absolute top-3 left-4 flex items-center gap-2">
            <span class="font-label text-[9px] text-[color:var(--primary)] bg-[#0f0d0c]/70 backdrop-blur px-2.5 py-1 rounded-full border border-[color:var(--primary)]/40">${featured.badge}</span>
            <span class="font-label text-[9px] text-[color:var(--on-variant)] bg-[#0f0d0c]/70 backdrop-blur px-2.5 py-1 rounded-full">${binauralBand(featured.beat)} · ${fmtLong(featured.duration)}</span>
          </div>
        </div>
        <div class="p-5 sm:p-6 -mt-12 relative z-10">
          <h3 class="font-headline text-2xl text-[color:var(--primary)] leading-tight">${escapeHtml(featured.title)}</h3>
          <p class="text-sm text-[color:var(--on-variant)] opacity-80 mt-2">${escapeHtml(featured.description)}</p>
          <button data-play="${featured.id}" class="gold-fill mt-5 px-6 py-2.5 rounded-full font-label text-[11px] gold-glow active:scale-95 transition inline-flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]" style="font-variation-settings:'FILL' 1;">play_arrow</span>
            Escuchar ahora
          </button>
        </div>
      </div>
    </section>

    <section>
      <div class="flex items-baseline justify-between mb-5">
        <h3 class="font-headline text-xl gold-text">Categorías</h3>
        <button onclick="location.hash='#/library'" class="font-label text-[10px] text-[color:var(--on-variant)] hover:text-[color:var(--primary)]">VER TODO →</button>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-5 gap-4 sm:gap-6">
        ${CATEGORIES.map(c => `
          <button data-category="${c.id}" class="flex flex-col items-center gap-3 group">
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl glass gilded-border flex items-center justify-center group-active:scale-95 group-hover:scale-105 transition">
              <img src="${c.icon}" alt="" class="w-10 h-10 sm:w-12 sm:h-12 object-contain"/>
            </div>
            <span class="font-label text-[10px] text-[color:var(--primary)]">${c.label}</span>
          </button>
        `).join('')}
      </div>
    </section>

    <section>
      <h3 class="font-headline text-xl gold-text border-l-2 border-[color:var(--primary)] pl-3 mb-5">Recomendado para ti</h3>
      <div class="grid grid-cols-2 gap-4">
        ${SESSIONS.slice(2, 6).map(s => sessionCardHTML(s)).join('')}
      </div>
    </section>

    <section>
      <h3 class="font-headline text-xl gold-text border-l-2 border-[color:var(--primary)] pl-3 mb-5">Continúa tu viaje</h3>
      <div class="space-y-3">
        ${SESSIONS.slice(0, 3).map(s => sessionRowHTML(s)).join('')}
      </div>
    </section>
  `;
  attachSessionTriggers($('#home-content'));
}

function sessionCardHTML(s) {
  return `
    <button data-play="${s.id}" class="glass rounded-xl overflow-hidden text-left lift group">
      <div class="h-32 relative overflow-hidden">
        ${s.cover
          ? `<img src="${s.cover}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt=""/>`
          : `<div class="absolute inset-0" style="background:radial-gradient(120% 80% at 30% 30%, ${s.accent}33, transparent 70%), var(--surface-low);"></div>
             <img src="assets/icons/logo.svg" class="absolute inset-0 m-auto w-16 h-16 opacity-70 orbit-slow" alt=""/>`}
        <div class="absolute inset-0 bg-gradient-to-t from-[#0f0d0c] via-[#0f0d0c]/30 to-transparent"></div>
        <span class="absolute top-2 left-2 font-label text-[9px] text-[color:var(--primary)] bg-[#0f0d0c]/70 backdrop-blur px-2 py-1 rounded-full border border-[color:var(--primary)]/30">${fmtLong(s.duration)}</span>
      </div>
      <div class="p-3">
        <h4 class="font-headline text-base leading-tight">${escapeHtml(s.title)}</h4>
        <p class="font-label text-[10px] text-[color:var(--on-variant)] mt-2 truncate">${escapeHtml(s.master)}</p>
      </div>
    </button>
  `;
}

function sessionRowHTML(s) {
  const fav = app.favorites.has(s.id);
  return `
    <div class="glass rounded-xl p-3 flex items-center gap-3 lift">
      <button data-play="${s.id}" class="shrink-0 w-14 h-14 rounded-xl gilded-border overflow-hidden relative group" style="background:radial-gradient(120% 80% at 30% 30%, ${s.accent}33, transparent 70%);">
        ${s.cover ? `<img src="${s.cover}" class="absolute inset-0 w-full h-full object-cover opacity-90" alt=""/>` : ''}
        <span class="absolute inset-0 flex items-center justify-center material-symbols-outlined text-[color:var(--primary)] text-[28px] bg-black/35 opacity-0 group-hover:opacity-100 transition" style="font-variation-settings:'FILL' 1;">play_arrow</span>
      </button>
      <button data-play="${s.id}" class="flex-1 min-w-0 text-left">
        <h4 class="font-headline text-base truncate">${escapeHtml(s.title)}</h4>
        <p class="font-label text-[10px] text-[color:var(--on-variant)] mt-1">${escapeHtml(s.master)} · ${fmtLong(s.duration)}</p>
      </button>
      <button data-fav="${s.id}" class="text-[color:${fav?'var(--primary)':'var(--outline)'}] hover:text-[color:var(--primary)] p-2 transition">
        <span class="material-symbols-outlined" ${fav?'style="font-variation-settings:\'FILL\' 1;"':''}>favorite</span>
      </button>
    </div>
  `;
}

// ---------- Render: Library ----------
function renderLibrary() {
  const filters = [
    { id: 'todas', label: 'TODAS' },
    ...CATEGORIES.map(c => ({ id: c.id, label: c.label.toUpperCase() })),
    { id: 'favoritos', label: 'FAVORITOS' },
  ];
  const filtered = SESSIONS.filter(s => {
    if (app.libraryFilter === 'todas') return true;
    if (app.libraryFilter === 'favoritos') return app.favorites.has(s.id);
    return s.category === app.libraryFilter;
  });

  $('#library-content').innerHTML = `
    <section class="mb-6">
      <h2 class="font-headline text-3xl gold-text tracking-wider uppercase">Biblioteca</h2>
      <p class="font-italic text-[color:var(--on-variant)] mt-2">Encuentra tu frecuencia sagrada.</p>
    </section>

    <section class="flex overflow-x-auto pb-3 gap-2 no-scrollbar -mx-6 px-6 mb-6">
      ${filters.map(f => `
        <button data-filter="${f.id}" class="shrink-0 px-5 py-2 rounded-full font-label text-[11px] transition
          ${app.libraryFilter === f.id
            ? 'bg-[color:var(--primary-container)] text-[color:var(--on-primary)]'
            : 'border border-[color:var(--outline-variant)] text-[color:var(--outline)] hover:border-[color:var(--primary)]/50'}">
          ${f.label}
        </button>
      `).join('')}
    </section>

    <section class="space-y-3">
      ${filtered.length === 0
        ? `<div class="glass rounded-xl p-10 text-center text-[color:var(--on-variant)] italic">Aún no hay sesiones aquí.</div>`
        : filtered.map(s => libraryItemHTML(s)).join('')
      }
    </section>
  `;
  attachSessionTriggers($('#library-content'));
}

function libraryItemHTML(s) {
  const fav = app.favorites.has(s.id);
  return `
    <article class="glass rounded-xl p-4 flex gap-4 items-center lift">
      <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-lg gilded-border shrink-0 relative overflow-hidden"
           style="background:radial-gradient(140% 100% at 30% 30%, ${s.accent}33, transparent 70%);">
        ${s.cover
          ? `<img src="${s.cover}" class="absolute inset-0 w-full h-full object-cover" alt=""/>`
          : `<img src="assets/icons/logo.svg" class="absolute inset-0 m-auto w-12 h-12 sm:w-14 sm:h-14 opacity-80" alt=""/>`}
        <div class="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"></div>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex justify-between items-start gap-2">
          <button data-play="${s.id}" class="text-left flex-1 min-w-0">
            <h4 class="font-headline text-lg truncate">${escapeHtml(s.title)}</h4>
            <p class="font-italic text-[13px] text-[color:var(--on-variant)] mt-0.5 truncate">${escapeHtml(s.master)}</p>
          </button>
          <button data-fav="${s.id}" class="text-[color:${fav?'var(--primary)':'var(--outline)'}] p-1 shrink-0 transition">
            <span class="material-symbols-outlined text-[20px]" ${fav?'style="font-variation-settings:\'FILL\' 1;"':''}>favorite</span>
          </button>
        </div>
        <div class="flex items-center gap-3 mt-2 flex-wrap">
          <span class="flex items-center gap-1 font-label text-[10px] text-[color:var(--outline)]">
            <span class="material-symbols-outlined text-[14px]">schedule</span>${fmtLong(s.duration)}
          </span>
          <span class="px-2 py-0.5 rounded font-label text-[9px] text-[color:var(--outline-variant)] border border-[color:var(--outline-variant)]/60 uppercase">
            ${CATEGORIES.find(c=>c.id===s.category)?.label || s.category}
          </span>
        </div>
      </div>
      <button data-play="${s.id}" class="shrink-0 w-11 h-11 rounded-full gold-fill gold-glow flex items-center justify-center">
        <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;">play_arrow</span>
      </button>
    </article>
  `;
}

// ---------- Render: Search ----------
function renderSearch() {
  const q = app.searchTerm.trim().toLowerCase();
  const results = !q ? [] : SESSIONS.filter(s =>
    s.title.toLowerCase().includes(q) ||
    s.master.toLowerCase().includes(q) ||
    s.category.includes(q) ||
    (CATEGORIES.find(c => c.id === s.category)?.label || '').toLowerCase().includes(q)
  );
  const suggested = ['sueño', 'abundancia', 'enfoque', 'sanación', 'amanecer'];

  $('#search-content').innerHTML = `
    <section class="mb-6">
      <h2 class="font-headline text-3xl gold-text">Explorar</h2>
      <p class="font-italic text-[color:var(--on-variant)] mt-2">Descubre el camino que tu mente necesita.</p>
    </section>

    <div class="glass rounded-full gilded-border flex items-center gap-3 px-5 py-3 mb-6">
      <span class="material-symbols-outlined text-[color:var(--primary)]">search</span>
      <input id="searchInput" type="search" placeholder="Busca una sesión, frecuencia o maestro…"
             class="bg-transparent outline-none flex-1 font-body text-base placeholder:text-[color:var(--outline)]"
             value="${escapeHtml(app.searchTerm)}" autocomplete="off"/>
      ${app.searchTerm ? '<button id="clearSearch" class="text-[color:var(--outline)]"><span class="material-symbols-outlined">close</span></button>' : ''}
    </div>

    ${!q ? `
      <section class="mb-8">
        <h3 class="font-label text-[11px] text-[color:var(--on-variant)] mb-3">SUGERENCIAS</h3>
        <div class="flex flex-wrap gap-2">
          ${suggested.map(s => `<button data-suggest="${s}" class="px-4 py-2 rounded-full border border-[color:var(--outline-variant)] text-[color:var(--outline)] hover:text-[color:var(--primary)] hover:border-[color:var(--primary)]/50 text-sm">${s}</button>`).join('')}
        </div>
      </section>

      <section>
        <h3 class="font-label text-[11px] text-[color:var(--on-variant)] mb-3">EXPLORA POR CHAKRA</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          ${CATEGORIES.map(c => `
            <button data-category="${c.id}" class="glass rounded-xl gilded-border p-4 flex items-center gap-3 lift">
              <img src="${c.icon}" class="w-10 h-10" alt=""/>
              <span class="font-headline text-base">${c.label}</span>
            </button>
          `).join('')}
        </div>
      </section>
    ` : `
      <section>
        <h3 class="font-label text-[11px] text-[color:var(--on-variant)] mb-3">${results.length} RESULTADO${results.length===1?'':'S'}</h3>
        <div class="space-y-3">
          ${results.length === 0
            ? `<div class="glass rounded-xl p-10 text-center italic text-[color:var(--on-variant)]">Sin resultados para "${escapeHtml(q)}"</div>`
            : results.map(libraryItemHTML).join('')
          }
        </div>
      </section>
    `}
  `;

  const input = $('#searchInput');
  if (input) {
    input.addEventListener('input', (e) => {
      app.searchTerm = e.target.value;
      renderSearch();
      // refocus
      const i = $('#searchInput');
      if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); }
    });
  }
  const clr = $('#clearSearch');
  if (clr) clr.addEventListener('click', () => { app.searchTerm = ''; renderSearch(); });

  $$('#search-content [data-suggest]').forEach(b => {
    b.addEventListener('click', () => { app.searchTerm = b.dataset.suggest; renderSearch(); });
  });
  attachSessionTriggers($('#search-content'));
}

// ---------- Render: Settings ----------
function renderSettings() {
  const setting = (key, label, desc) => `
    <div class="glass rounded-xl p-4 flex items-center justify-between gap-4 gilded-border">
      <div class="min-w-0">
        <h4 class="font-headline text-base">${label}</h4>
        <p class="text-[13px] text-[color:var(--on-variant)] mt-1 opacity-80">${desc}</p>
      </div>
      <button data-toggle="${key}" class="switch ${app.settings[key] ? 'on' : ''}" aria-pressed="${app.settings[key]}"></button>
    </div>
  `;

  $('#settings-content').innerHTML = `
    <section class="mb-6">
      <h2 class="font-headline text-3xl gold-text">Ajustes</h2>
      <p class="font-italic text-[color:var(--on-variant)] mt-2">Personaliza tu sanctuario.</p>
    </section>

    <section class="mb-8">
      <div class="glass gilded-border rounded-2xl p-5 flex items-center gap-4">
        <div class="w-14 h-14 rounded-full gilded-border flex items-center justify-center gold-glow-soft">
          <img src="assets/icons/logo.svg" class="w-10 h-10" alt=""/>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-headline text-lg">Buscador Anónimo</h3>
          <p class="font-label text-[10px] text-[color:var(--on-variant)]">Plan Demo · Acceso completo</p>
        </div>
        <button class="px-4 py-2 rounded-full gold-fill font-label text-[10px] gold-glow-soft active:scale-95 transition">Premium</button>
      </div>
    </section>

    <section class="space-y-3">
      ${setting('haptics', 'Vibración háptica', 'Pequeñas vibraciones al interactuar con la interfaz.')}
      ${setting('keepAwake', 'Pantalla siempre activa', 'Mantén la pantalla encendida durante la sesión.')}
      ${setting('highContrast', 'Modo enfoque', 'Reduce los efectos visuales para máxima calma.')}
    </section>

    <section class="mt-8 space-y-3">
      <button class="glass gilded-border rounded-xl p-4 w-full flex items-center justify-between text-left">
        <span class="font-body">Acerca de Hypnos Prime</span>
        <span class="material-symbols-outlined text-[color:var(--outline)]">chevron_right</span>
      </button>
      <button class="glass gilded-border rounded-xl p-4 w-full flex items-center justify-between text-left">
        <span class="font-body">Maestro Honorio Castillo</span>
        <span class="material-symbols-outlined text-[color:var(--outline)]">chevron_right</span>
      </button>
      <button id="installAction" class="glass gilded-border rounded-xl p-4 w-full flex items-center justify-between text-left">
        <span class="font-body text-[color:var(--primary)]">Instalar app en este dispositivo</span>
        <span class="material-symbols-outlined text-[color:var(--primary)]">download</span>
      </button>
    </section>

    <p class="text-center text-[11px] text-[color:var(--outline)] mt-12 font-label">v0.1 · DEMO INTERACTIVO</p>
  `;

  $$('[data-toggle]').forEach(b => {
    b.addEventListener('click', () => {
      const k = b.dataset.toggle;
      app.settings[k] = !app.settings[k];
      persist();
      applySettings();
      renderSettings();
      haptic();
    });
  });
  $('#installAction')?.addEventListener('click', triggerInstall);
}

function applySettings() {
  document.documentElement.classList.toggle('focus-mode', app.settings.highContrast);
  document.body.style.filter = app.settings.highContrast ? 'contrast(1.05) saturate(0.85)' : '';
}

// ---------- Render: Player ----------
function renderPlayer(sessionId) {
  const s = SESSIONS.find(x => x.id === sessionId) || HypnosAudio.getState().session || SESSIONS[0];
  const fav = app.favorites.has(s.id);

  $('#view-player').innerHTML = `
    <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      ${s.cover ? `
        <img src="${s.cover}" class="absolute inset-0 w-full h-full object-cover opacity-25 scale-125" alt="" style="filter: blur(28px);"/>
        <div class="absolute inset-0" style="background: radial-gradient(60% 40% at 50% 30%, transparent 0%, rgba(15,13,12,0.6) 60%, var(--bg) 100%);"></div>
      ` : ''}
      <div class="orb" style="background:${s.accent};width:480px;height:480px;left:-120px;top:-120px;opacity:0.10;"></div>
      <div class="orb" style="background:${s.accent};width:520px;height:520px;right:-160px;bottom:-160px;opacity:0.08;"></div>
    </div>

    <header class="flex justify-between items-center px-6 pt-5">
      <button onclick="history.back()" class="text-[color:var(--primary)] hover:opacity-70 transition">
        <span class="material-symbols-outlined text-[32px]">keyboard_arrow_down</span>
      </button>
      <h1 class="font-headline text-base tracking-[0.3em] uppercase gold-text">HYPNOS</h1>
      <button class="text-[color:var(--primary)] hover:opacity-70 transition">
        <span class="material-symbols-outlined">more_horiz</span>
      </button>
    </header>

    <main class="flex flex-col items-center justify-between min-h-[calc(100svh-60px)] px-6 pt-8 pb-10 max-w-[480px] mx-auto">
      <div class="w-full aspect-square relative flex items-center justify-center mt-2">
        <div class="absolute inset-8 rounded-full" style="background:radial-gradient(circle, ${s.accent}30 0%, transparent 70%);"></div>
        <div class="absolute inset-2 rounded-full border border-[color:var(--outline-variant)]/30 orbit-slow"></div>
        ${s.cover ? `
          <div id="playerArt" class="relative w-[78%] aspect-square rounded-full overflow-hidden gilded-border ${HypnosAudio.getState().playing && HypnosAudio.getState().session?.id===s.id ? 'breathe' : ''}" style="box-shadow:0 0 60px ${s.accent}50, inset 0 0 80px rgba(0,0,0,0.4);">
            <img src="${s.cover}" class="w-full h-full object-cover" alt=""/>
            <div class="absolute inset-0" style="background:radial-gradient(circle, transparent 40%, rgba(0,0,0,0.45) 100%);"></div>
          </div>
        ` : `
          <img src="assets/icons/logo.svg" id="playerArt" class="w-3/4 h-3/4 ${HypnosAudio.getState().playing && HypnosAudio.getState().session?.id===s.id ? 'breathe' : ''}" alt=""/>
        `}
      </div>

      <div class="text-center w-full mt-8">
        <span class="font-label text-[10px] text-[color:var(--primary)]/80">${s.badge}</span>
        <h2 class="font-headline text-2xl text-[color:var(--primary)] mt-2 leading-tight">${escapeHtml(s.title)}</h2>
        <p class="font-italic text-base text-[color:var(--on-variant)] opacity-80 mt-2">${escapeHtml(s.master)}</p>
        <div class="flex justify-center gap-2 mt-3 opacity-60 flex-wrap">
          <span class="font-label text-[10px]">${(s.carrier).toFixed(0)} Hz</span>
          <span class="text-[color:var(--primary)]">·</span>
          <span class="font-label text-[10px]">Δ ${s.beat} Hz</span>
          <span class="text-[color:var(--primary)]">·</span>
          <span class="font-label text-[10px]">${binauralBand(s.beat)}</span>
        </div>
      </div>

      <div class="w-full space-y-6 mt-8">
        <div class="space-y-2">
          <input id="seekRange" type="range" class="cosmic" min="0" max="${s.duration}" value="${HypnosAudio.getState().session?.id===s.id ? Math.floor(HypnosAudio.getState().currentTime) : 0}" />
          <div class="flex justify-between">
            <span id="curTime" class="font-label text-[10px] text-[color:var(--outline)]">0:00</span>
            <span class="font-label text-[10px] text-[color:var(--outline)]">${fmt(s.duration)}</span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <button id="favBtn" class="text-[color:${fav?'var(--primary)':'var(--outline)'}] hover:text-[color:var(--primary)] transition p-2">
            <span class="material-symbols-outlined" ${fav?'style="font-variation-settings:\'FILL\' 1;"':''}>favorite</span>
          </button>
          <button id="prevBtn" class="text-[color:var(--primary-dim)] hover:text-[color:var(--primary)] transition">
            <span class="material-symbols-outlined text-[36px]">skip_previous</span>
          </button>
          <button id="playBtn" class="w-20 h-20 rounded-full gold-fill flex items-center justify-center gold-glow active:scale-95 transition">
            <span id="playIcon" class="material-symbols-outlined text-[48px]" style="font-variation-settings:'FILL' 1;">
              ${HypnosAudio.getState().playing && HypnosAudio.getState().session?.id===s.id ? 'pause' : 'play_arrow'}
            </span>
          </button>
          <button id="nextBtn" class="text-[color:var(--primary-dim)] hover:text-[color:var(--primary)] transition">
            <span class="material-symbols-outlined text-[36px]">skip_next</span>
          </button>
          <button id="shareBtn" class="text-[color:var(--outline)] hover:text-[color:var(--primary)] transition p-2">
            <span class="material-symbols-outlined">ios_share</span>
          </button>
        </div>

        <div class="flex items-center gap-3 px-2">
          <span class="material-symbols-outlined text-[color:var(--outline)] text-[20px]">volume_down</span>
          <input id="volRange" type="range" class="cosmic" min="0" max="100" value="${Math.round(HypnosAudio.getState().volume*100)}" />
          <span class="material-symbols-outlined text-[color:var(--outline)] text-[20px]">volume_up</span>
        </div>

        <p class="text-center text-[12px] text-[color:var(--on-variant)]/70 italic px-4 max-w-sm mx-auto">
          ${escapeHtml(s.description)}
        </p>

        <div class="flex justify-center gap-3 opacity-70 flex-wrap pt-2">
          ${['CUERPO','MENTE','EMOCIÓN','ESPÍRITU'].map((w,i,arr)=>`
            <span class="font-label text-[10px] text-[color:var(--on-variant)]">${w}</span>
            ${i<arr.length-1 ? '<span class="text-[color:var(--primary)] text-[6px] leading-[16px]">●</span>' : ''}
          `).join('')}
        </div>
      </div>
    </main>
  `;

  // Wiring
  const $play = $('#playBtn'); const $icon = $('#playIcon');
  const $seek = $('#seekRange'); const $cur = $('#curTime');
  const $vol  = $('#volRange'); const $fav = $('#favBtn');
  const $prev = $('#prevBtn'); const $next = $('#nextBtn'); const $share = $('#shareBtn');

  $play.addEventListener('click', () => {
    haptic();
    const st = HypnosAudio.getState();
    if (st.playing && st.session?.id === s.id) HypnosAudio.pause();
    else HypnosAudio.play(s);
  });
  $seek.addEventListener('input', () => {
    $cur.textContent = fmt(parseFloat($seek.value));
    const pct = (parseFloat($seek.value) / s.duration) * 100;
    $seek.style.setProperty('--p', `${pct}%`);
  });
  $seek.addEventListener('change', () => HypnosAudio.seek(parseFloat($seek.value)));
  $vol.addEventListener('input', () => {
    HypnosAudio.setVolume(parseFloat($vol.value)/100);
    const pct = parseFloat($vol.value);
    $vol.style.setProperty('--p', `${pct}%`);
  });
  $fav.addEventListener('click', () => { toggleFav(s.id); haptic(); renderPlayer(s.id); });
  $share.addEventListener('click', async () => {
    haptic();
    try {
      if (navigator.share) await navigator.share({ title: s.title, text: `Escucha "${s.title}" en Hypnos Prime`, url: location.href });
      else { await navigator.clipboard.writeText(location.href); toast('Enlace copiado'); }
    } catch {}
  });
  $prev.addEventListener('click', () => playNeighbor(s, -1));
  $next.addEventListener('click', () => playNeighbor(s, +1));

  // Inicializa progreso
  const st = HypnosAudio.getState();
  if (st.session?.id === s.id) {
    $cur.textContent = fmt(st.currentTime);
    const pct = (st.currentTime / s.duration) * 100;
    $seek.style.setProperty('--p', `${pct}%`);
  } else {
    $seek.style.setProperty('--p', '0%');
  }
  $vol.style.setProperty('--p', `${Math.round(st.volume*100)}%`);

  // Pantalla activa
  requestWakeLock();
}

function binauralBand(b) {
  if (b < 4)  return 'DELTA';
  if (b < 8)  return 'THETA';
  if (b < 13) return 'ALFA';
  if (b < 30) return 'BETA';
  return 'GAMMA';
}

function playNeighbor(current, dir) {
  const i = SESSIONS.findIndex(s => s.id === current.id);
  const next = SESSIONS[(i + dir + SESSIONS.length) % SESSIONS.length];
  location.hash = `#/player/${next.id}`;
  setTimeout(() => HypnosAudio.play(next), 60);
}

// ---------- Mini player ----------
function updateMiniPlayerVisibility() {
  const mp = $('#miniPlayer');
  const st = HypnosAudio.getState();
  const show = !!st.session && app.currentView !== 'welcome' && app.currentView !== 'player';
  mp.classList.toggle('visible', show);
}

function renderMiniPlayer() {
  const st = HypnosAudio.getState();
  if (!st.session) { $('#miniPlayer').classList.remove('visible'); return; }
  const s = st.session;
  const pct = (st.currentTime / s.duration) * 100;
  $('#miniPlayer').innerHTML = `
    <div class="glass gilded-border rounded-xl flex items-center gap-3 p-2 pr-3 overflow-hidden">
      <button onclick="location.hash='#/player/${s.id}'" class="w-12 h-12 rounded-lg gilded-border overflow-hidden shrink-0 relative" style="background:radial-gradient(120% 80% at 30% 30%, ${s.accent}33, transparent 70%);">
        ${s.cover
          ? `<img src="${s.cover}" class="absolute inset-0 w-full h-full object-cover ${st.playing?'breathe':''}" alt=""/>`
          : `<img src="assets/icons/logo.svg" class="absolute inset-0 m-auto w-9 h-9 ${st.playing?'breathe':''}" alt=""/>`}
      </button>
      <button onclick="location.hash='#/player/${s.id}'" class="flex-1 min-w-0 text-left">
        <p class="font-headline text-sm truncate">${escapeHtml(s.title)}</p>
        <p class="font-label text-[9px] text-[color:var(--on-variant)] truncate mt-0.5">${escapeHtml(s.master)} · ${fmt(st.currentTime)} / ${fmt(s.duration)}</p>
      </button>
      <button id="miniToggle" class="w-10 h-10 rounded-full gold-fill flex items-center justify-center shrink-0 gold-glow-soft">
        <span class="material-symbols-outlined text-[22px]" style="font-variation-settings:'FILL' 1;">${st.playing ? 'pause' : 'play_arrow'}</span>
      </button>
    </div>
    <div class="h-[2px] mt-1 mx-1 bg-[color:var(--outline-variant)]/40 rounded-full overflow-hidden">
      <div class="h-full bg-[color:var(--primary)]" style="width:${pct}%; box-shadow:0 0 8px rgba(242,202,80,0.5);"></div>
    </div>
  `;
  $('#miniToggle')?.addEventListener('click', (e) => {
    e.stopPropagation();
    HypnosAudio.toggle();
    haptic();
  });
  updateMiniPlayerVisibility();
}

// ---------- Helpers de interacción ----------
function attachSessionTriggers(root) {
  $$('[data-play]', root).forEach(b => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = b.dataset.play;
      const s = SESSIONS.find(x => x.id === id);
      if (!s) return;
      haptic();
      location.hash = `#/player/${id}`;
      setTimeout(() => HypnosAudio.play(s), 80);
    });
  });
  $$('[data-fav]', root).forEach(b => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFav(b.dataset.fav);
      haptic();
      if (app.currentView === 'home') renderHome();
      if (app.currentView === 'library') renderLibrary();
      if (app.currentView === 'search') renderSearch();
    });
  });
  $$('[data-category]', root).forEach(b => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      app.libraryFilter = b.dataset.category;
      location.hash = '#/library';
    });
  });
  $$('[data-filter]', root).forEach(b => {
    b.addEventListener('click', () => {
      app.libraryFilter = b.dataset.filter;
      renderLibrary();
    });
  });
}

function toggleFav(id) {
  if (app.favorites.has(id)) app.favorites.delete(id);
  else { app.favorites.add(id); toast('Añadido a favoritos'); }
  persist();
}

// ---------- Wake Lock ----------
let wakeLock = null;
async function requestWakeLock() {
  if (!app.settings.keepAwake) return;
  if (!('wakeLock' in navigator)) return;
  try {
    if (wakeLock) wakeLock.release();
    wakeLock = await navigator.wakeLock.request('screen');
  } catch {}
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && app.currentView === 'player') requestWakeLock();
});

// ---------- PWA install ----------
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  $('#installBtn')?.removeAttribute('hidden');
});
function triggerInstall() {
  if (!deferredPrompt) { toast('Usa "Añadir a inicio" en tu navegador'); return; }
  deferredPrompt.prompt();
  deferredPrompt.userChoice.finally(() => { deferredPrompt = null; $('#installBtn')?.setAttribute('hidden',''); });
}

// ---------- Bootstrap ----------
function setupShell() {
  // Welcome buttons
  $('#enterBtn')?.addEventListener('click', () => { haptic(); location.hash = '#/home'; });
  $('#registerBtn')?.addEventListener('click', () => { haptic(); location.hash = '#/home'; });
  $('#forgotBtn')?.addEventListener('click', () => toast('Demo: recuperación deshabilitada'));

  // Bottom nav
  $$('.nav-btn').forEach(b => {
    b.addEventListener('click', () => {
      haptic();
      location.hash = `#/${b.dataset.view}`;
    });
  });

  $('#installBtn')?.addEventListener('click', triggerInstall);

  // Suscríbete al motor de audio
  HypnosAudio.subscribe((evt) => {
    renderMiniPlayer();
    if (app.currentView === 'player') {
      // Update progress UI without re-rendering
      const $seek = $('#seekRange'); const $cur = $('#curTime'); const $icon = $('#playIcon');
      if ($seek && $cur && evt.session) {
        $seek.value = Math.floor(evt.currentTime);
        $cur.textContent = fmt(evt.currentTime);
        const pct = (evt.currentTime / evt.session.duration) * 100;
        $seek.style.setProperty('--p', `${pct}%`);
        const art = $('#playerArt');
        if (art) art.classList.toggle('breathe', evt.playing);
      }
      if ($icon) $icon.textContent = evt.playing ? 'pause' : 'play_arrow';
    }
  });

  applySettings();
}

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', () => {
  setupShell();
  // splash
  setTimeout(() => {
    const sp = $('#splash');
    if (sp) {
      sp.classList.add('splash-leave');
      setTimeout(() => sp.remove(), 700);
    }
    route();
  }, 900);

  // Register SW
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
});
