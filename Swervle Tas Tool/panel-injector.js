(function () {
    // Prevent duplicate injections
    if (document.getElementById('tm-floating-panel')) {
        return;
    }

    // 2. Create Panel Container
    const panel = document.createElement('div');
    panel.id = 'tm-floating-panel';
    panel.innerHTML = `
        <div id="tm-panel-header">
            <span>Helping Hecking Hacky Haxs</span>
            <div class="tm-header-controls">
                <button id="tm-panel-toggle" class="tm-header-btn" title="Minimize/Maximize">&minus;</button>
                <button id="tm-panel-close" class="tm-header-btn" title="Close">&times;</button>
            </div>
        </div>
        <div class="tm-panel-body">
            <p style="font-size: 13px; margin: 10px 0 0 0;">Custom panel actions:</p>
            <button id="tm-action-btn" class="tm-btn">Test</button>
            <p style="font-size: 13px; margin: 10px 0 0 0;">Ghosts:</p>
            <button id="tm-import-ghost-btn" class="tm-btn">Import Ghost.json</button>
            <input type="file" id="tm-import-ghost-file-input" style="display: none;" accept=".json,.txt,.csv" />
            <p style="font-size: 13px; margin: 10px 0 0 0;">Play Controls:</p>
            <div class="tm-multi-element-line">
                <button id="tm-playback-start-btn" class="tm-btn">Start</button>
                <button id="tm-playback-stop-btn" class="tm-btn">Stop</button>
            </div>
            <div class="tm-multi-element-line">
                <button id="tm-reset-btn" class="tm-btn">Reset</button>
                <button id="tm-dispose-btn" class="tm-btn">Disp.</button>
                <button id="tm-diagnostics-btn" class="tm-btn">Diag.</button>
            </div>
            <div class="tm-multi-element-line">
                <button id="tm-pause-btn" class="tm-btn">Pause</button>
                <button id="tm-resume-btn" class="tm-btn">Resume</button>
            </div>
            <div class="tm-multi-element-line">
                <input type="number" id="tm-test-ticks-input" class="tm-input" placeholder="Test Ticks" />
                <button id="tm-test-ticks-btn" class="tm-btn">Adv. Ticks</button>
            </div>
            <p style="font-size: 13px; margin: 10px 0 0 0;">Time Scale:</p>
            <div class="tm-multi-element-line">
                <input type="range" id="tm-time-scale-slider" min="0" max="1" step="0.01" value="1" />
                <span id="tm-time-scale-slider-display">1.00</span>
            </div>
            <p style="font-size: 13px; margin: 10px 0 0 0;">TAS:</p>
            <div class="tm-multi-element-line">
                <button id="tm-export-states-btn" class="tm-btn">Export States</button>
                <button id="tm-import-states-btn" class="tm-btn">Import States</button>
                <input type="file" id="tm-import-states-file-input" style="display: none;" accept=".json,.txt,.csv" />
            </div>
            <div class="tm-multi-element-line">
                <button id="tm-tas-start-btn" class="tm-btn">Start</button>
                <button id="tm-tas-stop-btn" class="tm-btn">Stop</button>
            </div>
            <div class="tm-multi-element-line">
                <button id="tm-savestate-btn" class="tm-btn">Save State [Q]</button>
                <button id="tm-loadstate-btn" class="tm-btn">Load State [E]</button>
            </div>
        </div>
    `;

    // 3. Append Panel to Page
    (document.body || document.documentElement).appendChild(panel);
})();