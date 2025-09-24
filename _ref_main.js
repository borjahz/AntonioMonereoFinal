// ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ Google Analytics condicional ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½
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
  // Abrir modales
  document.querySelectorAll('[data-modal]').forEach(trigger => {
    const modalId = trigger.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    const closeBtn = modal.querySelector('[data-close]');
    trigger.addEventListener('click', event => {
      event.preventDefault();
      // Mostrar
      modal.classList.remove('hidden');
      modal.classList.add('active');
      // Aria
      trigger.setAttribute('aria-expanded', 'true');
      // Focus en el bot+ï¿½n de cerrar
      closeBtn.focus();
    });
  });

  // Cerrar modales
  document.querySelectorAll('[data-close]').forEach(closeBtn => {
    const modal = closeBtn.closest('.modal');
    const triggerId = modal.id && document.querySelector(`[data-modal="${modal.id}"]`);
    closeBtn.addEventListener('click', () => {
      // Ocultar
      modal.classList.remove('active');
      modal.classList.add('hidden');
      // Aria
      if (triggerId) triggerId.setAttribute('aria-expanded', 'false');
      // Devolver foco al disparador
      triggerId && triggerId.focus();
    });
  });

  // Cerrar con Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.active').forEach(modal => {
        modal.classList.remove('active');
        modal.classList.add('hidden');
        const trigger = document.querySelector(`[data-modal="${modal.id}"]`);
        if (trigger) {
          trigger.setAttribute('aria-expanded', 'false');
          trigger.focus();
        }
      });
    }
  });
}

function prepareGalleryLayout() {
  const gallery = document.querySelector('.image-gallery');
  if (!gallery || gallery.classList.contains('layout-ready')) return;

  const folderGrid = document.createElement('div');
  folderGrid.className = 'folder-grid';

  const artworkGrid = document.createElement('div');
  artworkGrid.className = 'artwork-grid';

  Array.from(gallery.children).forEach(node => {
    if (!(node instanceof HTMLElement)) return;
    if (node.classList.contains('draggable') && node.classList.contains('folder-year')) {
      folderGrid.appendChild(node);
    } else {
      artworkGrid.appendChild(node);
    }
  });

  gallery.appendChild(folderGrid);
  gallery.appendChild(artworkGrid);
  gallery.classList.add('layout-ready');
}

function updateArtworkLayoutState() {
  const visibleArtwork = Array.from(
    document.querySelectorAll('.image-gallery .draggable:not(.folder-year)')
  ).some(img => getComputedStyle(img).display !== 'none');

  document.body.classList.toggle('artwork-visible', visibleArtwork);
}
  // ï¿½Çªel resto de tu init para splash/galer+ï¿½a, etc.
