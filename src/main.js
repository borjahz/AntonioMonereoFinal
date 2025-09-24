// â€”â€”â€” Google Analytics condicional â€”â€”â€”
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
  // â€¦el resto de tu init para splash/galerÃ­a, etc.

  const splash      = document.getElementById('splash');
  const video       = document.getElementById('splashVideo');
  const mainContent = document.getElementById('mainContent');
  if (!splash || !video || !mainContent) return;
  // >>> Forzamos atributos imprescindibles para autoplay en mÃ³vil:
  video.autoplay = true;
  video.muted = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.setAttribute('preload', 'auto');

  // --- Opcional: arrancar sÃ³lo cuando haya suficiente buffer ---
  video.addEventListener('canplaythrough', () => {
  video.play().catch(() => {
    /* Autoplay might be blocked; ignore the error */
  });
});

  // Cuando el vÃ­deo termina, lanzamos la transiciÃ³n cruzada
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

// â€”â€”â€” Global keys & state â€”â€”â€”
const darkKey = 'fs_dark';
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
  const pop = document.getElementById('popup');
  const imgTag = document.getElementById('popupImage');
  const titleTag= document.getElementById('popupTitle');
  const descTag= document.getElementById('popupDescription');
  const detalleLista = document.getElementById('detalleLista');
  // Comprueba si existe data-popup-src; si no, usa la miniatura (i.src)
  const nuevaSrc = i.dataset.popupSrc || i.src;
  imgTag.src     = nuevaSrc;

  titleTag.textContent = i.alt;
    // Permitir saltos de lÃ­nea o HTML sencillo en la descripciÃ³n
  descTag.innerHTML = (i.dataset.description || '').replace(/\n/g, '<br>');
    // 3) Limpiar la lista de detalles (para evitar duplicados de popups anteriores)
  detalleLista.innerHTML = '';

 const story = i.dataset.detailStory;
  if (story) {
    const li = document.createElement('li');
    li.textContent =story;
    detalleLista.appendChild(li);
 } else {
    const tecnica    = i.dataset.detailTecnica    || 'No disponible';
    const medidas    = i.dataset.detailMedidas    || 'No disponible';
    const ano        = i.dataset.detailAno        || 'No disponible';
    const proceso    = i.dataset.detailProceso    || 'No disponible';
    const inspiracion = i.dataset.detailInspiracion || 'No disponible';

    const items = [
      `TÃ©cnica: ${tecnica}`,
      `Medidas: ${medidas}`,
      `AÃ±o de ejecuciÃ³n: ${ano}`,
      `Proceso creativo: ${proceso}`,
      `InspiraciÃ³n: ${inspiracion}`
    ];

    items.forEach(texto => {
      const li = document.createElement('li');
      li.textContent = texto;
      detalleLista.appendChild(li);
    });
  }
  pop.classList.add('active');
}
function closePop() {
   // Si estamos en pantalla completa, salimos primero
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
  document.getElementById('popup').classList.remove('active');
}


