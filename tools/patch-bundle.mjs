#!/usr/bin/env node
// Usage:
//   node tools/patch-bundle.mjs <main.js> <terrainview-chunk.js> <out-main.js> <out-terrainview.js>

import { readFileSync, writeFileSync } from "node:fs";

const [, , mainIn, replayIn, mainOut, replayOut] = process.argv;
if (!mainIn || !replayIn || !mainOut || !replayOut) {
  console.error("Usage: node patch-bundle.mjs <main.js> <replay-chunk.js> <out-main.js> <out-replay.js>");
  process.exit(1);
}

// ---- Minified Identifier Mapping for Current Bundles ----
// main bundle: index-gfwPTtYR.js
// replay chunk: replay-C4CGFH_K.js
// Updated: 2026-08-30
// Key Prefix Legend:
//   v - Variable
//   f - Function
//   c - Class
//   p - Private/Public Property
//   m - Method
const NAMES = {
  // --- Network & Server Communication ---
  
  /** 
   * Main game POST runner method.
   * Sends network requests to post telemetry or run logs.
   * Line 5472: async #f(e, t) { ... }
   */
  mRunPoster: "#f",

  /** 
   * Low-level fetch wrapper handling standard headers, CSRF tokens, and timeouts.
   * Line 5439: #p(e, t, n = {}) { ... }
   */
  mServerAccesser: "#p",

  /** 
   * Timeout duration property for submission network calls.
   * Lines 5194, 5201: this.#i = e.submissionTimeoutMs ?? Gc
   */
  pTimeoutMs: "#i",

  /** 
   * Helper function validating whether a response is valid non-null JSON.
   * Line 5754: async function El(e) { ... }
   */
  fResponseChecker: "Dl",

  /** 
   * Checks if a network request error was caused by an AbortError/Timeout.
   * Line 5763: function Dl(e) { ... }
   */
  fServerAccessErrorClassifier: "Ol",

  /** 
   * Primary network communication class managing API connections & fetch logic.
   * Line 5242: var nl = class { ... }
   */
  cServerCommunicationManager: "rl",


  // --- Domain & Environment Logic ---

  /** 
   * Method determining if the current environment is local based on hostname.
   * Line 14475: #gr() { return cl(globalThis.location.hostname) }
   */
  mCheckIfLocalBaseOnHostname: "#vr",

  /** 
   * Helper checking hostname patterns to declare local/dev environment status.
   * Line 5483: function cl(e, t = Ml()) { ... }
   */
  fCheckIfLocal: "ll",

  /** 
   * Validates ISO calendar dates (YYYY-MM-DD) formatted for daily events.
   * Line 4553: function xs(e) { ... }
   */
  fValidateDate: "xs",

  /** 
   * Validates daily run submissions and returns player rank calculation.
   * Line 3265: function Xa(e) { ... }
   */
  fValidateDayRunsAndFindRank: "Xa",


  // --- Game Engine & Core State ---

  /** 
   * Core orchestrator class for game loop, inputs, and UI integration.
   * Line 13365: Main game instance managing active state & sub-managers.
   */
  cMainGame: "Qv",

  /** 
   * Property holding the current lifecycle state string (e.g., 'new', 'running', 'disposed').
   * Line 13501: #st = `new`;
   */
  pLifecycleState: "#st",

  /** 
   * Checks if the main game instance has been disposed.
   * Line 14869: #Fr() { return this.#st === `disposed` }
   */
  mCheckIfDisposed: "#Lr",

  /** 
   * Instance managing game clock ticks and time scale updates.
   * Lines 13505, 13985: this.#dt = new Nt({ ... })
   */
  pTimeManagerObject: "#dt",

  /** 
   * Recorder instance capturing player input bytes frame-by-frame.
   * Line 13521: #Dt = new de(E.maximumRaceTicks);
   */
  pRunRecorderObject: "#Dt",

  /** 
   * Core physics and state simulation manager.
   * Handles vehicle step updates, body snapshots, and tick advancing.
   * Lines 13472, 13874: this.#Be = i, this.#cs();
   */
  pSimulationManager: "#Be",

  /** 
   * Ghost object representing rival racer physics/playback snapshot.
   * Lines 13525, 13978: this.#jt = e
   */
  pRivalGhost: "jt",

  /** 
   * Encoded base64 string or bitfield integer representing current control inputs.
   * Lines 13499, 14580, 14595: this.#at = p & 95
   */
  pInputBase64: "#at",

  /** 
   * Object storing recorded telemetry and car snapshot data of rival racers.
   * Lines 13524, 13978: this.#At = o
   */
  pRecordedRivalObject: "At",


  // --- Game Data & UI Rendering ---

  /** 
   * Reference object holding active daily challenge management methods.
   * Lines 13368, 13582: this.#n = e.service ?? new hs
   */
  pDailyManagerObject: "#n",

  /** 
   * Keyed Map storing historical run telemetry objects (`runId` -> `RunData`).
   * Used for leaderboard caching and replay lookup.
   * Lines 13408, 17098: return this.#R.set(e, n), n
   */
  pRunsMap: "#R",

  /** 
   * Redraws account rows in the calendar menu view when runs update.
   * Iterates through deleted entries and calls surface update hooks.
   * Line 17290: #jo(e) { ... }
   */
  mRepaintCalendarAccountRows: "#jo",

  /** 
   * Map containing player finish times mapped by competitive rank position.
   * Lines 13411, 17301: this.#V.set(n, r);
   */
  pRankTimes: "#V",

  /** 
   * Renders HTML structure for the post-race leaderboard panel.
   * Line 6965: function Uu(e) { ... }
   */
  fRenderLeaderboard: "Uu",

  /** 
   * Immutable fallback object containing default zeroed player actions.
   * Line 13007: var bv = Object.freeze({ ... })
   */
  vDefaultActionsSample: "bv",

  /** 
   * Helper function mapping raw action input states into boolean flags.
   * Line 47: f as ce
   */
  fActionBools: "ce",

  /** 
   * Returns current car boost availability meter or boost energy status (>0).
   * Line 110: s as Ze
   */
  fBoostMeter: "Ze",

  /**
   * The amount of boost.
   * Line 13551, 13863 this.#rn = Ke(n.dailyId, n.track.revision.rulesetVersion, { previewUnreleasedRules: r })
   */
  pBoostMeter: "#rn",
};

