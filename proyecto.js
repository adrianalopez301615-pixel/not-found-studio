
'use strict';

/* ── 1. TRANSICIÓN DE ENTRADA ─────────────────────────────── */
const pageTransition = document.getElementById('pageTransition');

if (pageTransition) {
  pageTransition.style.opacity = '1';
  pageTransition.style.pointerEvents = 'all';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      pageTransition.style.transition = 'opacity 0.5s ease';
      pageTransition.style.opacity = '0';
      setTimeout(() => { pageTransition.style.pointerEvents = 'none'; }, 500); 
    });
  });
}

/* Transición al volver a index.html */
document.querySelectorAll('a[href="index.html"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    if (pageTransition) {
      pageTransition.style.transition = 'opacity 0.4s ease';
      pageTransition.style.opacity = '1';
      pageTransition.style.pointerEvents = 'all';
      setTimeout(() => { window.location.href = 'index.html'; }, 400);
    } else {
      window.location.href = 'index.html';
    }
  });
});

/* ── 2. NAVBAR SCROLL ─────────────────────────────────────── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
}

/* ── 3. MENÚ HAMBURGUESA ──────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
  });
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });
  document.addEventListener('click', (e) => {
    if (navbar && !navbar.contains(e.target)) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
    }
  });
}

/* ── 4. SCROLL SUAVE ─────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const navH = navbar ? navbar.offsetHeight : 70;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── 5. SCROLL REVEAL ─────────────────────────────────────
   IMPORTANTE: el HTML usa la clase .p-reveal (con prefijo p-)
   ────────────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = Number(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.10, rootMargin: '0px 0px -30px 0px' }
);

/* Selecciona .p-reveal (clase propia del proyecto) */
const revealEls = document.querySelectorAll('.p-reveal');

revealEls.forEach((el) => {
  const siblings = [...el.parentElement.querySelectorAll(':scope > .p-reveal')];
  const idx = siblings.indexOf(el);
  if (idx > 0) el.dataset.delay = idx * 100;
  revealObserver.observe(el);
});

/* Fallback: si el elemento ya está en el viewport al cargar
   (ocurre al abrir el archivo directo sin servidor),
   lo hacemos visible inmediatamente */
function checkAlreadyVisible() {
  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const delay = Number(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('visible'), delay);
    }
  });
}
/* Ejecutar al cargar y también después de un pequeño delay */
checkAlreadyVisible();
setTimeout(checkAlreadyVisible, 300);

/* ── 6. SLIDER ───────────────────────────────────────────── */
const track  = document.getElementById('sliderTrack');
const prevBtn = document.getElementById('sliderPrev');
const nextBtn = document.getElementById('sliderNext');
const dotsEl  = document.getElementById('sliderDots');

if (track && dotsEl) {
  const slides = track.querySelectorAll('.slide');
  let current  = 0;
  let autoTimer;

  /* Crear dots */
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
    dotsEl.appendChild(dot);
  });

  function goTo(idx) {
    current = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsEl.querySelectorAll('.dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 4500);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  /* Swipe táctil */
  let touchStartX = 0;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(current + (diff > 0 ? 1 : -1)); resetAuto(); }
  });

  /* Pausar en hover */
  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.parentElement.addEventListener('mouseleave', startAuto);

  startAuto();
}

/* ── 7. FORMULARIO DE CONTACTO ───────────────────────────── */
const formProy    = document.getElementById('contactFormProy');
const successProy = document.getElementById('formSuccessProy');

function showErr(id, msg) {
  const el  = document.getElementById(id);
  const err = document.getElementById('error-' + id);
  if (el)  el.classList.add('invalid');
  if (err) err.textContent = msg;
}
function clearErr(id) {
  const el  = document.getElementById(id);
  const err = document.getElementById('error-' + id);
  if (el)  el.classList.remove('invalid');
  if (err) err.textContent = '';
}

['p-nombre','p-apellido','p-correo','p-mensaje'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => { if (el.value.trim()) clearErr(id); });
});

if (formProy) {
  formProy.addEventListener('submit', async (e) => {
    e.preventDefault();
    let ok = true;
    ['p-nombre','p-apellido','p-correo','p-mensaje'].forEach(id => clearErr(id));

    const nombre   = document.getElementById('p-nombre').value.trim();
    const apellido = document.getElementById('p-apellido').value.trim();
    const correo   = document.getElementById('p-correo').value.trim();
    const mensaje  = document.getElementById('p-mensaje').value.trim();

    if (!nombre)   { showErr('p-nombre',   'El nombre es obligatorio.');    ok = false; }
    if (!apellido) { showErr('p-apellido', 'El apellido es obligatorio.');  ok = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
                     showErr('p-correo',   'Ingresa un correo válido.');    ok = false; }
    if (mensaje.length < 10) {
                     showErr('p-mensaje',  'Mínimo 10 caracteres.');        ok = false; }

    if (!ok) return;

    const btn = formProy.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    try {
      /* Envío real a Formspree */
      const response = await fetch(formProy.action, {
        method:  'POST',
        body:    new FormData(formProy),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formProy.reset();
        if (successProy) { successProy.classList.add('show'); }
        setTimeout(() => { if (successProy) successProy.classList.remove('show'); }, 5000);
      } else {
        alert('Hubo un error al enviar. Intenta de nuevo.');
      }
    } catch (err) {
      alert('Error de conexión. Verifica tu internet.');
    } finally {
      btn.disabled = false;
      btn.innerHTML = 'Enviar mensaje <i class="fas fa-paper-plane"></i>';
    }
  });
}

/* ── 8. LINK ACTIVO EN NAVBAR según sección visible ─────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

if (sections.length && navLinks.length) {
  const sectionObs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            if (link.classList.contains('nav-link--back')) return;
            const href = link.getAttribute('href').replace('#', '');
            link.style.color = href === entry.target.id ? 'var(--p-accent)' : '';
          });
        }
      });
    },
    { rootMargin: '-30% 0px -60% 0px' }
  );
  sections.forEach(s => sectionObs.observe(s));
}
