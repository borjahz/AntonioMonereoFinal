// ——— Google Analytics condicional ———
function loadAnalytics() {
  if (document.getElementById('ga-script')) return;
  const s = document.createElement('script');
  s.id = 'ga-script';
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-WW7LC8SFJ5';
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-WW7LC8SFJ5', { page_path: location.pathname });
}

function initCookieModal() {
  const consent = localStorage.getItem('cookieConsent');
  const modal   = document.getElementById('cookieModal');

  if (!consent) {
    modal.classList.remove('hidden');
  } else if (consent === 'accepted') {
    loadAnalytics();
  }

  document.getElementById('acceptCookies').addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    loadAnalytics();
    modal.classList.add('hidden');
  });
  document.getElementById('denyCookies').addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'denied');
    modal.classList.add('hidden');
  });
  document.getElementById('cookieCloseBtn').addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'denied');
    modal.classList.add('hidden');
  });
}
function setupLegalModals() {
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      document.getElementById(modalId).classList.remove('hidden');
    });
  });
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal').classList.add('hidden');
    });
  });
}

// Dentro de window.load:
window.addEventListener('load', () => {
  initCookieModal();
  setupLegalModals();
  // …el resto de tu init para splash/galería, etc.

  const splash      = document.getElementById('splash');
  const video       = document.getElementById('splashVideo');
  const mainContent = document.getElementById('mainContent');
  if (!splash || !video || !mainContent) return;
  // >>> Forzamos atributos imprescindibles para autoplay en móvil:
  video.autoplay = true;
  video.muted = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.setAttribute('preload', 'auto');

  // --- Opcional: arrancar sólo cuando haya suficiente buffer ---
  video.addEventListener('canplaythrough', () => {
  video.play().catch(err => {
    console.warn('Autoplay bloqueado:', err);
  });
});

  // Cuando el vídeo termina, lanzamos la transición cruzada
  video.addEventListener('ended', () => {
  splash.addEventListener('transitionend', () => {
    splash.remove();
    mainContent.classList.add('visible');
  }, { once: true });

  // ahora ocultamos
  splash.classList.add('hidden');
});

  // Fallback: por si 'ended' no se dispara (carga slow)
  video.addEventListener('loadedmetadata', () => {
    setTimeout(() => {
      if (!splash.classList.contains('hidden')) {
        video.pause();
        video.dispatchEvent(new Event('ended'));
      }
    },5000);
  });
});

// ——— Global keys & state ———
const dataKey = 'fs_positions';
const defaultPositions = {};
const darkKey = 'fs_dark';
const keyStep = 10;
let state = { el: null, sx: 0, sy: 0, ox: 0, oy: 0, lt: null };
const DEBUG = false;
function getRect() {
  return document.querySelector('.gallery-container').getBoundingClientRect();
}
function save() {
  const o = {};
  document.querySelectorAll('.draggable').forEach(i => {
    o[i.id] = { x: i.offsetLeft, y: i.offsetTop };
  });
  localStorage.setItem(dataKey, JSON.stringify(o));
}
function load() {
  const saved = JSON.parse(localStorage.getItem(dataKey) || '{}');
  const galleryRect = getRect();

  document.querySelectorAll('.draggable').forEach(img => {
    let x, y;

    if (saved[img.id] != null) {
      // Si hay posición guardada, úsala
      x = saved[img.id].x;
      y = saved[img.id].y;
    } else {
      // Si no hay guardado, usa la posición por defecto del CSS
      const def = defaultPositions[img.id] || { x: 0, y: 0 };
      x = def.x;
      y = def.y;
    }

    // Aseguramos que no se salga del contenedor
    const maxX = galleryRect.width  - img.offsetWidth;
    const maxY = galleryRect.height - img.offsetHeight;
    x = Math.min(Math.max(0, x), maxX);
    y = Math.min(Math.max(0, y), maxY);

    img.style.left = x + 'px';
    img.style.top  = y + 'px';
  });
}
function setupLoad(i) {
  if (i.complete) return;
  i.classList.add('image-loading');
  i.onload  = () => i.classList.remove('image-loading');
  i.onerror = () => {
    i.classList.remove('image-loading');
    i.classList.add('image-error');
  };
}
function toggleDark() {
  const d = document.body.classList.toggle('dark');
  localStorage.setItem(darkKey, d);
}
function showPop(i) {
  console.log('🔔 showPop invocado para', i.id);
  const pop = document.getElementById('popup');
  const imgTag = document.getElementById('popupImage');
  const titleTag= document.getElementById('popupTitle');
  const descTag= document.getElementById('popupDescription');
  const detalleLista = document.getElementById('detalleLista');
  // Comprueba si existe data-popup-src; si no, usa la miniatura (i.src)
  const nuevaSrc = i.dataset.popupSrc || i.src;
  imgTag.src     = nuevaSrc;

  titleTag.textContent = i.alt;
  descTag.textContent  = i.dataset.description;
    // 3) Limpiar la lista de detalles (para evitar duplicados de popups anteriores)
  detalleLista.innerHTML = '';

  // 4) Leer atributos específicos de la miniatura
  const tecnica    = i.dataset.detailTecnica    || 'No disponible';
  const medidas    = i.dataset.detailMedidas    || 'No disponible';
  const ano        = i.dataset.detailAno        || 'No disponible';
  const proceso    = i.dataset.detailProceso    || 'No disponible';
  const inspiracion = i.dataset.detailInspiracion || 'No disponible';

  // 5) Crear cinco elementos <li> con cada detalle
  const items = [
    `Técnica: ${tecnica}`,
    `Medidas: ${medidas}`,
    `Año de ejecución: ${ano}`,
    `Proceso creativo: ${proceso}`,
    `Inspiración: ${inspiracion}`
  ];

  items.forEach(texto => {
    const li = document.createElement('li');
    li.textContent = texto;
    detalleLista.appendChild(li);
  });

  pop.classList.add('active');
}
function closePop() {
   // Si estamos en pantalla completa, salimos primero
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
  document.getElementById('popup').classList.remove('active');
}


