// Anti-Auto-Pause (AAP) by Google's Gemini Flash AI
// 1. Force the document to always report as visible and focused
Object.defineProperty(document, 'hidden', {
    get: () => false,
    configurable: true
});

Object.defineProperty(document, 'visibilityState', {
    get: () => 'visible',
    configurable: true
});

Object.defineProperties(document, {
    hasFocus: {
        value: () => true,
        writable: false
    }
});

// 2. Intercept and block blur and visibility change events
const stopFocusEvents = (e) => e.stopImmediatePropagation();

window.addEventListener('blur', stopFocusEvents, true);
window.addEventListener('mouseleave', stopFocusEvents, true);
document.addEventListener('visibilitychange', stopFocusEvents, true);