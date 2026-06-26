/* ============================================================
   NOT FOUND STUDIO — script.js
   Funciones: navbar scroll, menú hamburguesa,
              scroll reveal, validación de formulario
   ============================================================ */

'use strict';

/* ── 1. NAVBAR: sombra al hacer scroll ────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ── 2. MENÚ HAMBURGUESA ──────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('open');
});

// Cerrar menú al hacer clic en un enlace (móvil)
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
  });
});

// Cerrar menú al hacer clic fuera
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
  }
});

/* ── 3. SCROLL SUAVE para todos los enlaces internos ─────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const navHeight = navbar.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── 4. SCROLL REVEAL con IntersectionObserver ───────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Escalonado: cada elemento dentro del viewport se revela con delay
        const delay = (entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

// Asignar delay escalonado dentro de cada sección (grid/flex)
document.querySelectorAll('.reveal').forEach((el, i) => {
  // Detectar si hay hermanos reveal en el mismo padre
  const siblings = [...el.parentElement.querySelectorAll(':scope > .reveal')];
  const idx = siblings.indexOf(el);
  if (idx > 0) {
    el.dataset.delay = idx * 100;
  }
  revealObserver.observe(el);
});

/* ── 5. VALIDACIÓN DEL FORMULARIO DE CONTACTO ────────────── */
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

// Utilidad: mostrar error
function showError(fieldId, msg) {
  const el = document.getElementById(fieldId);
  const err = document.getElementById('error-' + fieldId);
  if (el) el.classList.add('invalid');
  if (err) err.textContent = msg;
}

// Utilidad: limpiar error
function clearError(fieldId) {
  const el = document.getElementById(fieldId);
  const err = document.getElementById('error-' + fieldId);
  if (el) el.classList.remove('invalid');
  if (err) err.textContent = '';
}

// Validación en tiempo real (al escribir)
['nombre', 'apellido', 'correo', 'mensaje'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', () => {
    if (el.value.trim() !== '') {
      clearError(id);
    }
  });
});

// Validación al enviar
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;
    ['nombre','apellido','correo','mensaje'].forEach(id => clearError(id));

    const nombre   = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const correo   = document.getElementById('correo').value.trim();
    const mensaje  = document.getElementById('mensaje').value.trim();

    if (!nombre || nombre.length < 2) {
      showError('nombre', 'El nombre debe tener al menos 2 caracteres.'); isValid = false;
    }
    if (!apellido) {
      showError('apellido', 'El apellido es obligatorio.'); isValid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      showError('correo', 'Ingresa un correo electrónico válido.'); isValid = false;
    }
    if (mensaje.length < 10) {
      showError('mensaje', 'El mensaje debe tener al menos 10 caracteres.'); isValid = false;
    }

    if (!isValid) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    try {
      /* Envío real a Formspree */
      const response = await fetch(form.action, {
        method:  'POST',
        body:    new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        formSuccess.classList.add('show');
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      } else {
        alert('Hubo un error al enviar. Intenta de nuevo.');
      }
    } catch (err) {
      alert('Error de conexión. Verifica tu internet.');
    } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Enviar mensaje <i class="fas fa-paper-plane"></i>';
    }
  });
}

/* ── 7. TRANSICIÓN SUAVE ENTRE PÁGINAS ───────────────────── */
const pageTransition = document.getElementById('pageTransition');

// Al cargar la página: fade-in desde negro
if (pageTransition) {
  pageTransition.classList.add('fade-out');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      pageTransition.classList.remove('fade-out');
    });
  });
}

// Interceptar clics en enlaces externos (proyecto.html)
document.querySelectorAll('a[href="proyecto.html"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const dest = link.getAttribute('href');
    if (pageTransition) {
      pageTransition.classList.add('fade-out');
      setTimeout(() => { window.location.href = dest; }, 400);
    } else {
      window.location.href = dest;
    }
  });
});
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          const href = link.getAttribute('href').replace('#', '');
          if (href === entry.target.id) {
            link.style.color = '#38bdf8';
          }
        });
      }
    });
  },
  { rootMargin: '-30% 0px -60% 0px' }
);

sections.forEach(section => sectionObserver.observe(section));