// ——— Main initialization ———

  document.addEventListener('DOMContentLoaded', () => {

    localStorage.removeItem(dataKey);
      // ——— Textos traducibles ———
  const texts = {
    // Nav / modales
    about:           { es: 'Info',             en: 'About' },
    contact:         { es: 'Contacto',          en: 'Contact' },
    aboutTitle:      { es: 'Sobre Family Style',en: 'About Family Style' },
    contactTitle:    { es: 'Envíanos un email',  en: 'Send us an email' },
    close:           { es: 'Cerrar',            en: 'Close' },
    aboutInfo:     { es: 'Family Style es un estudio de diseño y desarrollo web.', en: 'Family Style is a web design and development studio.' },
    pubBtn:         { es: 'Publicaciones',    en: 'Publications' },
    Shangay:      { es: 'Entrevista Shangay',         en: 'Shangay Interview' },
    Telemadrid: { es: 'Entrevista Telemadrid',        en: 'Telemadrid Interview' },
    Elbloque:   { es: 'Exposición El Bloque',          en: 'El Bloque Exhibition' },
    // Filtros
    filterAll:       { es: 'Antonio Monereo',  en: 'Antonio Monereo' },
    filterCopies:    { es: 'Copias',           en: 'Copies' },
    filterPaintings: { es: 'Pinturas',         en: 'Paintings' },
    filterDrawings:  { es: 'Dibujos',          en: 'Drawings' },
    // Imagenes
    Sillamoderna: { es: 'Silla moderna',    en: 'Modern Chair' },
  };

  // Aplica un idioma a todos los data-i18n
  function applyLang(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (texts[key]) el.textContent = texts[key][lang];
    });
    localStorage.setItem('lang', lang);
  }

  // Inicializa al cargar
  let lang = localStorage.getItem('lang') || 'es';
  applyLang(lang);

  // Alterna ESP/EN al pulsar
  document.getElementById('langToggle')
    .addEventListener('click', () => {
      lang = (lang === 'es' ? 'en' : 'es');
      applyLang(lang);
    });
    // — Toggle del menú de Publicaciones —
const pubBtn  = document.getElementById('pubBtn');
const pubMenu = document.getElementById('pubMenu');
const bottomSheet = document.getElementById('bottomSheet');

// Al hacer clic, alternar la clase "open" en el contenedor .dropdown
pubBtn.addEventListener('click', e => {
  e.stopPropagation();             // evita cerrar al hacer clic en el botón
  pubBtn.parentElement.classList.toggle('open');
});

