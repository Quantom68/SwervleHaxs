/* global document, window */
import { raceComparison, formatFinishTime, parseFinishTime } from 'analytics.mjs';
let hlsScript;

const siteHeader = document.querySelector('.header-inner');
const menuToggle = document.querySelector('[data-menu-toggle]');
if (siteHeader && menuToggle) {
  const setMenuOpen = (open) => {
    siteHeader.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  siteHeader.classList.add('menu-ready');
  menuToggle.hidden = false;
  menuToggle.addEventListener('click', () => setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!siteHeader.contains(event.target) || event.target.closest('#header-menu a')) setMenuOpen(false);
  });
  window.matchMedia('(max-width: 850px)').addEventListener('change', () => setMenuOpen(false));
}

const homeHero = document.querySelector('.front-grid');
if (homeHero) {
  const trailerFrame = homeHero.querySelector('.trailer-region .youtube-player');
  const matchHeroFade = () => {
    const hero = homeHero.getBoundingClientRect();
    const bleed = Math.max(0, hero.top + window.scrollY);
    const values = { '--hero-bleed': `${bleed}px` };
    if (trailerFrame) {
      const trailer = trailerFrame.getBoundingClientRect();
      const width = window.innerWidth, height = hero.height + 2 * bleed;
      const left = hero.left + hero.width / 2 - width / 2;
      const centerX = trailer.left + trailer.width / 2 - left;
      const centerY = trailer.top + trailer.height / 2 - hero.top + bleed;
      // Center the source art on the player, scaling enough to cover the fade.
      const imageWidth = Math.max(2 * Math.max(centerX, width - centerX),
        2 * Math.max(centerY, height - centerY) * 16 / 9);
      const imageHeight = imageWidth * 9 / 16;
      values['--hero-art-size'] = `${imageWidth}px ${imageHeight}px`;
      values['--hero-art-position'] = `${centerX - imageWidth / 2}px ${centerY - imageHeight / 2}px`;
    }
    for (const [key, value] of Object.entries(values)) {
      if (homeHero.style.getPropertyValue(key) !== value) homeHero.style.setProperty(key, value);
    }
  };
  matchHeroFade();
  // Recalculate only when responsive layout changes; no polling or idle work.
  const observer = new window.ResizeObserver(matchHeroFade);
  observer.observe(document.querySelector('.site-header'));
  observer.observe(homeHero);
  if (trailerFrame) observer.observe(trailerFrame);
}

for (const chart of document.querySelectorAll('[data-finish-chart]')) {
  for (const controls of chart.querySelectorAll('[data-chart-controls]')) controls.hidden = false;
  for (const svg of chart.querySelectorAll('.finish-plot')) {
    const cursor = svg.querySelector('[data-plot-cursor]');
    const readout = cursor.querySelector('[data-plot-readout]');
    const text = readout.querySelector('text');
    const min = Number(svg.dataset.timeMin), max = Number(svg.dataset.timeMax);
    let frame = 0, pointerX = null, fraction = .5;
    const draw = () => {
      frame = 0;
      if (pointerX !== null) {
        const bounds = svg.getBoundingClientRect();
        fraction = ((pointerX - bounds.left) / bounds.width * 400 - 28) / 344;
      }
      fraction = Math.max(0, Math.min(1, fraction));
      const x = 28 + fraction * 344;
      cursor.setAttribute('transform', `translate(${x},0)`);
      readout.setAttribute('transform', `translate(${Math.max(28, Math.min(260, x - 56)) - x},24)`);
      text.textContent = formatFinishTime(min + fraction * (max - min));
      cursor.removeAttribute('hidden');
    };
    const hide = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
      cursor.setAttribute('hidden', '');
    };
    const track = event => {
      pointerX = event.clientX;
      // One DOM update per display frame; no timer or work when idle.
      if (!frame) frame = window.requestAnimationFrame(draw);
    };
    svg.addEventListener('pointerenter', track, { passive: true });
    svg.addEventListener('pointermove', track, { passive: true });
    svg.addEventListener('pointerleave', hide);
    svg.addEventListener('pointercancel', hide);
    svg.addEventListener('focus', () => { pointerX = null; draw(); });
    svg.addEventListener('blur', hide);
    svg.addEventListener('keydown', event => {
      if (event.key === 'Escape') { hide(); return; }
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      pointerX = null;
      fraction = event.key === 'Home' ? 0 : event.key === 'End' ? 1
        : fraction + (event.key === 'ArrowLeft' ? -.01 : .01);
      draw();
    });
  }
  for (const button of chart.querySelectorAll('[data-plot-toggle]')) {
    button.addEventListener('click', () => {
      const visible = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(visible));
      for (const part of chart.querySelectorAll('[data-plot-part]')) {
        if (part.dataset.plotPart === button.dataset.plotToggle) part.toggleAttribute('hidden', !visible);
      }
    });
  }
}

