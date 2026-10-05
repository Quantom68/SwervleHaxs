(function () {
    // Prevent attaching listeners multiple times
    if (window.__TM_PANEL_INITIALIZED__) return;
    window.__TM_PANEL_INITIALIZED__ = true;

    // 4. Panel Control Event Handlers
    const panel = document.getElementById('tm-floating-panel');
    const toggleBtn = document.getElementById('tm-panel-toggle');

    if (toggleBtn && panel) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isMinimized = panel.classList.toggle('minimized');
            toggleBtn.innerHTML = isMinimized ? '&#43;' : '&minus;';
        });
    }

    document.getElementById('tm-panel-close')?.addEventListener('click', (e) => {
        e.stopPropagation();
        panel?.remove();
        window.__TM_PANEL_INITIALIZED__ = false;
    });

    // Test
    document.getElementById('tm-action-btn')?.addEventListener('click', () => {
        alert('Action executed!');
        console.log(window.__SWERVLE_GAME__);
    });

    // Import Ghost.json
    document.getElementById('tm-import-ghost-btn')?.addEventListener('click', () => {
        document.getElementById('tm-import-ghost-file-input')?.click();
    });

    // Handle file selection
    document.getElementById('tm-import-ghost-file-input')?.addEventListener('change', async (e) => {
        const rawText = await uploadFile(e);
        if (!rawText) return;
        const ghostData = JSON.parse(rawText);
        await window.__SWERVLE_GAME__?.loadRivalGhost(ghostData);
    });

    // Playback Start
    document.getElementById('tm-playback-start-btn')?.addEventListener('click', () => {
        window.__SWERVLE_GAME__?.start();
    });

    // Playback Stop
    document.getElementById('tm-playback-stop-btn')?.addEventListener('click', () => {
        window.__SWERVLE_GAME__?.stop();
    });

    // Reset
    document.getElementById('tm-reset-btn')?.addEventListener('click', () => {
        window.__SWERVLE_GAME__?.reset();
    });

    // Dispose
    document.getElementById('tm-dispose-btn')?.addEventListener('click', () => {
        window.__SWERVLE_GAME__?.dispose();
    });

    // Pause
    document.getElementById('tm-pause-btn')?.addEventListener('click', () => {
        window.__SWERVLE_GAME__?.advanceTestTicks(0);
    });

    // Resume
    document.getElementById('tm-resume-btn')?.addEventListener('click', () => {
        window.__SWERVLE_GAME__?.resumeTestFrames();
    });

    // Diagnostics
    document.getElementById('tm-diagnostics-btn')?.addEventListener('click', () => {
        //let diagnostics = window.__SWERVLE_GAME__?.diagnostics();
        let diagnostics = window.__SWERVLE_GAME__?.__debugDiagnostics;
        console.log('Diagnostics:', diagnostics);
    });

    // TAS Variables
    let tas_states = null;
    let tas_savestate = null;

    // Export States
    document.getElementById('tm-export-states-btn')?.addEventListener('click', () => {
        const states = window.__SWERVLE_GAME__?.__debugCaptureStates();
        if (states) {
            const base64Data = uint8ToBase64(states);
            downloadFile(base64Data, 'states.txt', 'text/plain');
        }
    });

    // Import States
    document.getElementById('tm-import-states-btn')?.addEventListener('click', () => {
        document.getElementById('tm-import-states-file-input')?.click();
    });

    // Handle file selection
    document.getElementById('tm-import-states-file-input')?.addEventListener('change', async (e) => {
        const rawText = await uploadFile(e);
        if (!rawText) return;

        try {
            const ghostData = JSON.parse(rawText);
            tas_states = ghostData.statesBase64;
        } catch(err) {
            tas_states = rawText;
        }
    });

    // TAS Start
    document.getElementById('tm-tas-start-btn')?.addEventListener('click', () => {
        window.__SWERVLE_GAME__?.__debugStartPlayback(tas_states);
    });

    // TAS Stop
    document.getElementById('tm-tas-stop-btn')?.addEventListener('click', () => {
        window.__SWERVLE_GAME__?.__debugStopPlayback();
    });

    // TAS Savestate
    document.getElementById('tm-savestate-btn')?.addEventListener('click', () => {
        tas_savestate = window.__SWERVLE_GAME__?.__debugSaveState();
    });

    // TAS Loadstate
    document.getElementById('tm-loadstate-btn')?.addEventListener('click', () => {
        window.__SWERVLE_GAME__?.__debugLoadState(tas_savestate);
    });

    // 5. File Export Implementation
    function downloadFile(content, fileName, contentType = 'text/plain') {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // 6. File Import Implementation
    async function uploadFile(e) {
        const file = e.target.files[0];
        if (!file) return null;
        e.target.value = '';
        const rawText = await file.text();
        console.log('Imported File Content:', rawText);
        return rawText;
    }

    // 7. Handle Test Ticks Advancement
    const testTicksBtn = document.getElementById('tm-test-ticks-btn');
    const testTicksInput = document.getElementById('tm-test-ticks-input');

    testTicksBtn?.addEventListener('click', () => {
        const inputValue = testTicksInput.value;
        console.log("Advancing " + inputValue + " Test Ticks.");
        window.__SWERVLE_GAME__?.advanceTestTicks(parseInt(inputValue, 10));
    });

    // 8. Handle Time Scale Slider
    const timeScaleSlider = document.getElementById('tm-time-scale-slider');
    const timeScaleDisplay = document.getElementById('tm-time-scale-slider-display');

    function onSliderChange(newValue) {
        console.log('Slider value updated:', newValue);
        window.__SWERVLE_GAME__?.__debugTimeScale?.setTarget(newValue);
    }

    timeScaleSlider?.addEventListener('change', (event) => {
        const val = parseFloat(event.target.value);
        onSliderChange(val);
    });

    timeScaleSlider?.addEventListener('input', (event) => {
        const val = parseFloat(event.target.value);
        if (timeScaleDisplay) {
            timeScaleDisplay.textContent = val.toFixed(2);
        }
    });

    // 9. Misc. Functions
    function uint8ToBase64(uint8Array) {
        return btoa(String.fromCharCode.apply(null, uint8Array));
    }

    // 10. Keybinds
    window.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

        if (e.code === 'KeyQ') {
            e.preventDefault();
            document.getElementById('tm-savestate-btn')?.click();
        }
        if (e.code === 'KeyE') {
            e.preventDefault();
            document.getElementById('tm-loadstate-btn')?.click();
        }
    });

    // 14. Panel Drag and Drop Implementation
    const header = document.getElementById('tm-panel-header');
    let isDragging = false, offsetX = 0, offsetY = 0;

    header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.tm-header-btn')) return;
        isDragging = true;
        offsetX = e.clientX - panel.offsetLeft;
        offsetY = e.clientY - panel.offsetTop;
        panel.style.right = 'auto';
        panel.style.left = panel.offsetLeft + 'px';
        panel.style.top = panel.offsetTop + 'px';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        panel.style.left = (e.clientX - offsetX) + 'px';
        panel.style.top = (e.clientY - offsetY) + 'px';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // 15. Advance Switch
    const advancedCheckbox = document.getElementById('tm-advanced-toggle');
    const panelBody = panel?.querySelector('.tm-panel-body');

    advancedCheckbox?.addEventListener('change', (e) => {
        if (!panelBody) return;

        // 1. Store the previous scroll position and scroll height before state change
        const previousScrollTop = panelBody.scrollTop;
        const previousScrollHeight = panelBody.scrollHeight;

        // 2. Toggle the class
        if (e.target.checked) {
            panel.classList.add('advanced-mode');
            
            // 3. Calculate how much content height was added
            const heightDifference = panelBody.scrollHeight - previousScrollHeight;

            // 4. Scroll down by the difference so content above doesn't jump visual positions
            panelBody.scrollTop = previousScrollTop + heightDifference;
        } else {
            panel.classList.remove('advanced-mode');
        }
    });
})();