// Si haces clic fuera, cierra el menú
document.addEventListener('click', () => {
  pubBtn.parentElement.classList.remove('open');
  });

// 1) Cachea nodos
const galleryItems = Array.from(document.querySelectorAll('.image-gallery .draggable'));
// 2) Define la función de filtrado
function filterBy(cat) {
  galleryItems.forEach(img => {
    img.style.display = (cat === 'all' || img.dataset.category === cat) ? '' : 'none';
  });
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === cat);
  });
}
// 0) Cachear el homeBtn móvil
const homeBtnMobile = document.getElementById('homeBtn');

// 1) Al clicar en móvil sobre "Antonio Monereo"
homeBtnMobile.addEventListener('click', e => {
  e.preventDefault();
  // a) Resetear filtros igual que si clicases "all"
  filterBy('all');
  // b) Cerrar menú lateral si estuviera abierto
  document.body.classList.remove('menu-open');
  // c) Si usas bottomSheet para filtros, ciérralo también
  if (typeof bottomSheet !== 'undefined') {
    bottomSheet.classList.remove('open');
  }
});

// 3) Asocia los listeners
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.cat;    // 'all' | 'copias' | 'pinturas' | 'dibujos'
    filterBy(cat);
    bottomSheet.classList.remove('open');  // cierra el panel en móvil si está abierto
  });
});
// 4) Aplica estado inicial
filterBy('all');
  
  // — ACCIONES DE NAVEGACIÓN —  
  document.querySelectorAll('.sheet-nav').forEach(btn => {
    btn.addEventListener('click', () => {
      switch (btn.dataset.action) {
        case 'about':   document.getElementById('aboutBtn').click();     break;
        case 'contact': document.getElementById('contactBtn').click();    break;
        case 'dark':    document.getElementById('darkModeToggle').click();break;
        case 'reset':   document.getElementById('resetBtn').click();      break;
      }
      bottomSheet.classList.remove('open');
    });
  });

  // — RESET, DARK, ABOUT, CONTACT —  
  const resetBtn   = document.getElementById('resetBtn');
  const darkBtn    = document.getElementById('darkModeToggle');
  const aboutBtn  = document.getElementById('aboutBtn');
  const aboutSec   = document.getElementById('aboutSection');
  const closeAbout = document.getElementById('closeAbout');
  const pop        = document.getElementById('popup');
  const closePopBtn= document.getElementById('closePopup');
// — HEADER MÓVIL: hamburguesa, home y lupa —

// 1) Menú hamburguesa (tú lo usarás para mostrar tu nav lateral)
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileNav     = document.getElementById('mobileNav');
hamburgerBtn.addEventListener('click', () => {
  const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
  hamburgerBtn.setAttribute('aria-expanded', String(!isExpanded));
  mobileNav.hidden = isExpanded;
  document.body.classList.toggle('menu-open', !isExpanded);
  // Opcional: mueve el foco al primer ítem del menú
  if (!isExpanded) {
    mobileNav.querySelector('[role="menuitem"]')?.focus();
  }
  hamburgerBtn.setAttribute(
  'aria-label',
  !isExpanded ? 'Cerrar menú' : 'Abrir menú'
);
hamburgerBtn.focus();
});
// ——— Cerrar menú al hacer click en un ítem ———
const menuItems = mobileNav.querySelectorAll('[role="menuitem"]');
menuItems.forEach(item => {
  item.addEventListener('click', () => {
    // 1) Cerrar el nav
    mobileNav.hidden = true;
    // 2) Actualizar ARIA en el botón
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.setAttribute('aria-label', 'Abrir menú');
    // 3) Quitar clase de estilos abiertos (si la usas)
    document.body.classList.remove('menu-open');
    // 4) (Opcional) devolver foco al contenido principal  
    document.getElementById('gallery')?.focus();
  });
});

