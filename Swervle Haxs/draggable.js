(function () {
  function makeDraggable(el, storageKey) {
    let state = { left: null, top: null, scale: 1 };
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (saved) state = Object.assign(state, saved);
    } catch (e) {}

    el.style.transformOrigin = 'top left';

    function apply() {
      if (Number.isFinite(state.left) && Number.isFinite(state.top)) {
        el.style.left = state.left + 'px';
        el.style.top = state.top + 'px';
        el.style.right = 'auto';
        el.style.bottom = 'auto';
      }
      el.style.transform = `scale(${state.scale})`;
    }

    function save() {
      try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch (e) {}
    }

    const captureStart = () => {
      if (Number.isFinite(state.left)) { apply(); return; }
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) {
        requestAnimationFrame(captureStart);
        return;
      }
      state.left = r.left; state.top = r.top;
      apply();
    };
    requestAnimationFrame(captureStart);

    let dragging = false, offX = 0, offY = 0;
    let resizing = false, startX = 0, startScale = 1, baseW = 1;

    const BUFFER = 60;
    window.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const near =
        e.clientX >= r.left - BUFFER && e.clientX <= r.right + BUFFER &&
        e.clientY >= r.top - BUFFER && e.clientY <= r.bottom + BUFFER;
      el.classList.toggle('swervle-near', near || dragging || resizing);
    }, true);

    const handle = document.createElement('div');
    handle.className = 'swervle-drag-handle';
    handle.textContent = '⠿';
    handle.title = 'Drag to move';
    el.appendChild(handle);

    handle.addEventListener('mousedown', (e) => {
      dragging = true;
      const rect = el.getBoundingClientRect();
      offX = e.clientX - rect.left;
      offY = e.clientY - rect.top;
      e.preventDefault(); e.stopPropagation();
    }, true);

    const grip = document.createElement('div');
    grip.className = 'swervle-resize-grip';
    grip.textContent = '◢';
    grip.title = 'Drag to resize';
    el.appendChild(grip);

    grip.addEventListener('mousedown', (e) => {
      resizing = true;
      startX = e.clientX;
      startScale = state.scale;
      baseW = el.getBoundingClientRect().width / state.scale;
      e.preventDefault(); e.stopPropagation();
    }, true);

    window.addEventListener('mousemove', (e) => {
      if (dragging) {
        let left = e.clientX - offX;
        let top = e.clientY - offY;
        const w = el.getBoundingClientRect().width;
        const h = el.getBoundingClientRect().height;
        left = Math.max(0, Math.min(window.innerWidth - w, left));
        top = Math.max(0, Math.min(window.innerHeight - h, top));
        state.left = left; state.top = top;
        apply();
        e.preventDefault();
      } else if (resizing) {
        const dx = e.clientX - startX;
        let scale = startScale + dx / baseW;
        scale = Math.max(0.5, Math.min(3, scale));
        state.scale = scale;
        apply();
        e.preventDefault();
      }
    }, true);

    window.addEventListener('mouseup', () => {
      if (dragging || resizing) { dragging = false; resizing = false; save(); }
    }, true);
  }

  window.__swervleCustomMakeDraggable = makeDraggable;
})();