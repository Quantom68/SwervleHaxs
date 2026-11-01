/* global document, window */
// Runs before styles paint; no API requests, cookies or account data.
(() => {
  const root = document.documentElement;
  const key = 'swervle-website-theme';
  const apply = theme => {
    root.dataset.theme = theme;
    root.dataset.bsTheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0f181c' : '#f6f5ef');
    const toggle = document.querySelector('[data-theme-toggle]');
    if (toggle) {
      toggle.hidden = false;
      toggle.setAttribute('aria-pressed', String(theme === 'dark'));
      toggle.title = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;
    }
  };
  let theme = 'dark';
  try { if (window.localStorage.getItem(key) === 'light') theme = 'light'; } catch { /* Optional preference. */ }
  apply(theme);
  document.addEventListener('DOMContentLoaded', () => {
    apply(root.dataset.theme);
    document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      apply(next);
      try { window.localStorage.setItem(key, next); } catch { /* Current page still works. */ }
    });
  }, { once: true });
  window.addEventListener('storage', event => {
    if (event.key === key) apply(event.newValue === 'light' ? 'light' : 'dark');
  });
})();