// â€”â€”â€” Main initialization â€”â€”â€”

  document.addEventListener('DOMContentLoaded', () => {

      // â€”â€”â€” Textos traducibles â€”â€”â€”
  const texts = {
    // Nav / modales
    about:           { es: 'Info',             en: 'About' },
    contact:         { es: 'Contacto',          en: 'Contact' },
    aboutTitle:      { es: 'Sobre Family Style',en: 'About Family Style' },
    contactTitle:    { es: 'EnvÃ­anos un email',  en: 'Send us an email' },
    close:           { es: 'Cerrar',            en: 'Close' },
    aboutInfo:     { es: 'Family Style es un estudio de diseÃ±o y desarrollo web.', en: 'Family Style is a web design and development studio.' },
    pubBtn:         { es: 'Publicaciones',    en: 'Publications' },
    Shangay:      { es: 'Entrevista Shangay',         en: 'Shangay Interview' },
    Telemadrid: { es: 'Entrevista Telemadrid',        en: 'Telemadrid Interview' },
    Elbloque:   { es: 'ExposiciÃ³n El Bloque',          en: 'El Bloque Exhibition' },
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
    // â€” Toggle del menÃº de Publicaciones â€”
const pubBtn  = document.getElementById('pubBtn');
const pubMenu = document.getElementById('pubMenu');
const bottomSheet = document.getElementById('bottomSheet');

const initFolderVisibility = () => {
  const folders = Array.from(document.querySelectorAll('.folder-year'));
  if (!folders.length) return;
  const validCats = new Set(['copias', 'pinturas', 'dibujos']);
  const bodyClasses = ['cat-copias', 'cat-pinturas', 'cat-dibujos'];

  const apply = (cat) => {
    const normalized = (!window.__forceNoCat && cat && validCats.has(cat)) ? cat : null;
    window.__currentCat = normalized;
    document.body.classList.remove(...bodyClasses);
    folders.forEach(el => {
      const match = normalized && el.getAttribute('data-category') === normalized;
      el.style.display = match ? 'block' : 'none';
    });
    if (normalized) document.body.classList.add('cat-' + normalized);
  };

  window.__forceNoCat = false;
  window.__currentCat = null;
  folders.forEach(el => { el.style.display = 'none'; });

  const schedule = (cat) => {
    window.__forceNoCat = false;
    setTimeout(() => apply(cat), 0);
  };
  const reset = () => {
    window.__forceNoCat = true;
    setTimeout(() => apply(null), 0);
  };

  const hook = (btn, getCat) => btn.addEventListener('click', () => schedule(getCat(btn)));

  document.querySelectorAll('.filter-btn').forEach(btn => hook(btn, el => el.dataset.cat));
  document.querySelectorAll('.mobile-nav-btn[data-filter]').forEach(btn => hook(btn, el => el.getAttribute('data-filter')));
  document.querySelectorAll('.sheet-filter').forEach(btn => hook(btn, el => el.dataset.cat));

  const homeBtn = document.getElementById('homeBtn');
  if (homeBtn) homeBtn.addEventListener('click', reset);

  const active = document.querySelector('.filter-btn.active');
  apply(validCats.has(active?.dataset.cat) ? active.dataset.cat : null);
};

const initFolderDefaults = () => {
  const idMap = { copias:'Folder2025', pinturas:'PaintFolder2025', dibujos:'DrawFolder2025' };
  const triggerDefault = (cat) => {
    if (!cat || !(cat in idMap)) return;
    const target = document.getElementById(idMap[cat]);
    if (!target) return;
    setTimeout(() => target.dispatchEvent(new MouseEvent('click', { bubbles: true })), 0);
  };
  const active = document.querySelector('.filter-btn.active');
  if (active) triggerDefault(active.dataset.cat);
  document.querySelectorAll('.filter-btn').forEach(btn => btn.addEventListener('click', () => triggerDefault(btn.dataset.cat)));
  document.querySelectorAll('.mobile-nav-btn[data-filter]').forEach(btn => btn.addEventListener('click', () => triggerDefault(btn.getAttribute('data-filter'))));
  document.querySelectorAll('.sheet-filter').forEach(btn => btn.addEventListener('click', () => triggerDefault(btn.dataset.cat)));

  const CLOSED='dist/images/aqua-icons/Aqua  Folder.ico', OPEN='dist/images/aqua-icons/Aqua Favorites.ico';
  const folders = Array.from(document.querySelectorAll('.folder-year'));
  const setOpen = (folder) => {
    const cat = folder.getAttribute('data-category');
    folders.forEach(f => {
      if (f.getAttribute('data-category') === cat) {
        f.classList.remove('open');
        const icon = f.querySelector('.folder-icon');
        if (icon) icon.src = CLOSED;
      }
    });
    folder.classList.add('open');
    const icon = folder.querySelector('.folder-icon');
    if (icon) icon.src = OPEN;
  };
  folders.forEach(f => f.addEventListener('click', e => { e.stopPropagation(); setOpen(f); }));
};

const initCopiasFolders = () => {
  const folders = Array.from(document.querySelectorAll('.folder-year'));
  if (!folders.length) {
    hideAllArtworks();
    return;
  }
  const showFor = (folderId, category) => {
    let visible = 0;
    artItems.forEach(item => {
      const matchesCategory = !category || item.getAttribute('data-category') === category;
      const matchesFolder = folderId && item.getAttribute('data-folder') === folderId;
      const shouldShow = matchesCategory && matchesFolder;
      item.classList.toggle('is-visible', shouldShow);
      item.style.display = shouldShow ? '' : 'none';
      if (shouldShow) visible++;
    });
    if (artGrid) artGrid.classList.toggle('has-visible', visible > 0);
  };
  hideAllArtworks();
  folders.forEach(folder => {
    folder.addEventListener('click', e => {
      e.stopPropagation();
      hideAllArtworks();
      showFor(folder.id, folder.getAttribute('data-category'));
    });
  });
};

const initPinturasPrev = () => {};
  initFolderVisibility();
  initFolderDefaults();
  initCopiasFolders();
  initPinturasPrev();

// Al hacer clic, alternar la clase "open" en el contenedor .dropdown
pubBtn.addEventListener('click', e => {
  e.stopPropagation();             // evita cerrar al hacer clic en el botÃ³n
  pubBtn.parentElement.classList.toggle('open');
});

// Si haces clic fuera, cierra el menÃº
document.addEventListener('click', () => {
  pubBtn.parentElement.classList.remove('open');
  });

// 1) Cachea nodos
const galleryItems = Array.from(document.querySelectorAll('.image-gallery .draggable'));
const artGrid = document.querySelector('.art-grid');
const artItems = Array.from(document.querySelectorAll('[data-art-item]'));
const getDisplayTarget = (node) => {
  if (!node) return null;
  if (node.classList?.contains('folder-year')) return node;
  return node.closest ? node.closest('[data-art-item]') || node : node;
};
const hideAllArtworks = () => {
  if (!artItems.length) return;
  artItems.forEach(item => {
    item.classList.remove('is-visible');
    item.style.display = 'none';
  });
  if (artGrid) artGrid.classList.remove('has-visible');
};
const desktopMedia = window.matchMedia('(min-width:1024px)');
const isDesktop = () => desktopMedia.matches;


function getFolderSortValue(folder) {
  const caption = folder.querySelector('.folder-caption');
  if (!caption) return Number.NEGATIVE_INFINITY;
  const text = caption.textContent.trim();
  const numeric = parseInt(text, 10);
  if (!Number.isNaN(numeric)) return numeric;
  return text.toLowerCase().includes('anteriores') ? -1 : Number.NEGATIVE_INFINITY;
}

function arrangeDesktopFolders(cat) {
  const strip = document.querySelector('.folder-strip');
  if (!strip) return;
  strip.querySelectorAll('.folder-year').forEach(folder => {
    folder.style.removeProperty('left');
    folder.style.removeProperty('top');
  });
}

function ensureDesktopFoldersLayout() {
  const active = document.querySelector('.filter-btn.active');
  const cat = active ? active.dataset.cat : 'all';
  arrangeDesktopFolders(cat);
}

if (desktopMedia.addEventListener) {
  desktopMedia.addEventListener('change', e => {
    if (e.matches) ensureDesktopFoldersLayout();
  });
} else {
  desktopMedia.addListener(e => {
    if (e.matches) ensureDesktopFoldersLayout();
  });
}

// 2) Define la funciÃ³n de filtrado
function filterBy(cat) {
  const normalized = cat && cat !== 'all' ? cat : null;
  galleryItems.forEach(img => {
    const target = getDisplayTarget(img);
    if (!target) return;
    const isFolder = img.classList.contains('folder-year');
    if (!normalized) {
      target.style.display = 'none';
      if (!isFolder) target.classList.remove('is-visible');
      return;
    }
    const match = img.dataset.category === normalized;
    target.style.display = match ? '' : 'none';
    if (!isFolder && !match) {
      target.classList.remove('is-visible');
    }
  });
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === cat);
  });
  hideAllArtworks();
  arrangeDesktopFolders(cat);
}

