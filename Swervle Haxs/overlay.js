(function () {
  if (document.getElementById('swervle-hax-key-overlay')) return;

  // Poll until Swervle Overlay is detected on the page
  function detectAndInit() {
    // Swervle Overlay registers __swervleMakeDraggable on window and mounts #swervle-settings-btn
    const isSwervleOverlayPresent = Boolean(
      window.__swervleMakeDraggable || document.getElementById('swervle-settings-btn')
    );

    if (!isSwervleOverlayPresent) {
      // Swervle Overlay is not active; retry shortly
      setTimeout(detectAndInit, 500);
      return;
    }

    initOverlay();
  }

  function initOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'swervle-hax-key-overlay';
    overlay.innerHTML = `
      <div class="row wrow">
        <div class="key" data-action="throttle">W</div>
        <div class="key rkey" data-action="recoveryRequested">R</div>
      </div>
      <div class="row">
        <div class="key" data-action="steerLeft">A</div>
        <div class="key" data-action="reverse">S</div>
        <div class="key" data-action="steerRight">D</div>
      </div>
      <div class="row"><div class="key space" data-action="handbrake">SPACE</div></div>
    `;

    const mount = () => {
      if (document.body) {
        document.body.appendChild(overlay);
      } else {
        requestAnimationFrame(mount);
      }
    };
    mount();

    // Make overlay draggable using swervle-keys-pos
    const enableDrag = () => {
      if (window.__swervleCustomMakeDraggable) {
        window.__swervleCustomMakeDraggable(overlay, 'swervle-keys-pos');
      } else {
        requestAnimationFrame(enableDrag);
      }
    };
    enableDrag();

    // Read toggle status from swervle-ui-enabled
    function checkEnabledSettings() {
      try {
        const settings = JSON.parse(localStorage.getItem('swervle-ui-enabled') || '{}');
        if (settings['swervle-key-overlay'] === false) {
          overlay.classList.add('swervle-hidden');
        } else if (!overlay.dataset.userHidden) {
          overlay.classList.remove('swervle-hidden');
        }
      } catch (e) {}
    }

    // Poll game actions and setting toggles
    function updateLoop() {
      try {
        const game = window.__SWERVLE_GAME__;
        const actions = game && game.__debugCurrentActions;

        if (actions) {
          overlay.querySelectorAll('.key').forEach((el) => {
            const action = el.dataset.action;
            const isActive = Boolean(actions[action]);
            el.classList.toggle('active', isActive);
          });
        }
      } catch (e) {}

      checkEnabledSettings();
      requestAnimationFrame(updateLoop);
    }

    requestAnimationFrame(updateLoop);

    // Ctrl+H toggle
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'h' || e.key === 'H')) {
        const hidden = overlay.classList.toggle('swervle-hidden');
        overlay.dataset.userHidden = hidden ? 'true' : '';
      }
    }, true);
  }

  detectAndInit();
})();