window.addEventListener('load', () => {
  const splash      = document.getElementById('splash');
  const video       = document.getElementById('splashVideo');
  const mainContent = document.getElementById('mainContent');
  if (!splash || !video || !mainContent) return;
  // >>> Forzamos atributos imprescindibles para autoplay en m+ï¿½vil:
  video.autoplay = true;
  video.muted = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.setAttribute('preload', 'auto');

  // --- Opcional: arrancar s+ï¿½lo cuando haya suficiente buffer ---
  video.addEventListener('canplaythrough', () => {
  video.play().catch(() => {
    /* Autoplay might be blocked; ignore the error */
  });
});

  // Cuando el v+ï¿½deo termina, lanzamos la transici+ï¿½n cruzada
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

// ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ Global keys & state ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½
const dataKey = 'fs_positions';
const darkKey = 'fs_dark';
function save() {}
function load() {
  document.querySelectorAll('.draggable').forEach(img => {
    img.style.left = '';
    img.style.top = '';
    if (img.style.position) {
      img.style.position = '';
    }
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
  const pop = document.getElementById('popup');
  const imgTag = document.getElementById('popupImage');
  const titleTag= document.getElementById('popupTitle');
  const descTag= document.getElementById('popupDescription');
  const detalleLista = document.getElementById('detalleLista');
  // Comprueba si existe data-popup-src; si no, usa la miniatura (i.src)
  const nuevaSrc = i.dataset.popupSrc || i.src;
  imgTag.src     = nuevaSrc;

  titleTag.textContent = i.alt;
    // Permitir saltos de l+ï¿½nea o HTML sencillo en la descripci+ï¿½n
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
      `T+ï¿½cnica: ${tecnica}`,
      `Medidas: ${medidas}`,
      `A+ï¿½o de ejecuci+ï¿½n: ${ano}`,
      `Proceso creativo: ${proceso}`,
      `Inspiraci+ï¿½n: ${inspiracion}`
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


// ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ Main initialization ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½

  document.addEventListener('DOMContentLoaded', () => {
  initCookieModal();
   setupLegalModals();

      // ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ Textos traducibles ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½
  const texts = {
    // Nav / modales
    about:           { es: 'Info',             en: 'About' },
    contact:         { es: 'Contacto',          en: 'Contact' },
    aboutTitle:      { es: 'Sobre Antonio Monereo',en: 'About Antonio Monereo' },
    contactTitle:    { es: 'Env+ï¿½anos un email',  en: 'Send us an email' },
    close:           { es: 'Cerrar',            en: 'Close' },
    aboutInfo:     { es: 'Antonio Monereo (Madrid, 2001) es un joven pintor y dibujante formado en Bellas Artes en la Universidad Complutense y en Historia del Arte en la UNED. Se adentr+ï¿½ muy pronto en el mundo del arte: comenz+ï¿½ a dibujar desde ni+ï¿½o, gan+ï¿½ un primer premio en el certamen "Toledo desde el Alc+ï¿½zar" (2016) y desde 2019 ejerce como uno de los copistas m+ï¿½s j+ï¿½venes del Museo del Prado. Su acercamiento al arte es profundamente cl+ï¿½sico, con una destacada t+ï¿½cnica acad+ï¿½mica, pero tambi+ï¿½n muy personal: en entrevistas ha confesado que la pintura ha sido su refugio y medio para afirmarse y encontrar su lugar.',
       en: 'Antonio Monereo (Madrid, 2001) is a young painter and draftsman who studied Fine Arts at the Complutense University and Art History at the UNED. He discovered his passion for art early on, began drawing as a child, won first prize in the "Toledo from the Alc+ï¿½zar" contest in 2016, and has been one of the youngest official copyists at the Prado Museum since 2019. His approach to art is deeply classical, with a strong academic technique, yet also deeply personal: in interviews, he has shared that painting has been both a refuge and a way to affirm his identity and find his place in the world.' },
    pubBtn:         { es: 'Publicaciones',    en: 'Publications' },
    Shangay:      { es: 'Entrevista Shangay',         en: 'Shangay Interview' },
    Telemadrid: { es: 'Entrevista Telemadrid',        en: 'Telemadrid Interview' },
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
    // ï¿½ï¿½ï¿½ Toggle del men+ï¿½ de Publicaciones ï¿½ï¿½ï¿½
const pubBtn  = document.getElementById('pubBtn');
const pubMenu = document.getElementById('pubMenu');
const bottomSheet = document.getElementById('bottomSheet');

// Al hacer clic, alternar la clase "open" en el contenedor .dropdown
pubBtn.addEventListener('click', e => {
  e.stopPropagation();             // evita cerrar al hacer clic en el bot+ï¿½n
  pubBtn.parentElement.classList.toggle('open');
});

// Si haces clic fuera, cierra el men+ï¿½
document.addEventListener('click', () => {
  pubBtn.parentElement.classList.remove('open');
  });

// 1) Cachea nodos
const galleryItems = Array.from(document.querySelectorAll('.image-gallery .draggable'));
function filterBy(cat) {
  galleryItems.forEach(img => {
    const shouldDisplay = cat !== 'all' && img.dataset.category === cat;
    img.style.display = shouldDisplay ? '' : 'none';
  });
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === cat);
  });
  if (cat === 'all') {
    if (typeof window.__setFolders === 'function') window.__setFolders(null);
  } else if (typeof window.__setFolders === 'function') {
    window.__setFolders(cat);
  }
  updateArtworkLayoutState();
}
// 0) Cachear el homeBtn m+ï¿½vil
const homeBtnMobile = document.getElementById('homeBtn');

// 1) Al clicar en m+ï¿½vil sobre "Antonio Monereo"
homeBtnMobile.addEventListener('click', e => {
  e.preventDefault();
  // a) Resetear filtros igual que si clicases "all"
  filterBy('all');
  // b) Cerrar men+ï¿½ lateral si estuviera abierto
  document.body.classList.remove('menu-open');
  // c) Si usas bottomSheet para filtros, ci+ï¿½rralo tambi+ï¿½n
  if (typeof bottomSheet !== 'undefined') {
    bottomSheet.classList.remove('open');
  }
});

// 3) Asocia los listeners
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.cat;    // 'all' | 'copias' | 'pinturas' | 'dibujos'
    filterBy(cat);
    bottomSheet.classList.remove('open');  // cierra el panel en m+ï¿½vil si est+ï¿½ abierto
  });
});
// 4) Aplica estado inicial
filterBy('all');
  
  // ï¿½ï¿½ï¿½ ACCIONES DE NAVEGACI+ï¿½N ï¿½ï¿½ï¿½  
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

  // ï¿½ï¿½ï¿½ RESET, DARK, ABOUT, CONTACT ï¿½ï¿½ï¿½  
  const resetBtn   = document.getElementById('resetBtn');
  const darkBtn    = document.getElementById('darkModeToggle');
  const aboutBtn  = document.getElementById('aboutBtn');
  const aboutSec   = document.getElementById('aboutSection');
  const closeAbout = document.getElementById('closeAbout');
  const pop        = document.getElementById('popup');
  const closePopBtn= document.getElementById('closePopup');
// ï¿½ï¿½ï¿½ HEADER M+ï¿½VIL: hamburguesa, home y lupa ï¿½ï¿½ï¿½

// 1) Men+ï¿½ hamburguesa (t+ï¿½ lo usar+ï¿½s para mostrar tu nav lateral)
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileNav     = document.getElementById('mobileNav');
hamburgerBtn.addEventListener('click', () => {
  const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
  hamburgerBtn.setAttribute('aria-expanded', String(!isExpanded));
  mobileNav.hidden = isExpanded;
  document.body.classList.toggle('menu-open', !isExpanded);
  // Opcional: mueve el foco al primer +ï¿½tem del men+ï¿½
  if (!isExpanded) {
    mobileNav.querySelector('[role="menuitem"]')?.focus();
  }
  hamburgerBtn.setAttribute(
  'aria-label',
  !isExpanded ? 'Cerrar men+ï¿½' : 'Abrir men+ï¿½'
);
hamburgerBtn.focus();
});
// ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ Cerrar men+ï¿½ al hacer click en un +ï¿½tem ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½
const menuItems = mobileNav.querySelectorAll('[role="menuitem"]');
menuItems.forEach(item => {
  item.addEventListener('click', () => {
    // 1) Cerrar el nav
    mobileNav.hidden = true;
    // 2) Actualizar ARIA en el bot+ï¿½n
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.setAttribute('aria-label', 'Abrir men+ï¿½');
    // 3) Quitar clase de estilos abiertos (si la usas)
    document.body.classList.remove('menu-open');
    // 4) (Opcional) devolver foco al contenido principal  
    document.getElementById('gallery')?.focus();
  });
});

// 1) Filtros: reutiliza tu funci+ï¿½n `filterGallery`
document.querySelectorAll('.mobile-nav-btn[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    const filt = btn.getAttribute('data-filter');
    filterBy(filt);            // ï¿½ï¿½ï¿½ usa la funci+ï¿½n existente
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
// ï¿½ï¿½ï¿½ Toggle del submen+ï¿½ ï¿½Ç£Publicacionesï¿½ï¿½ï¿½ ï¿½ï¿½ï¿½
const pubNavBtn = document.getElementById('pubNav');
const pubNavLi  = pubNavBtn.parentElement;  // <li class="has-submenu">
pubNavBtn.addEventListener('click', e => {
  e.stopPropagation();
  const isOpen = pubNavBtn.getAttribute('aria-expanded') === 'true';
  pubNavBtn.setAttribute('aria-expanded', String(!isOpen));
  pubNavLi.classList.toggle('open');

});

// Cerrar submen+ï¿½ si clicas fuera del mismo
document.addEventListener('click', () => {
  if (pubNavLi.classList.contains('open')) {
    pubNavBtn.setAttribute('aria-expanded', 'false');
    pubNavLi.classList.remove('open');
  }
});


// 2) Bot+ï¿½n Home (scroll al inicio)
const homeBtn = document.getElementById('homeBtn');
homeBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

 // ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ B+ï¿½SQUEDA SOBRE LA GALER+ï¿½A ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½
 const searchBtns      = [
  document.getElementById('searchBtnMobile'),
  document.getElementById('searchBtnDesktop')
].filter(Boolean);

const searchContainer = document.getElementById('searchContainer');
const searchForm      = document.getElementById('searchForm');
const searchInput     = document.getElementById('searchInput');
const thumbnails      = Array.from(document.querySelectorAll('.draggable'));

// 1) Engancha el mismo handler a cada bot+ï¿½n de b+ï¿½squeda
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
  updateArtworkLayoutState();
});
// ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ FIN B+ï¿½SQUEDA ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½



  // Reset sin recargar
  resetBtn.onclick = () => {
    localStorage.removeItem(dataKey);
    load();
    filterBy('all');
    if (typeof window.__setFolders === 'function') window.__setFolders(null);
    updateArtworkLayoutState();
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

 // ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ Modal Contact ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½
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
// Cerrar modal (bot+ï¿½n X)
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
  // ï¿½ï¿½ï¿½ CONFIGURAR IM+ï¿½GENES DRAG & POPUP ï¿½ï¿½ï¿½  
  const imgs = Array.from(document.querySelectorAll('.draggable'));
  load();
  imgs.forEach(img => {
    setupLoad(img);
    img.style.left = '';
    img.style.top = '';
    img.style.position = '';
    img.tabIndex = 0;
    const isFolder = img.classList.contains('folder-year');
    img.ondblclick = isFolder ? null : (() => showPop(img));
    if ('ontouchstart' in window && !isFolder) {
      img.addEventListener('click', e => {
        e.stopPropagation();
        showPop(img);
      });
    }
  });
  prepareGalleryLayout();
  updateArtworkLayoutState();
  closePopBtn.onclick = closePop;
  pop.onclick = e => { if (e.target === pop) closePop(); };

  // Din+ï¿½mico
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

// === UX Enhancements moved from index.html (guarded to avoid double bind) ===
(function(){
  if (window._uxEnhanced) return; window._uxEnhanced = true;
  // 1) No popup for folders
  const overrideShowPop = () => {
    const g = window.showPop; if (typeof g !== 'function') return;
    window.showPop = function(el){
      try { if (el && (el.classList?.contains('folder-year') || el.closest?.('.folder-year'))) return; } catch(_){ }
      return g.apply(this, arguments);
    };
  };

  // 2) Show folders only in their category + default open 2025
  const initFolderVisibility = () => {
    const apply = (cat) => {
      document.querySelectorAll('.folder-year').forEach(el => {
        el.style.display = (el.getAttribute('data-category') === cat) ? 'block' : 'none';
      });
    };
    const active = document.querySelector('.filter-btn.active');
    apply(active ? active.dataset.cat : 'all');
    const hook = (btn, getCat) => btn.addEventListener('click', () => apply(getCat(btn)));
    document.querySelectorAll('.filter-btn').forEach(b => hook(b, x=>x.dataset.cat));
    document.querySelectorAll('.mobile-nav-btn[data-filter]').forEach(b => hook(b, x=>x.getAttribute('data-filter')));
    document.querySelectorAll('.sheet-filter').forEach(b => hook(b, x=>x.dataset.cat));
  };

  // 3) Auto-open 2025 per category and folder icon toggle
  const initFolderDefaults = () => {
    const idMap = { copias:'Folder2025', pinturas:'PaintFolder2025', dibujos:'DrawFolder2025' };
    const clickDefault = (cat) => { const id=idMap[cat]; const el=id&&document.getElementById(id); el&&setTimeout(()=>el.dispatchEvent(new MouseEvent('click',{bubbles:true})),0); };
    const active = document.querySelector('.filter-btn.active'); if (active) clickDefault(active.dataset.cat);
    document.querySelectorAll('.filter-btn').forEach(b=>b.addEventListener('click',()=>clickDefault(b.dataset.cat)));
    document.querySelectorAll('.mobile-nav-btn[data-filter]').forEach(b=>b.addEventListener('click',()=>clickDefault(b.getAttribute('data-filter'))));
    document.querySelectorAll('.sheet-filter').forEach(b=>b.addEventListener('click',()=>clickDefault(b.dataset.cat)));

    const CLOSED='dist/images/aqua-icons/Aqua  Folder.ico', OPEN='dist/images/aqua-icons/Aqua Favorites.ico';
    const folders=[...document.querySelectorAll('.folder-year')];
    const setOpen=(f)=>{
      const cat=f.getAttribute('data-category');
      folders.forEach(n=>{ if(n.getAttribute('data-category')===cat){ n.classList.remove('open'); const i=n.querySelector('.folder-icon'); if(i) i.src=CLOSED; }});
      f.classList.add('open'); const i=f.querySelector('.folder-icon'); if(i) i.src=OPEN;
    };
    folders.forEach(f=>f.addEventListener('click',e=>{ e.stopPropagation(); setOpen(f);}));
  };

  // 4) Pinturas: ï¿½Ç£Anterioresï¿½ï¿½ï¿½ muestra todo; 2025 oculta
  const initPinturasPrev = () => {
    const prev=document.getElementById('PaintFolderPrev'); const y25=document.getElementById('PaintFolder2025');
    const items=[...document.querySelectorAll('.draggable[data-category="pinturas"]')].filter(el=>!el.classList.contains('folder-year'));
    if(!prev||!items.length) return;
    const hide = () => { items.forEach(e => e.style.display = 'none'); updateArtworkLayoutState(); }; const show = () => { items.forEach(e => { e.style.display = 'block'; }); updateArtworkLayoutState(); };
    hide(); prev.addEventListener('click',e=>{e.stopPropagation(); show();}); if(y25) y25.addEventListener('click',e=>{e.stopPropagation(); hide();});
  };

  document.addEventListener('DOMContentLoaded',()=>{
    overrideShowPop();
    initFolderVisibility();
    initFolderDefaults();
    initPinturasPrev();
  });
})();
// === End UX Enhancements ===

// === Misc small inits ===
document.addEventListener('DOMContentLoaded', ()=>{
  const y = document.getElementById('currentYear'); if(y) y.textContent = new Date().getFullYear();
  // Force full-res images
  document.querySelectorAll('.image-gallery .draggable').forEach(img=>{
    const real = img.getAttribute('data-popup-src'); if(!real) return;
    const pic = img.closest('picture'); if(pic){ const webp = pic.querySelector('source[type="image/webp"]'); if(webp){ if(real.endsWith('.webp')) webp.setAttribute('srcset', real); else webp.remove(); } }
    img.setAttribute('src', real); img.setAttribute('loading','eager'); img.setAttribute('fetchpriority','high');
  });
});
// === End misc ===
// 3) Listener de ï¿½Ç£double-tapï¿½ï¿½ï¿½ en m+ï¿½vil (touchend)
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