for (const board of document.querySelectorAll('[data-paged-board]')) {
  const rows = [...board.querySelectorAll('tbody tr')];
  const button = board.querySelector('[data-more-results]');
  const count = board.querySelector('[data-board-count]');
  let shown = Math.min(100, rows.length);
  const update = () => {
    rows.forEach((row,index) => { row.hidden = index >= shown; });
    button.hidden = shown >= rows.length;
    count.textContent = `${shown.toLocaleString('en-US')} of ${rows.length.toLocaleString('en-US')} racers shown.`;
  };
  button.addEventListener('click', () => { shown = Math.min(shown + 100, rows.length); update(); });
  update();
}

for (const form of document.querySelectorAll('[data-time-counts]')) {
  const counts = JSON.parse(form.dataset.timeCounts);
  form.addEventListener('submit', event => {
    event.preventDefault();
    const milliseconds = parseFinishTime(form.elements.time.value);
    const output = form.querySelector('output');
    const result = raceComparison(counts, milliseconds);
    if (!result) {
      output.textContent = 'Enter a positive time, such as 32.900 or 0:32.900.';
      return;
    }
    const format = value => value.toLocaleString('en-US');
    const gap = `${result.gapMs < 0 ? '-' : '+'}${(Math.abs(result.gapMs)/1000).toFixed(3)}s`;
    output.innerHTML = `<div class="comparison-heading"><span>Equivalent position</span><strong>#${format(result.rank)}</strong><small>against ${format(result.total)} racers</small></div><dl class="comparison-details"><div><dt>Gap to leader</dt><dd>${gap}</dd></div><div><dt>Racers ahead</dt><dd>${format(result.faster)}</dd></div></dl><p class="next-position">${result.nextTimeMs===null ? (result.gapMs<0 ? 'This time would lead the saved board.' : `This time matches the leader${result.tied>1?'s':''}.`) : `Gain ${format(result.rank-result.nextRank)} ${result.rank-result.nextRank===1?'place':'places'} (to #${format(result.nextRank)}): aim for <strong>${formatFinishTime(result.nextTimeMs)}</strong> (${(result.gainMs/1000).toFixed(3)}s faster).`}</p><p class="comparison-context">${format(result.tied)} existing ${result.tied===1?'racer has':'racers have'} this time. Based on the saved board.</p>`;

  });
}

function loadHls() {
  if (window.Hls) return Promise.resolve(window.Hls);
  hlsScript ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${document.body.dataset.assetsBase || document.body.dataset.siteBase || ''}/site/vendor/hls.min.js`;
    script.onload = () => window.Hls ? resolve(window.Hls) : reject(new Error("Player unavailable"));
    script.onerror = () => reject(new Error("Player unavailable"));
    document.head.append(script);
  });
  return hlsScript;
}

for (const frame of document.querySelectorAll("[data-steam-player]")) {
  const button = frame.querySelector(".trailer-play");
  const video = frame.querySelector("video");
  const status = frame.querySelector(".player-status");
  if (!button || !video || !status || !frame.dataset.stream) continue;
  button.hidden = false;
  let player;
  let prepared = false;
  function failed() {
    player?.destroy();
    player = undefined;
    prepared = false;
    video.pause();
    video.hidden = true;
    button.hidden = false;
    button.disabled = false;
    frame.classList.remove("is-playing");
    status.textContent = "The trailer could not load. Try again, or watch on Steam below.";
    status.hidden = false;
  }
  button.addEventListener("click", async () => {
    button.disabled = true;
    status.hidden = true;
    try {
      if (!prepared) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = frame.dataset.stream;
        } else {
          const Hls = await loadHls();
          if (!Hls.isSupported()) throw new Error("Streaming unavailable");
          player = new Hls({ maxBufferLength: 20, capLevelToPlayerSize: true });
          player.on(Hls.Events.ERROR, (_event, detail) => { if (detail.fatal) failed(); });
          player.loadSource(frame.dataset.stream);
          player.attachMedia(video);
        }
        prepared = true;
      }
      video.hidden = false;
      frame.classList.add("is-playing");
      button.hidden = true;
      await video.play();
      video.focus();
    } catch {
      failed();
    } finally {
      button.disabled = false;
    }
  });
  video.addEventListener("error", failed);
}

document.addEventListener("click", (event) => {
    const poster = event.target.closest?.("[data-youtube]");
    if (!poster || event.button > 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const id = poster.dataset.youtube;
    if (!/^[\w-]{11}$/.test(id ?? "")) return;
    event.preventDefault();
    const iframe = document.createElement("iframe");
    iframe.className = "youtube-frame";
    iframe.title = poster.getAttribute("aria-label") || "Swervle highlights";
    const start = Number(poster.dataset.youtubeStart);
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1${Number.isInteger(start) && start > 0 ? `&start=${start}` : ""}`;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;
    poster.replaceWith(iframe);
    iframe.focus();
});

if (document.querySelector("[data-streams]")) void import("streams-client.mjs608f.js?v=root-streams-2");

if (document.querySelector("[data-announcements]")) void import("news-client.mjs39a2.js?v=root-news-5");
