// Swervle Haxs background service worker.
//
// Redirects the game's own script files to patched copies, from one of:
//   "local"  — files inside this extension (local/patched-bundle.js, ...),
//              produced by `node tools/patch-bundle.mjs --local ...`. Works for
//              an offline build on localhost.
//   "remote" — files published by the GitHub Action (raw.githubusercontent.com).
//
// Source: chrome.storage.local.srvSource = "local" | "remote". When unset,
// "local" is used if local/state.json exists in the package, else "remote".
// Switch from this worker's console:  chrome.storage.local.set({srvSource: "local"})

const REMOTE_BASE = "https://raw.githubusercontent.com/Quantom68/SwervleHaxs/main";
const RULE_MAIN = 1;
const RULE_TV = 2;

async function readState(url) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

async function chooseSource() {
  const { srvSource } = await chrome.storage.local.get("srvSource");
  const local = await readState(chrome.runtime.getURL("local/state.json"));
  const source = srvSource === "local" || srvSource === "remote" ? srvSource : local ? "local" : "remote";
  const state = source === "local" ? local : await readState(`${REMOTE_BASE}/state.json`);
  return { source, state };
}

const rule = (id, filename, redirect) => ({
  id,
  priority: 1,
  action: { type: "redirect", redirect },
  // Host-agnostic on purpose: the hashed filename is unique, and this makes it
  // work on swervle.com and on any localhost port alike.
  condition: { urlFilter: `/assets/${filename}|`, resourceTypes: ["script"] },
});

async function applyRules() {
  const { source, state } = await chooseSource();
  const addRules = [];
  if (state?.mainFilename) {
    addRules.push(
      rule(
        RULE_MAIN,
        state.mainFilename,
        source === "local" ? { extensionPath: "/local/patched-bundle.js" } : { url: `${REMOTE_BASE}/patched-bundle.js` }
      )
    );
    if (state.tvFilename)
      addRules.push(
        rule(
          RULE_TV,
          state.tvFilename,
          source === "local" ? { extensionPath: "/local/patched-terrainview.js" } : { url: `${REMOTE_BASE}/patched-terrainview.js` }
        )
      );
  }
  await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [RULE_MAIN, RULE_TV], addRules });

  const failed = state?.failedPatches?.length ?? 0;
  await chrome.action.setBadgeText({ text: !state ? "?" : failed ? "!" : source === "local" ? "LOC" : "" });
  await chrome.action.setBadgeBackgroundColor({ color: !state || failed ? "#c62828" : "#1565c0" });
  console.log("[srv haxs] source:", source, "state:", state, "rules:", addRules.length);
}

chrome.runtime.onInstalled.addListener(applyRules);
chrome.runtime.onStartup.addListener(applyRules);
chrome.storage.onChanged.addListener((c, area) => area === "local" && c.srvSource && applyRules());
// Remote files change independently of the extension; re-sync periodically.
chrome.alarms.create("srv-resync", { periodInMinutes: 15 });
chrome.alarms.onAlarm.addListener((a) => a.name === "srv-resync" && applyRules());
applyRules();
