(function () {
  'use strict';

  /* ------------------------------------------------------------------
     PATH DETECTION
     Figures out the relative base path so links work from both
     root pages (/projects.html) and subdirectory pages (/games/game.html).
  ------------------------------------------------------------------ */
  const segments = window.location.pathname.split('/').filter(Boolean);
  const dirs     = segments.filter(s => !s.includes('.'));
  const base     = dirs.length > 0 ? '../'.repeat(dirs.length) : '';
  const filename = segments.filter(s => s.includes('.')).pop() || 'index.html';

  const PAGE_MAP = {
    'projects.html': 'projects',
    'about.html': 'about',
    'articles.html': 'articles'
  };
  const activePage = PAGE_MAP[filename] || null;

  /* ------------------------------------------------------------------
     INLINE SVG ICONS  (no external icon library dependency)
  ------------------------------------------------------------------ */
  const SVG = {
    linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
    github:   `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
    arrowUp:  `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"></polyline></svg>`
  };

  /* ------------------------------------------------------------------
     HTML BUILDERS
  ------------------------------------------------------------------ */
  function buildNav() {
    const links = [
      { href: `${base}projects.html`, label: 'Projects', page: 'projects' },
      { href: `${base}about.html`, label: 'About',    page: 'about'    },
      { href: `${base}articles.html`, label: 'Articles', page: 'articles' }
    ];

    const items = links.map(l =>
      `<li><a href="${l.href}" class="nav-link"${activePage === l.page ? ' aria-current="page"' : ''}>${l.label}</a></li>`
    ).join('');

    return `<header class="site-header" id="site-header">
        <nav class="nav-inner container" aria-label="Main navigation">
          <a href="${base}index.html" class="nav-brand">Rubik</a>
          <button class="nav-toggle" aria-label="Open navigation menu" aria-expanded="false" aria-controls="nav-menu">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </button>
          <ul class="nav-menu" id="nav-menu" role="list">${items}</ul>
        </nav>
      </header>`;
  }

  function buildFooter() {
    return `<footer class="site-footer" id="site-footer">
        <div class="footer-inner container">
          <div class="footer-socials">
            <a href="https://www.linkedin.com/in/ru8ik/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">${SVG.linkedin}</a>
            <a href="https://github.com/ru8ik" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">${SVG.github}</a>
          </div>
          <p class="footer-tagline">Hand-built in HTML, CSS &amp; JavaScript &middot; Hosted on GitHub Pages</p>
          <p class="footer-copy">&copy; <span id="current-year"></span> Rubik Seviyants</p>
        </div>
      </footer>`;
  }

  /* ------------------------------------------------------------------
     INJECTION
     Replaces a placeholder div with real HTML. Returns true if found.
  ------------------------------------------------------------------ */
  function inject(id, html) {
    const el = document.getElementById(id);
    if (!el) return false;
    el.outerHTML = html;
    return true;
  }

  /* ------------------------------------------------------------------
     BEHAVIOUR
  ------------------------------------------------------------------ */
  function setupScrollNav() {
    const header = document.getElementById('site-header');
    if (!header) return;
    const tick = () => header.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', tick, { passive: true });
    tick();
  }

  function setupHamburger() {
    const toggle = document.querySelector('.nav-toggle');
    const menu   = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    const close = () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
    };

    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    });

    document.addEventListener('click', e => {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) close();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        close();
        toggle.focus();
      }
    });
  }

  function setupBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ------------------------------------------------------------------
     INIT
  ------------------------------------------------------------------ */
  function init() {
    const hasNav    = inject('nav-root',    buildNav());
    const hasFooter = inject('footer-root', buildFooter());

    if (hasNav) {
      document.body.classList.add('has-nav');
      setupScrollNav();
      setupHamburger();
    }

    if (hasNav || hasFooter) {
      document.body.insertAdjacentHTML('beforeend',
        `<button class="back-to-top" id="back-to-top" aria-label="Scroll back to top">${SVG.arrowUp}</button>`
      );
      setupBackToTop();
    }

    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