// 0) Cachear el homeBtn mÃ³vil
const homeBtnMobile = document.getElementById('homeBtn');

// 1) Al clicar en mÃ³vil sobre "Antonio Monereo"
homeBtnMobile.addEventListener('click', e => {
  e.preventDefault();
  // a) Resetear filtros igual que si clicases "all"
  filterBy('all');
  // b) Cerrar menÃº lateral si estuviera abierto
  document.body.classList.remove('menu-open');
  // c) Si usas bottomSheet para filtros, ciÃ©rralo tambiÃ©n
  if (typeof bottomSheet !== 'undefined') {
    if (bottomSheet) bottomSheet.classList.remove('open');
  }
});

// 3) Asocia los listeners
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.cat;    // 'all' | 'copias' | 'pinturas' | 'dibujos'
    filterBy(cat);
    if (bottomSheet) bottomSheet.classList.remove('open');  // cierra el panel en mÃ³vil si estÃ¡ abierto
  });
});
// 4) Aplica estado inicial
filterBy('all');
  
  // â€” ACCIONES DE NAVEGACIÃ“N â€”  
  document.querySelectorAll('.sheet-nav').forEach(btn => {
    btn.addEventListener('click', () => {
      switch (btn.dataset.action) {
        case 'about':   document.getElementById('aboutBtn').click();     break;
        case 'contact': document.getElementById('contactBtn').click();    break;
        case 'dark':    document.getElementById('darkModeToggle').click();break;
        case 'reset':   document.getElementById('resetBtn').click();      break;
      }
      if (bottomSheet) bottomSheet.classList.remove('open');
    });
  });

  // â€” RESET, DARK, ABOUT, CONTACT â€”  
  const resetBtn   = document.getElementById('resetBtn');
  const darkBtn    = document.getElementById('darkModeToggle');
  const aboutBtn  = document.getElementById('aboutBtn');
  const aboutSec   = document.getElementById('aboutSection');
  const closeAbout = document.getElementById('closeAbout');
  const pop        = document.getElementById('popup');
  const closePopBtn= document.getElementById('closePopup');
