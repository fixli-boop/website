/* ============================================================
   ERGOTHERAPIE – SCRIPT.JS
   Handles: sticky header, mobile nav, scroll animations,
            active nav links, contact form validation
   ============================================================ */

'use strict';

/* ── Utility ─────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ═══════════════════════════════════════════════════════════
   1. STICKY HEADER
═══════════════════════════════════════════════════════════ */
(function stickyHeader() {
  const header = $('#site-header');
  if (!header) return;

  function updateHeader() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
      header.classList.remove('at-top');
    } else {
      header.classList.remove('scrolled');
      header.classList.add('at-top');
    }
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
})();

/* ═══════════════════════════════════════════════════════════
   2. MOBILE NAV TOGGLE
═══════════════════════════════════════════════════════════ */
(function mobileNav() {
  const toggle = $('#nav-toggle');
  const nav    = $('#main-nav');
  const body   = document.body;
  if (!toggle || !nav) return;

  function openNav() {
    toggle.classList.add('open');
    nav.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Menü schließen');
    body.style.overflow = 'hidden';
  }

  function closeNav() {
    toggle.classList.remove('open');
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Menü öffnen');
    body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    toggle.classList.contains('open') ? closeNav() : openNav();
  });

  // Close on nav link click
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) closeNav();
  });

  // Close when clicking outside nav on mobile
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') &&
        !nav.contains(e.target) &&
        !toggle.contains(e.target)) {
      closeNav();
    }
  });
})();

/* ═══════════════════════════════════════════════════════════
   3. SCROLL REVEAL ANIMATIONS
═══════════════════════════════════════════════════════════ */
(function scrollReveal() {
  const elements = $$('.reveal-up, .reveal-left, .reveal-right');
  if (!elements.length) return;

  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));

  // Trigger hero elements immediately
  $$('.hero .reveal-up').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 120);
  });
})();

/* ═══════════════════════════════════════════════════════════
   4. ACTIVE NAV LINK (scroll spy)
═══════════════════════════════════════════════════════════ */
(function scrollSpy() {
  const sections  = $$('section[id]');
  const navLinks  = $$('.nav-link[data-section]');
  const headerH   = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80;
  if (!sections.length || !navLinks.length) return;

  function setActive(id) {
    navLinks.forEach(link => {
      if (link.dataset.section === id) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  function onScroll() {
    const scrollPos = window.scrollY + headerH + 60;

    let current = sections[0].id;
    sections.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        current = section.id;
      }
    });
    setActive(current);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ═══════════════════════════════════════════════════════════
   5. SMOOTH SCROLL OFFSET (for fixed header)
═══════════════════════════════════════════════════════════ */
(function smoothScrollOffset() {
  const headerH = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--header-h')
  ) || 80;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ═══════════════════════════════════════════════════════════
   7. ACCESSIBILITY TOGGLES
═══════════════════════════════════════════════════════════ */
(function a11yToggles() {
  const btnContrast = $('#btn-contrast');
  const btnLanguage = $('#btn-language');
  const body = document.body;

  if (btnContrast) {
    // Check local storage for preference
    if (localStorage.getItem('a11y-high-contrast') === 'true') {
      body.classList.add('high-contrast');
    }

    btnContrast.addEventListener('click', () => {
      body.classList.toggle('high-contrast');
      const isActive = body.classList.contains('high-contrast');
      localStorage.setItem('a11y-high-contrast', isActive);
      
      if(isActive) {
        btnContrast.style.backgroundColor = '#fff';
        btnContrast.style.color = 'var(--hc-bg)';
      } else {
        btnContrast.style.backgroundColor = '';
        btnContrast.style.color = '';
      }
    });
  }

  if (btnLanguage) {
    if (localStorage.getItem('a11y-leichte-sprache') === 'true') {
      body.classList.add('leichte-sprache');
    }

    btnLanguage.addEventListener('click', () => {
      body.classList.toggle('leichte-sprache');
      const isActive = body.classList.contains('leichte-sprache');
      localStorage.setItem('a11y-leichte-sprache', isActive);

      if(isActive) {
        btnLanguage.style.backgroundColor = '#fff';
        btnLanguage.style.color = 'var(--clr-primary)';
      } else {
        btnLanguage.style.backgroundColor = '';
        btnLanguage.style.color = '';
      }
    });
  }
})();

/* ═══════════════════════════════════════════════════════════
   6. CONTACT FORM VALIDATION & SUBMISSION
═══════════════════════════════════════════════════════════ */
(function contactForm() {
  const form       = $('#kontakt-form');
  const submitBtn  = $('#form-submit');
  const successMsg = $('#form-success');
  if (!form) return;

  function validateField(field) {
    const val = field.value.trim();
    let valid = true;

    if (field.type === 'checkbox') {
      valid = field.checked;
    } else if (field.required && !val) {
      valid = false;
    } else if (field.type === 'email' && val) {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }

    field.classList.toggle('error', !valid);
    return valid;
  }

  // Real-time validation on blur
  $$('input, textarea', form).forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const fields  = $$('input[required], textarea[required]', form);
    const allGood = fields.map(validateField).every(Boolean);

    if (!allGood) {
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    // Simulate form submission (replace with actual backend/e-mail service)
    submitBtn.textContent = 'Wird gesendet ...';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      successMsg.hidden = false;
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1200);
  });
})();

/* ═══════════════════════════════════════════════════════════
   7. HERO PARALLAX (subtle)
═══════════════════════════════════════════════════════════ */
(function heroParallax() {
  const heroImg = $('.hero-img');
  if (!heroImg) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const limit   = window.innerHeight;
        if (scrollY < limit) {
          const offset = scrollY * 0.3;
          heroImg.style.transform = `translateY(${offset}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ═══════════════════════════════════════════════════════════
   8. VACATION POPUP
═══════════════════════════════════════════════════════════ */
(function vacationPopup() {
  const popup = $('#vacation-popup');
  const closeBtn = $('#close-popup');
  
  if (!popup || !closeBtn) return;

  // Check if it was closed in this session
  if (!sessionStorage.getItem('vacationPopupClosed')) {
    // Show after a short delay
    setTimeout(() => {
      popup.classList.add('show');
    }, 1000);
  }

  closeBtn.addEventListener('click', () => {
    popup.classList.remove('show');
    sessionStorage.setItem('vacationPopupClosed', 'true');
  });
})();
