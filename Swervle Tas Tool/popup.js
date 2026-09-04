document.getElementById('inject-btn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab?.id) {
    // Inject CSS into the webpage
    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ['panel.css']
    });

    // Inject JS into the webpage
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['panel-injector.js']
    });

    // Inject Game Control Logic (MAIN World)
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        world: 'MAIN',
        files: ['panel-script.js']
    });
  }
});