// â€” HEADER MÃ“VIL: hamburguesa, home y lupa â€”

// 1) MenÃº hamburguesa (tÃº lo usarÃ¡s para mostrar tu nav lateral)
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileNav     = document.getElementById('mobileNav');
hamburgerBtn.addEventListener('click', () => {
  const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
  hamburgerBtn.setAttribute('aria-expanded', String(!isExpanded));
  mobileNav.hidden = isExpanded;
  document.body.classList.toggle('menu-open', !isExpanded);
  // Opcional: mueve el foco al primer Ã­tem del menÃº
  if (!isExpanded) {
    mobileNav.querySelector('[role="menuitem"]')?.focus();
  }
  hamburgerBtn.setAttribute(
  'aria-label',
  !isExpanded ? 'Cerrar menÃº' : 'Abrir menÃº'
);
hamburgerBtn.focus();
});
// â€”â€”â€” Cerrar menÃº al hacer click en un Ã­tem â€”â€”â€”
const menuItems = mobileNav.querySelectorAll('[role="menuitem"]');
menuItems.forEach(item => {
  item.addEventListener('click', () => {
    // 1) Cerrar el nav
    mobileNav.hidden = true;
    // 2) Actualizar ARIA en el botÃ³n
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.setAttribute('aria-label', 'Abrir menÃº');
    // 3) Quitar clase de estilos abiertos (si la usas)
    document.body.classList.remove('menu-open');
    // 4) (Opcional) devolver foco al contenido principal  
    document.getElementById('gallery')?.focus();
  });
});