// 1) Filtros: reutiliza tu función `filterGallery`
document.querySelectorAll('.mobile-nav-btn[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    const filt = btn.getAttribute('data-filter');
    filterBy(filt);            // ← usa la función existente
    document.body.classList.remove('menu-open');
  });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && hamburgerBtn.getAttribute('aria-expanded') === 'true') {
    hamburgerBtn.click();  // reutiliza tu propio toggle
  }
});
// 2) Info (About) y Contact
document.getElementById('aboutNav').addEventListener('click', () => {
  document.getElementById('aboutBtn').click();
  document.body.classList.remove('menu-open');
});
document.getElementById('contactNav').addEventListener('click', () => {
  document.getElementById('contactBtn').click();
  document.body.classList.remove('menu-open');
});
// — Toggle del submenú “Publicaciones” —
const pubNavBtn = document.getElementById('pubNav');
const pubNavLi  = pubNavBtn.parentElement;  // <li class="has-submenu">
pubNavBtn.addEventListener('click', e => {
  e.stopPropagation();
  const isOpen = pubNavBtn.getAttribute('aria-expanded') === 'true';
  pubNavBtn.setAttribute('aria-expanded', String(!isOpen));
  pubNavLi.classList.toggle('open');

});

// Cerrar submenú si clicas fuera del mismo
document.addEventListener('click', () => {
  if (pubNavLi.classList.contains('open')) {
    pubNavBtn.setAttribute('aria-expanded', 'false');
    pubNavLi.classList.remove('open');
  }
});


// 2) Botón Home (scroll al inicio)
const homeBtn = document.getElementById('homeBtn');
homeBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

 // ——— BÚSQUEDA SOBRE LA GALERÍA ———
 const searchBtns      = [
  document.getElementById('searchBtnMobile'),
  document.getElementById('searchBtnDesktop')
].filter(Boolean);

const searchContainer = document.getElementById('searchContainer');
const searchForm      = document.getElementById('searchForm');
const searchInput     = document.getElementById('searchInput');
const thumbnails      = Array.from(document.querySelectorAll('.draggable'));

// 1) Engancha el mismo handler a cada botón de búsqueda
searchBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      searchContainer.classList.toggle('hidden');
      if (!searchContainer.classList.contains('hidden')) {
        searchInput.focus();
      }
    });
  });

// 2) Cerrar la barra si clicas fuera de ella O de cualquiera de los botones
document.addEventListener('click', e => {
    const clickedBtn = searchBtns.some(btn => btn === e.target);
    if (!searchContainer.contains(e.target) && !clickedBtn) {
      searchContainer.classList.add('hidden');
    }
});

// 3) Filtrar miniaturas al enviar
searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const q = searchInput.value.trim().toLowerCase();
  thumbnails.forEach(img => {
    const hayTexto = (
      img.id + ' ' +
      img.alt + ' ' +
      (img.dataset.description || '')
    ).toLowerCase();
    img.style.display = hayTexto.includes(q) ? '' : 'none';
  });
});
// ——— FIN BÚSQUEDA ———



  // Reset sin recargar
  resetBtn.onclick = () => {
    localStorage.removeItem(dataKey);
    document.querySelectorAll('.draggable').forEach(img => {
      img.style.left = '';
      img.style.top  = '';
    });
    load();
  };
  // Dark mode persistente
  if (localStorage.getItem(darkKey) === 'true') document.body.classList.add('dark');
  darkBtn.onclick = toggleDark;
  // Modal About
  aboutBtn.addEventListener('click', e => {
     e.preventDefault();
     aboutSec.classList.remove('hidden');
     aboutBtn.setAttribute('aria-expanded', 'true');
     aboutSec.setAttribute('aria-hidden', 'false');
    closeAbout.focus();
    });
  
  closeAbout.onclick = () => aboutSec.classList.add('hidden');

 // —— Modal Contact ——
   // 1) Captura correctamente todos los nodos que vas a usar
   const contactSec     = document.getElementById('contactSection');
   const closeContact   = document.getElementById('closeContact');
   const contactBtn     = document.getElementById('contactBtn');



// Abrir modal
contactBtn.addEventListener('click', () => {
  contactSec.classList.remove('hidden');
  contactBtn.setAttribute('aria-expanded', 'true');
  sendMailBtn.focus();    // o closeContact.focus();
});
// Cerrar modal (botón X)
closeContact.addEventListener('click', () => {
  contactSec.classList.add('hidden');
  contactBtn.setAttribute('aria-expanded', 'false');
  contactBtn.focus();
});
const sendMailBtn = document.getElementById('sendMailBtn');
sendMailBtn.addEventListener('click', () => {
  // reemplaza con los correos destino, separados por comas si son varios
  window.location.href = 'mailto:antoniomonelopez@gmail.com';
});

