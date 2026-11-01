/* global document, location, window, IntersectionObserver */
import { streamFeedView, twitchPlayerUrl } from 'streams-view.mjsaa72.js?v=streams-1';
const section = document.querySelector('[data-streams]');
const content = section?.querySelector('[data-streams-content]');
let loaded = false;
async function load() {
  if (loaded || !content) return;
  loaded = true;
  try {
    const response = await fetch(document.body.dataset.streamsEndpoint || `${document.body.dataset.siteBase || ''}/api/streams`, { credentials: 'omit', signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error('Streams unavailable');
    const feed = await response.json();
    content.innerHTML = streamFeedView(feed);
    // An open tab cannot keep claiming a stream is live indefinitely. Expiry
    // relabels the links without polling or interrupting a playing video.
    if (feed.live?.expiresAt > Date.now()) window.setTimeout(() => {
      for (const badge of content.querySelectorAll('.stream-live')) { badge.textContent = 'ON TWITCH'; badge.classList.remove('stream-live'); badge.classList.add('data-tag'); }
      for (const label of content.querySelectorAll('[data-twitch-kind="live"] .stream-play')) label.textContent = 'Watch on Twitch';
    }, feed.live.expiresAt - Date.now());
  } catch {
    content.innerHTML = streamFeedView({});
  }
}
if (section) {
  // One request when the section is approached. No timers, background polling,
  // Twitch scripts or media players on the initial page load.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); void load(); }
    }, { rootMargin: '200px' });
    observer.observe(section);
  } else void load();
  section.addEventListener('click', event => {
    const link = event.target.closest('[data-twitch-kind]');
    // Twitch requires a 400px-wide player. Small phones open the native site.
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || window.innerWidth < 500) return;
    const src = twitchPlayerUrl(link.dataset.twitchKind, link.dataset.twitchId, location.hostname);
    if (!src) return;
    event.preventDefault();
    const dialog = document.createElement('dialog');
    dialog.className = 'stream-dialog';
    const close = document.createElement('button');
    close.className = 'small-button'; close.type = 'button'; close.textContent = 'Close';
    const frame = document.createElement('iframe');
    frame.src = src; frame.title = link.getAttribute('aria-label');
    frame.allow = 'autoplay; fullscreen; picture-in-picture'; frame.allowFullscreen = true;
    dialog.setAttribute('aria-label', frame.title);
    const dismiss = () => { frame.remove(); dialog.remove(); link.focus(); };
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', dismiss, { once: true });
    dialog.append(close, frame); document.body.append(dialog); dialog.showModal();
  });
}