// 1) Filtros: reutiliza tu funciÃ³n `filterGallery`
document.querySelectorAll('.mobile-nav-btn[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    const filt = btn.getAttribute('data-filter');
    filterBy(filt);            // â† usa la funciÃ³n existente
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
// â€” Toggle del submenÃº â€œPublicacionesâ€ â€”
const pubNavBtn = document.getElementById('pubNav');
const pubNavLi  = pubNavBtn.parentElement;  // <li class="has-submenu">
pubNavBtn.addEventListener('click', e => {
  e.stopPropagation();
  const isOpen = pubNavBtn.getAttribute('aria-expanded') === 'true';
  pubNavBtn.setAttribute('aria-expanded', String(!isOpen));
  pubNavLi.classList.toggle('open');

});

// Cerrar submenÃº si clicas fuera del mismo
document.addEventListener('click', () => {
  if (pubNavLi.classList.contains('open')) {
    pubNavBtn.setAttribute('aria-expanded', 'false');
    pubNavLi.classList.remove('open');
  }
});


// 2) BotÃ³n Home (scroll al inicio)
const homeBtn = document.getElementById('homeBtn');
homeBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

 // â€”â€”â€” BÃšSQUEDA SOBRE LA GALERÃA â€”â€”â€”
 const searchBtns      = [
  document.getElementById('searchBtnMobile'),
  document.getElementById('searchBtnDesktop')
].filter(Boolean);

const searchContainer = document.getElementById('searchContainer');
const searchForm      = document.getElementById('searchForm');
const searchInput     = document.getElementById('searchInput');
const thumbnails      = artItems;

// 1) Engancha el mismo handler a cada botÃ³n de bÃºsqueda
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
  if (!q) {
    hideAllArtworks();
    return;
  }
  hideAllArtworks();
  let matches = 0;
  thumbnails.forEach(item => {
    const img = item.querySelector('.draggable');
    if (!img) return;
    const hayTexto = (
      img.id + ' ' +
      img.alt + ' ' +
      (img.dataset.description || '')
    ).toLowerCase();
    const show = hayTexto.includes(q);
    item.classList.toggle('is-visible', show);
    item.style.display = show ? '' : 'none';
    if (show) matches++;
  });
  if (artGrid) artGrid.classList.toggle('has-visible', matches > 0);
});
// â€”â€”â€” FIN BÃšSQUEDA â€”â€”â€”



  // Reset sin recargar
  resetBtn.onclick = () => {
    hideAllArtworks();
    document.querySelectorAll('.folder-year').forEach(folder => {
      folder.classList.remove('open');
      folder.style.display = 'none';
    });
    filterBy('all');
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

 // â€”â€” Modal Contact â€”â€”
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
// Cerrar modal (botÃ³n X)
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

  // Cerrar modales con Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!aboutSec.classList.contains('hidden')) aboutSec.classList.add('hidden');
      if (pop.classList.contains('active')) closePop();
    }
  });

  // â€” CONFIGURAR IMÃGENES DRAG & POPUP â€”  
  const imgs = Array.from(document.querySelectorAll('.draggable'));
  imgs.forEach(img => {
    setupLoad(img);
    const isFolder = img.classList.contains('folder-year');
    if (!isFolder) {
      img.tabIndex = 0;
      img.ondblclick = () => showPop(img);
      if ('ontouchstart' in window) {
        img.addEventListener('click', e => {
          e.stopPropagation();
          showPop(img);
        });
      }
      img.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          showPop(img);
        }
      });
    }
  });

  closePopBtn.onclick = closePop;
  pop.onclick = e => { if (e.target === pop) closePop(); };

  // DinÃ¡mico
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

// 3) Listener de â€œdouble-tapâ€ en mÃ³vil (touchend)
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