// Every patch's success/failure, in call order, across all three files —
// printed as a summary at the end and used for the process's exit code, so
// a site update that breaks one anchor is loud and specific ("patch X needs
// regenerating") instead of silent or all-or-nothing.
const results = [];

// Each patch is independent and best-effort: a single stale anchor (the
// site changed the one bit of code that patch targets) logs a clear warning
// and skips *only* that insertion/replacement — every other patch, and the
// output file itself, still get written. The alternative (throwing,
// aborting the whole script before writeFileSync) meant one small site
// change broke every feature at once, including ones the change had
// nothing to do with, and produced no output to even partially test
// against. This can't make anchor-based patching immune to the site
// changing — that's not achievable without the site publishing a stable
// extension API — but it keeps a redeploy's *blast radius* down to exactly
// the features whose specific anchors actually moved.
function makePatcher(fileLabel, getSrc, setSrc) {
  function run(kind, name, anchor, apply) {
    const src = getSrc();
    const count = src.split(anchor).length - 1;
    if (count !== 1) {
      console.warn(
        `⚠ [${fileLabel}] patch "${name}" anchor matched ${count} times (expected exactly 1) — ` +
          `skipping. The site's bundle has likely changed; this patch needs regenerating.\nAnchor: ${anchor}`
      );
      results.push({ file: fileLabel, name, ok: false });
      return;
    }
    setSrc(apply(src));
    results.push({ file: fileLabel, name, ok: true });
  }
  return {
    insertAfter(name, anchor, insertion) {
      run("insertAfter", name, anchor, (src) => {
        const idx = src.indexOf(anchor) + anchor.length;
        return src.slice(0, idx) + insertion + src.slice(idx);
      });
    },
    insertBefore(name, anchor, insertion) {
      run("insertBefore", name, anchor, (src) => {
        const idx = src.indexOf(anchor);
        return src.slice(0, idx) + insertion + src.slice(idx);
      });
    },
    replaceOnce(name, anchor, replacement) {
      run("replaceOnce", name, anchor, (src) => src.split(anchor).join(replacement));
    },
  };
}