// Cerrar con Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !contactSec.classList.contains('hidden')) {
    closeContact.click();
  }
});
  // Cerrar modales con Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!aboutSec.classList.contains('hidden')) aboutSec.classList.add('hidden');
      if (pop.classList.contains('active')) closePop();
    }
  });

  // — CONFIGURAR IMÁGENES DRAG & POPUP —  
  const imgs = Array.from(document.querySelectorAll('.draggable'));
  imgs.forEach(img => {
      img.style.position = 'absolute';
    });
imgs.forEach(img => {
  const galleryRect = getRect();              // tu función que devuelve .gallery-container.getBoundingClientRect()
const imgRect     = img.getBoundingClientRect();
defaultPositions[img.id] = {
  x: imgRect.left - galleryRect.left,
  y: imgRect.top  - galleryRect.top
};
});
load();
  let R = getRect();
  imgs.forEach(i => {
    setupLoad(i);
    i.tabIndex = 0;
  });
  window.addEventListener('resize', () => { R = getRect(); load(); });

  imgs.forEach(i => {
    i.onpointerdown = e => {
      // Sólo preventDefault si no es touch, para no romper el doble‐tap en móvil
      if (e.pointerType !== 'touch') {
        e.preventDefault();
      }
      state.el = i;
      state.sx = e.clientX;
      state.sy = e.clientY;
      state.ox = i.offsetLeft;
      state.oy = i.offsetTop;
      i.setPointerCapture(e.pointerId);
    };
    i.onpointermove = e => {
      if (!state.el) return;
  let x = state.ox + (e.clientX - state.sx);
  let y = state.oy + (e.clientY - state.sy);

  console.log(`Moviendo: ${i.id}, X: ${x}, Y: ${y}, R.width: ${R.width}, R.height: ${R.height}`);

  x = Math.min(Math.max(0, x), R.width  - i.offsetWidth);
  y = Math.min(Math.max(0, y), R.height - i.offsetHeight);
  
    i.style.left  = `${x}px`;
    i.style.top   = `${y}px`;
    };
    i.onpointerup = e => {
      if (state.el) {
           // Limpia transform para que no interfiera
  state.el.style.transform = '';
        save();
        state.el.releasePointerCapture(e.pointerId);
        state.el = null;
      }
    };
// — Tap sencillo en móvil para abrir popup —
// 1) dejamos intacto el dblclick para escritorio
i.ondblclick = () => showPop(i);

// 2) añadimos click sólo en dispositivos táctiles
if ('ontouchstart' in window) {
  i.addEventListener('click', e => {
    e.stopPropagation();   // que no “rebote” el click al overlay
    showPop(i);
  });
}

    i.onkeydown = e => {
      let moved = false, x = i.offsetLeft, y = i.offsetTop;
      switch (e.key) {
        case 'ArrowLeft':
          x = Math.max(0, x - keyStep); moved = true; break;
        case 'ArrowRight':
          x = Math.min(R.width - i.offsetWidth, x + keyStep); moved = true; break;
        case 'ArrowUp':
          y = Math.max(0, y - keyStep); moved = true; break;
        case 'ArrowDown':
          y = Math.min(R.height - i.offsetHeight, y + keyStep); moved = true; break;
        case 'Enter':
        case ' ':
          showPop(i); break;
      }
      if (moved) {
        e.preventDefault();
          i.style.left  = `${x}px`;
        i.style.top   = `${y}px`;
        save();
      }
    };
  });

  closePopBtn.onclick = closePop;
  pop.onclick = e => { if (e.target === pop) closePop(); };

  // Dinámico
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  
// --------------- FULLSCREEN AL DOUBLE-CLICK / DOUBLE-TAP ---------------

// 1) Referencia al <img> del popup
const popupImg = document.getElementById('popupImage');

// 2) Listener de doble clic en escritorio
popupImg.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    popupImg.requestFullscreen().catch(err => {
      console.error(`Error al pedir fullscreen: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
});

// 3) Listener de “double-tap” en móvil (touchend)
let lastTap = 0;
popupImg.addEventListener('touchend', e => {
  const currentTime = new Date().getTime();
  const tapLength   = currentTime - lastTap;
  if (tapLength < 300 && tapLength > 0) {
    // Double-tap detectado: toggle fullscreen
    if (!document.fullscreenElement) {
      popupImg.requestFullscreen().catch(err => {
        console.error(`Error al pedir fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }
  lastTap = currentTime;
});
});