// Rewrites every chunk-relative *import specifier* in `src`
// (`from"./Name-hash.js"`, and `import("./Name-hash.js")`) to an absolute
// swervle.com URL. Necessary because rules.json redirects requests for each
// of these three files' own URLs to a chrome-extension:// resource — which
// changes what the *browser* resolves each file's own relative imports
// against (a redirected response's URL becomes the new base for its module
// graph). This applies to ALL THREE patched files, not just the main
// bundle: TerrainView and CarAppearance each have their own relative
// imports to sibling chunks (RaceRules, Sha256, FlatPlaneLevel,
// ProtectedAssetManifest, SwervleEnvironment, and each other), and since
// they're *also* served from a chrome-extension:// origin once redirected,
// they need the same treatment. Without this, those sibling chunks 404/get
// denied ("Resources must be listed in web_accessible_resources") and the
// entire module graph breaks — the site never gets past its initial loading
// screen.
//
// Deliberately does NOT touch the site's own `__vite__mapDeps` preload
// table (bare `"assets/Name-hash.js"` strings, no `./` prefix) — that table
// only feeds a `<link rel=modulepreload>` performance-hint helper which
// prepends its own "/" before resolving against `import.meta.url` (see the
// site's own `jt`/`Nt` helpers). Rewriting those entries to absolute URLs
// doesn't compose with that prepend and produces garbage double-prefixed
// URLs (`chrome-extension://id/https://swervle.com/...`); left alone, that
// helper instead resolves to a clean (if still wrong-origin) URL, so the
// resulting 404 is quiet console noise instead of visible garbage — and
// either way it's a non-blocking preload hint, not the actual import, so
// real module loading is unaffected.
function rewriteRelativeChunkRefs(name, src) {
  const before = src;
  // Chunk name portion allows dots now too — "three.core-B23Xfibg.js"
  // (chunked out separately as of the 2026-08-18 update) wasn't matching
  // the old [A-Za-z0-9_]+ character class, so it was silently skipped:
  // still relative, still resolving against the wrong (extension) origin
  // once redirected, still denied. `[A-Za-z0-9_.]+` covers it without
  // getting greedy into the hash/extension part, since that's still
  // anchored by the trailing `-<hash>.(js|css)` shape.
  const out = src.replace(
    /([\"'`])\.\/([A-Za-z0-9_.]+-[A-Za-z0-9_-]{6,}\.(?:js|css))\1/g,
    `$1https://swervle.com/assets/$2$1`
  );
  const count = before === out ? 0 : (out.match(/https:\/\/swervle\.com\/assets\//g) || []).length;
  console.log(`${name}: rewrote ${count} relative chunk references to absolute swervle.com URLs.`);
  return out;
}

// Patches are minimized with duckduckgo's minifier

// ---- main bundle ----
let mainSrc = rewriteRelativeChunkRefs("main bundle", readFileSync(mainIn, "utf8"));

const mainPatcher = makePatcher(
  "main bundle",
  () => mainSrc,
  (s) => (mainSrc = s)
);

// == 0-5 Make Game Local ==

// 0. Replace the title text to confirm that the extension loaded
//    successfully.
mainPatcher.replaceOnce(
  "0replaceTitleText",
  "title:n.mode===`challenge`?`BEAT THIS RUN.`:`LET'S SWERVE`",
  "title:n.mode===`challenge`?`DESTROY THIS RUN.`:`LET'S TAS`",
)

// 1. Kill the run-submission network call. submitRunOutcome's only side
//    effect is POSTing to /runs via #f; making #f return a graceful
//    transport-failure without ever calling #p means the run is never
//    sent, while every other Rc method (leaderboard, status, etc.) is
//    untouched. The existing failure-handling path (see the "server
//    unreachable" branch a few lines below in #qn) already treats this
//    exactly like a real network hiccup — saves the run locally, shows
//    "OFFICIAL VERIFIER UNREACHABLE", never retries automatically.
//
//    TL:DR: Instead of posting, returns "server unreachable".
//    This is backup code incase `forceLocalVerifier` fails.
mainPatcher.replaceOnce(
  "1disableRunSubmission",
  "async"+NAMES.mRunPoster+"(e,t){try{let n=await this."+NAMES.mServerAccesser+"(`POST`,e,{body:t,csrf:!0,timeoutMs:this."+NAMES.pTimeoutMs+"});return Object.freeze({body:await "+NAMES.fResponseChecker+"(n),httpStatus:n.status,kind:`response`})}catch(e){return Object.freeze({classification:"+NAMES.fServerAccessErrorClassifier+"(e)?`server-timeout`:`server-unreachable`,kind:`transport-failure`,message:e instanceof Error&&e.message.length>0?e.message:null})}}",
  "async"+NAMES.mRunPoster+"(e,t){return Object.freeze({classification:`server-unreachable`,kind:`transport-failure`,message:`disabled-by-tas`})}"
);

// 2. Forces local verification instead of submiting to servers.
//    Suppose to prevent "OFFICIAL VERIFIER UNREACHABLE" screen
//    from appearing and shows the time.
mainPatcher.replaceOnce(
  "2forceLocalVerifier",
  NAMES.mCheckIfLocalBaseOnHostname+"(){return "+NAMES.fCheckIfLocal+"(globalThis.location.hostname)}",
  NAMES.mCheckIfLocalBaseOnHostname+"(){return!1}"
);

// 3. Force dailyRank() to call fetchStanding() to get rank.
mainPatcher.replaceOnce(
  "3forceFetchStanding",
  "dailyRank(e,t,n){if("+NAMES.fValidateDate+"(e),!Number.isSafeInteger(t)||t<1)return null;let r=[];return r.push(Object.freeze({competitorId:`local-player`,contestId:e,contestKind:`daily`,durationTicks:t,participantKind:`human`,publicDisplayName:`YOU`,publicRunId:n,verifiedAtIso:new Date(`${e}T23:59:59.999Z`).toISOString()})),"+NAMES.fValidateDayRunsAndFindRank+"({dailyId:e,results:r}).rankedEntries.find(e=>e.competitorId===`local-player`)?.rank??null}",
  "async dailyRank(e,t,n,r){if("+NAMES.fValidateDate+"(e),!Number.isSafeInteger(t)||t<1)return null;let g=new "+NAMES.cServerCommunicationManager+"({apiBase:`https://swervle.com/api/v1`});const standing=await g.fetchStanding(e,t,undefined,r).catch(()=>null);console.log(standing?.rank??null);return standing?.rank??null;}"
)

// 4. Add background daily rank fetch.
mainPatcher.insertBefore(
  "4AsyncRankFetchFunc",
  "function "+NAMES.fRenderLeaderboard+"(e){",
  "async function fetchDailyRankInBackground(dailyId, durationTicks) {let dailyRankGateway = new "+NAMES.cServerCommunicationManager+"({ apiBase: `https://swervle.com/api/v1` }); let standing = await dailyRankGateway.fetchStanding(dailyId, durationTicks); const nameElements = document.querySelectorAll('.leaderboard-name'); const myNameElement = Array.from(nameElements).find(el => el.textContent.trim() === 'YOU'); if (myNameElement) { const rankElement = myNameElement.closest('li').querySelector('.leaderboard-rank'); rankElement.textContent = String(standing.rank); } else { console.log(`[Swervle TAS Tool] Rank Element Not Found.`)}}"
)
/*
async function fetchDailyRankInBackground(dailyId, durationTicks) {
  // there prob should be failsafes, but I want this feature so I'm letting it fail to find the error.
  let dailyRankGateway = new "+NAMES.cServerCommunicationManager+"({ apiBase: `https://swervle.com/api/v1` });
  let standing = await dailyRankGateway.fetchStanding(dailyId, durationTicks);

  // 1. Find all .leaderboard-name elements
  const nameElements = document.querySelectorAll('.leaderboard-name');

  // 2. Find the one containing "YOU"
  const myNameElement = Array.from(nameElements).find(
    el => el.textContent.trim() === 'YOU'
  );

  if (myNameElement) {
    const rankElement = myNameElement.closest('li').querySelector('.leaderboard-rank');
    rankElement.textContent = String(standing.rank);
  } else {
    console.log(`[Swervle TAS Tool] Rank Element Not Found.`)
  }
}
*/

// 5. call fetchDailyRankInBackground()
mainPatcher.replaceOnce(
  "5makeRankUseAsyncFetch",
  "</li>`;return`",
  "</li>`;try{fetchDailyRankInBackground(`2026-08-30`, e.entries[0].durationTicks);}catch(e){console.log(`[Swervle TAS Tool]: ` + e)}return`"
)

// == 6-? TAS ==

// 6. Add TasPlayback class to manage tas playback.
mainPatcher.insertBefore(
  "6tasPlayback",
  "var "+NAMES.vDefaultActionsSample+"=Object.freeze({",
  "const BIT={throttle:1,reverse:2,steerLeft:4,steerRight:8,handbrake:16,recovery:32,boost:64};function decodeStateByte(prevByte,currByte){const heldBits=['throttle','reverse','steerLeft','steerRight','handbrake','boost'];const edges=[];for(const action of heldBits){const bit=BIT[action];const was=(prevByte&bit)!==0;const is=(currByte&bit)!==0;if(was!==is){edges.push({action,kind:is?'pressed':'released'})}}if((currByte&BIT.recovery)!==0){edges.push({action:'recover',kind:'pressed'})}const held={throttle:(currByte&BIT.throttle)!==0,reverse:(currByte&BIT.reverse)!==0,left:(currByte&BIT.steerLeft)!==0,right:(currByte&BIT.steerRight)!==0,handbrake:(currByte&BIT.handbrake)!==0,boost:(currByte&BIT.boost)!==0};return{edges,held}}class TasPlayback{constructor(statesBase64){const binary=atob(statesBase64);this.bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));this.prevByte=0}next(tick){const b=this.bytes[tick]??this.bytes[this.bytes.length-1]??0;const sample=decodeStateByte(this.prevByte,b);this.prevByte=b;return sample;}}"
)
/*
// BIT from TerrainView.js car-state-byte-v1
// too lazy to get it from the file
// instead this is a copy
const BIT = {
  throttle: 1,
  reverse: 2,
  steerLeft: 4,
  steerRight: 8,
  handbrake: 16,
  recovery: 32,   // encodes the "recover" edge, not a held state
  boost: 64,
};

function decodeStateByte(prevByte, currByte) {
  const heldBits = ['throttle', 'reverse', 'steerLeft', 'steerRight', 'handbrake', 'boost'];
  const edges = [];
  for (const action of heldBits) {
    const bit = BIT[action];
    const was = (prevByte & bit) !== 0;
    const is  = (currByte & bit) !== 0;
    if (was !== is) edges.push({ action, kind: is ? 'pressed' : 'released' });
  }
  if ((currByte & BIT.recovery) !== 0) {
    edges.push({ action: 'recover', kind: 'pressed' });
  }
  const held = {
    throttle: (currByte & BIT.throttle) !== 0,
    reverse: (currByte & BIT.reverse) !== 0,
    left: (currByte & BIT.steerLeft) !== 0,
    right: (currByte & BIT.steerRight) !== 0,
    handbrake: (currByte & BIT.handbrake) !== 0,
    boost: (currByte & BIT.boost) !== 0,
  };
  return { edges, held };
}

class TasPlayback {
  constructor(statesBase64) {
    const binary = atob(statesBase64);
    this.bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    this.prevByte = 0;
  }
  next(tick) {
    const b = this.bytes[tick] ?? this.bytes[this.bytes.length - 1] ?? 0;
    const sample = decodeStateByte(this.prevByte, b);
    this.prevByte = b;
    return sample; // {edges, held} — same shape n.sample() returns
  }
}
*/

// 7. Add getters and methods to the main game class.
mainPatcher.insertAfter(
  "7addMainGettersAndMethods",
  "get lifecycleState(){return this."+NAMES.pLifecycleState+"}",
  "get __debugTimeScale(){return this."+NAMES.pTimeManagerObject+"?.timeScale??null}get __debugCurrentActions(){return this.__lastActions??null}__debugCaptureStates(){return this."+NAMES.pRunRecorderObject+".captureStates()}__debugStartPlayback(statesBase64){this.__tas=new TasPlayback(statesBase64)}__debugStopPlayback(){this.__tas=null}__debugSaveState(){return{simulation:this."+NAMES.pSimulationManager+".simulation.captureSnapshot(),inputBytes:this."+NAMES.pRunRecorder+".captureStates(),ghost:this."+NAMES.pRivalGhost+"?.captureRawSnapshot()??null}}__debugLoadState(state){this."+NAMES.pSimulationManager+".simulation.restoreSnapshot(state.simulation);this."+NAMES.pTimeManagerObject+"?.clock.restore(this."+NAMES.pSimulationManager+".simulation.captureSnapshot().clock);this."+NAMES.pRunRecorderObject+".reset();for(const b of state.inputBytes){this."+NAMES.pRunRecorderObject+".recordByte(b)}this."+NAMES.pInputBase64+"=state.inputBytes.length>0?state.inputBytes[state.inputBytes.length-1]&95:0;if(this."+NAMES.pRivalGhost+"&&state.ghost){this."+NAMES.pRivalGhost+".restoreRawSnapshot(state.ghost);this."+NAMES.pRecordedRivalObject+"?.consumeSnapshot(this."+NAMES.pRivalGhost+".frame.car)}}"
)
/*
get __debugTimeScale() { return this."+NAMES.pTimeManagerObject+"?.timeScale ?? null; }
get __debugCurrentActions() { return this.__lastActions ?? null; }
__debugCaptureStates() { return this."+NAMES.pRunRecorderObject+".captureStates(); }
__debugStartPlayback(statesBase64) {
  this.__tas = new TasPlayback(statesBase64)
}
__debugStopPlayback() { this.__tas = null; }
__debugSaveState() {
  return {
    simulation: this."+NAMES.pSimulationManager+".simulation.captureSnapshot(),
    inputBytes: this."+NAMES.pRunRecorder+".captureStates(),
    ghost: this."+NAMES.pRivalGhost+"?.captureRawSnapshot() ?? null,
  };
}
__debugLoadState(state) {
  this."+NAMES.pSimulationManager+".simulation.restoreSnapshot(state.simulation);
  this."+NAMES.pTimeManagerObject+"?.clock.restore(this."+NAMES.pSimulationManager+".simulation.captureSnapshot().clock);

  this."+NAMES.pRunRecorderObject+".reset();
  for (const b of state.inputBytes) this."+NAMES.pRunRecorderObject+".recordByte(b);
  this."+NAMES.pInputBase64+" = state.inputBytes.length > 0
    ? state.inputBytes[state.inputBytes.length - 1] & 95
    : 0;

  if (this."+NAMES.pRivalGhost+" && state.ghost) {
    this."+NAMES.pRivalGhost+".restoreRawSnapshot(state.ghost);
    this."+NAMES.pRecordedRivalObject+"?.consumeSnapshot(this."+NAMES.pRivalGhost+".frame.car);
  }
}
*/

// 8. Trick game into getting the inputs from the tas.
mainPatcher.replaceOnce(
  "8useTas",
  "let r=n.sample()",
  "let r=this.__tas?this.__tas.next(e-211):n.sample()"
)
/*
let r = this.__tas ? this.__tas.next(e-211) : n.sample()
*/

// 9. Capture last actions.
mainPatcher.replaceOnce(
  "9.1getActions",
  "u="+NAMES.fActionBools+"({boost:(r.held.boost===!0||o?.boost===!0)&&"+NAMES.fBoostMeter+"(this."+NAMES.pBoostMeter+")>0,handbrake:r.held.handbrake===!0||o?.handbrake===!0,recoveryRequested:a,reverse:r.held.reverse===!0||o?.reverse===!0,steerLeft:s||l===`left`,steerRight:c||l===`right`,throttle:r.held.throttle===!0||o?.throttle===!0})",
  "actions={boost:(r.held.boost===!0||o?.boost===!0)&&Ze(this.#rn)>0,handbrake:r.held.handbrake===!0||o?.handbrake===!0,recoveryRequested:a,reverse:r.held.reverse===!0||o?.reverse===!0,steerLeft:s||l===`left`,steerRight:c||l===`right`,throttle:r.held.throttle===!0||o?.throttle===!0},u=ce(actions)"
)
mainPatcher.insertAfter(
  "9.2setActions",
  "d=t.model.raceState;",
  "this.__lastActions={tick:e,source:this.__tas?`tas`:`live`,...actions};"
)

writeFileSync(mainOut, mainSrc, "utf8");
console.log(`Patched main bundle written to ${mainOut} (${mainSrc.length} bytes).`);

// ---- Replay Chunk ----
let replaySrc = rewriteRelativeChunkRefs("Replay chunk", readFileSync(replayIn, "utf8"));
const replayPatcher = makePatcher(
  "Replay chunk",
  () => replaySrc,
  (s) => (replaySrc = s)
);


writeFileSync(replayOut, replaySrc, "utf8");
console.log(`Patched Replay chunk written to ${replayOut} (${replaySrc.length} bytes).`);

// ---- summary ----
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} patches applied.`);
if (failed.length > 0) {
  console.log("Needs re-deriving:");
  for (const r of failed) console.log(`  - [${r.file}] ${r.name}`);
  console.log(
    "\nBoth output files were still written with every OTHER patch applied — " +
      "only the features tied to the anchors above are affected. Re-derive those " +
      "specific anchors against the current bundle (see the comments above each " +
      "patch call for what stable string to search for) and re-run."
  );
  process.exitCode = 1;
}
