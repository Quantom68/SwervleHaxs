#!/usr/bin/env node
// Usage:
//   node tools/patch-bundle.mjs <main.js> <terrainview-chunk.js> <out-main.js> <out-terrainview.js>

import { readFileSync, writeFileSync } from "node:fs";

const [, , mainIn, replayIn, mainOut, replayOut] = process.argv;
if (!mainIn || !replayIn || !mainOut || !replayOut) {
  console.error("Usage: node patch-bundle.mjs <main.js> <replay-chunk.js> <out-main.js> <out-replay.js>");
  process.exit(1);
}

// ---- minified identifier mapping for the CURRENT bundles ----
// main bundle: e3c40cc0-AQcOh4hE.js
// replay chunk: c3c40cc0-DxaohzSt.js
// Updated: 2026-08-30
// v - variable
// f - function
// c - class
// p - property
// m - method
const NAMES = {
  /* ln. 3756:
  async #h(e, t) {
    try {
      let n = await this.#g(`POST`, e, {
        body: t,
        csrf: !0,
        timeoutMs: this.#i
      });
      return Object.freeze({
        body: await Wl(n),
        httpStatus: n.status,
        kind: `response`
      })
    } catch (e) {
      return Object.freeze({
        classification: Gl(e) ? `server-timeout` : `server-unreachable`,
        kind: `transport-failure`,
        message: e instanceof Error && e.message.length > 0 ? e.message : null
      })
    }
  }*/
  mRunPoster: "#h",
  /* ln. 3776
  #h(e, t, n = {}) {
    let r = {
        accept: `application/json`
      },
      i = {
        credentials: `same-origin`,
        headers: r,
        method: e
      };
    if (n.body !== void 0 && (r[`content-type`] = `application/json`, i.body = JSON.stringify(n.body)), n.csrf === !0) {
      let e = ic(this.#n());
      e !== null && (r[`x-csrf-token`] = e)
    }
    return this.#g(Zs(this.#t, `${this.#e}${t}`, i, n.timeoutMs ?? this.#r))
  }*/
  mServerAccesser: "#g",
  /* ln. 3761
  timeoutMs: this.#i
  */
  pTimeoutMs: "#i",
  /* ln. 3764
  body: await $s(n),
  */
  fResponseChecker: "ss",
  /* ln. 3770
  classification: ec(e) ? `server-timeout` : `server-unreachable`,
  */
  fServerAccessErrorClassifier: "cs",
  /* ln. 8408
  requiresServerTruth() {
    return zo(globalThis.location.hostname)
  }*/
  mCheckIfLocalBaseOnHostname: "requiresServerTruth",
  /* ln. 8409
  return js(globalThis.location.hostname)
  */
  fCheckIfLocal: "zo",
  /* ln. 7542
  dailyRank(e, t, n) {
    if (Zu(e), !Number.isSafeInteger(t) || t < 1) return null;
  */
  fValidateDate: "Yu",
  /* ln. 5711
  Tc({
    dailyId: e,
    results: r
  }).rankedEntries.find(e => e.competitorId === `local-player`)?.rank ?? null*/
  fValidateDayRunsAndFindRank: "fu",
  /* ln. 5242
  var gl = class {
    #e;
    #t;
    #n;
    #r;
    #i;
    #a;
    #o = null;
    #s = `normal`;
    constructor(e = {}) {
      this.#e = e.apiBase ?? Xl();
      let t = e.fetchImpl ?? (typeof fetch == `function` ? fetch.bind(globalThis) : null);
      if (t === null) throw TypeError(`A fetch implementation is required for server mode.`);
      this.#t = t, this.#n = e.cookieSource ?? Yl, this.#r = e.requestTimeoutMs ?? ll, this.#i = e.submissionTimeoutMs ?? ul, this.#a = e.delayImpl ?? (e => new Promise(t => {
        setTimeout(t, e)
      }))
    }*/
  cServerCommunicationManager: "No",
  /* ln. 2706
  function ja(e) {
    let t = pa[e.surface],
      n = ma[e.surface],
      r = e.scopeControl,
      i = oa();
    if (e.state === `offline` && !i) return Ra(e.surface, t, n, r);
    if (e.state === `pending` && !i) return Ia(t, n, r);
    let a = jr(e.viewerTeamTag),
      o = Ga(e.entries).map(t => `
            <li${t.isPlayer?` data-player="true"`:``}>
              <span class="leaderboard-rank" aria-label="Rank ${String(t.rank)}">${String(t.rank)}</span>
              ${Va(t.isPlayer?e.viewerIsSupporter===!0||t.isSupporter===!0:t.isSupporter)}
              <span class="leaderboard-name">${Ba(t.isPlayer?e.viewerTeamTag??t.teamTag:t.teamTag,a)}<strong>${t.isPlayer?`YOU`:B(t.displayName)}</strong>${Ha(t.creatorLinks)}</span>
              <time>${N(t.displayTimeMs??Ee(t.durationTicks))}</time>
              ${qa(t.carPaint??null,t.isPlayer?`your car`:`${t.displayName}'s car`,t.isPlayer?`YOU`:t.displayName,N(t.displayTimeMs??Ee(t.durationTicks)),t.isPlayer,t.publicRunId,t.rank,t.joinedAtIso??null)}${e.offerSignIn?`
              ${t.isPlayer?Ja(e.signInCtaMode??`save`):`<span class="leaderboard-signin-slot" aria-hidden="true"></span>`}`:``}
            </li>`).join(``),
      s = e.viewerRow,
      c = s !== null && s.durationTicks === null,
      l = c ? fa : N(s?.displayTimeMs ?? Ee(s?.durationTicks ?? 0)),
      u = Ma(e, a),
      d = e.entries.length > 0 || u !== ``,
      f = s === null ? `` : `${d?`
            <li class="leaderboard-separator" role="presentation" aria-hidden="true"></li>`:``}
            <li class="leaderboard-you-outside" data-player="true"${c?` data-untimed="true"`:``}>
              <span class="leaderboard-rank" aria-label="${c?`No time yet`:s.rank===null?`Unranked`:`Rank ${String(s.rank)}`}">${c||s.rank===null?`&mdash;`:String(s.rank)}</span>
              ${Va(s.isSupporter===!0||e.viewerIsSupporter===!0)}
              <span class="leaderboard-name">${Ba(s.teamTag??e.viewerTeamTag,a)}<strong>YOU</strong>${Ha(s.creatorLinks)}</span>
              <time>${l}</time>
              ${qa(s.carPaint??null,`your car`,`YOU`,l,!0,void 0,s.rank,s.joinedAtIso??null)}${e.offerSignIn?`
              ${Ja(e.signInCtaMode??`save`)}`:``}
            </li>`;
    return `
          <aside class="result-leaderboard panel" data-slot="${t}"${Na(r)} data-board-state="ready" aria-labelledby="${n}">
            ${Fa(n,r)}
            <ol${e.offerSignIn?` data-sign-in="true"`:``}${$t()?``:` data-chips="off"`}>${o}${u}${f}</ol>
          </aside>`
  }*/
  fRenderLeaderboard: "kl",
  /* ln. 19908
  var fE = Object.freeze({
    boost: !1,
    handbrake: !1,
    reverse: !1,
    steerTarget: 0,
    throttle: !1
  }),
  pE = -1,
  mE = `input, textarea, select, option, [contenteditable=""], [contenteditable="true"]`,
  hE = `button, a[href], label, summary, [role="button"], [data-action]`,
  gE = 16,
  _E = {
    passive: !1
  },*/
  vDefaultActionsSample: "CE",
  /* ln. 20783
  get lifecycleState() {
    return this.#je
  }
  MAKE SURE IT'S THE ONE IN THE MAIN CLASS*/
  pLifecycleState: "#je",
  /* ln. 20819
  _.restore(s.simulation.captureSnapshot().clock), this.#Pe = new dn({
  */
  pTimeManagerObject: "#Fe",
  /* ln. 20574
  #Ze = new ot(Oe.maximumRaceTicks);
  */
  pRunRecorderObject: "#Qe",
  /* ln. 22292
  #Un(e) {
    if (this.#xe?.model.raceState.phase === `invalid`) {
      if (e === `scrim`) {
        this.#ai();
        return
      }
      globalThis.setTimeout(() => {
        this.#ce !== null || this.#xe?.model.raceState.phase !== `invalid` || this.#en(!0)
      }, 0)
    }
  }*/
  pSimulationManager: "#xe",
  /* ln. 21043
  o.setVisible(this.#mt.ghostsVisible), this.#mt.rival = o, this.#mt.rivalReplay = e, this.#mt.rivalPoses = this.#mt.ghostPoseChannel(this.#mt.rivalPoses, `rival`, i.opponent.states), this.#mt.rivalLivery = t, this.#mt.rivalGap = new Qx(i.track.routeLine)
  */
  pRivalGhost: "#ht.rivalReplay",
  /* ln. 21138
  this.#Ae = m & 95
  */
  pInputBase64: "#Ae",
  /* ln. 20812
  o.setVisible(this.#pt.ghostsVisible), this.#pt.rival = o, this.#pt.rivalReplay = e, this.#pt.rivalPoses = this.#pt.ghostPoseChannel(this.#pt.rivalPoses, `rival`, i.opponent.states), this.#pt.rivalLivery = t, this.#pt.rivalGap = new Gx(i.track.routeLine)
  */
  pRecordedRivalObject: "#ht.rival",
  /* ln. 21112
  d = lt({
    boost: (r.held.boost === !0 || s?.boost === !0) && ze(this.#nt) > 0,
    handbrake: r.held.handbrake === !0 || s?.handbrake === !0,
    recoveryRequested: o,
    reverse: r.held.reverse === !0 || s?.reverse === !0,
    steerLeft: c || u === `left`,
    steerRight: l || u === `right`,
    throttle: r.held.throttle === !0 || s?.throttle === !0
  }),
  */
  fActionBools: "lt",
  /* ln. 21113
  boost: (r.held.boost === !0 || o?.boost === !0) && ze(this.#et) > 0,
  */
  fBoostMeter: "ze",pBoostMeter: "#nt",
  /* ln. 20243
  The main game class.
  */
  cMainGame: "VE",
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
  "00replaceTitleText",
  "title:i.mode===`challenge`?`BEAT THIS RUN.`:`LET'S SWERVE`",
  "title:i.mode===`challenge`?`DESTROY THIS RUN.`:`LET'S TAS`",
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
  "01disableRunSubmission",
  "async"+NAMES.mRunPoster+"(e,t){try{let n=await this."+NAMES.mServerAccesser+"(`POST`,e,{body:t,csrf:!0,timeoutMs:this."+NAMES.pTimeoutMs+"});return Object.freeze({body:await "+NAMES.fResponseChecker+"(n),httpStatus:n.status,kind:`response`})}catch(e){return Object.freeze({classification:"+NAMES.fServerAccessErrorClassifier+"(e)?`server-timeout`:`server-unreachable`,kind:`transport-failure`,message:e instanceof Error&&e.message.length>0?e.message:null})}}",
  "async"+NAMES.mRunPoster+"(e,t){return Object.freeze({classification:`server-unreachable`,kind:`transport-failure`,message:`disabled-by-tas`})}"
);

// 2. Forces local verification instead of submiting to servers.
//    Suppose to prevent "OFFICIAL VERIFIER UNREACHABLE" screen
//    from appearing and shows the time.
mainPatcher.replaceOnce(
  "02forceLocalVerifier",
  NAMES.mCheckIfLocalBaseOnHostname+"(){return "+NAMES.fCheckIfLocal+"(globalThis.location.hostname)}",
  NAMES.mCheckIfLocalBaseOnHostname+"(){return!1}"
);

// 3. Force dailyRank() to call fetchStanding() to get rank.
mainPatcher.replaceOnce(
  "03forceFetchStanding",
  "dailyRank(e,t,n){if("+NAMES.fValidateDate+"(e),!Number.isSafeInteger(t)||t<1)return null;let r=[];return r.push(Object.freeze({competitorId:`local-player`,durationTicks:t,participantKind:`human`,publicDisplayName:`YOU`,publicRunId:n,verifiedAtIso:new Date(`${e}T23:59:59.999Z`).toISOString()})),"+NAMES.fValidateDayRunsAndFindRank+"({dailyId:e,results:r}).rankedEntries.find(e=>e.competitorId===`local-player`)?.rank??null}",
  "async dailyRank(e,t,n,r){if("+NAMES.fValidateDate+"(e),!Number.isSafeInteger(t)||t<1)return null;let g=new "+NAMES.cServerCommunicationManager+"({apiBase:`https://swervle.com/api/v1`});const standing=await g.fetchStanding(e,t,undefined,r).catch(()=>null);console.log(standing?.rank??null);return standing?.rank??null;}"
)

// 4. Add background daily rank fetch.
mainPatcher.insertBefore(
  "04AsyncRankFetchFunc",
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
  "05makeRankUseAsyncFetch",
  "</li>`;return`",
  "</li>`;try{fetchDailyRankInBackground(`2026-09-06`, e.entries[0].durationTicks);}catch(e){console.log(`[Swervle TAS Tool]: ` + e)}return`"
)

// == 6-? TAS ==

// 6. Add TasPlayback class to manage tas playback.
mainPatcher.insertBefore(
  "06tasPlayback",
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
  "07addMainGettersAndMethods",
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
  "08useTas",
  "let r=n.sample()",
  "let r=this.__tas?this.__tas.next(e-211):n.sample()"
)
/*
let r = this.__tas ? this.__tas.next(e-211) : n.sample()
*/

// 9. Capture last actions.
mainPatcher.replaceOnce(
  "09.1getActions",
  "d="+NAMES.fActionBools+"({boost:(r.held.boost===!0||s?.boost===!0)&&"+NAMES.fBoostMeter+"(this."+NAMES.pBoostMeter+")>0,handbrake:r.held.handbrake===!0||s?.handbrake===!0,recoveryRequested:o,reverse:r.held.reverse===!0||s?.reverse===!0,steerLeft:c||u===`left`,steerRight:l||u===`right`,throttle:r.held.throttle===!0||s?.throttle===!0})",
  "actions={boost:(r.held.boost===!0||s?.boost===!0)&&"+NAMES.fBoostMeter+"(this."+NAMES.pBoostMeter+")>0,handbrake:r.held.handbrake===!0||s?.handbrake===!0,recoveryRequested:o,reverse:r.held.reverse===!0||s?.reverse===!0,steerLeft:c||u===`left`,steerRight:l||u===`right`,throttle:r.held.throttle===!0||s?.throttle===!0},d="+NAMES.fActionBools+"(actions)"
)
mainPatcher.insertAfter(
  "09.2setActions",
  "f=t.model.raceState;",
  "this.__lastActions={tick:e,source:this.__tas?`tas`:`live`,...actions};"
)

// 10. Expose main game as __SWERVLE_GAME__
mainPatcher.insertAfter(
  "10exposeMain",
  "let t=new "+NAMES.cMainGame+"({mount:e});",
  "window.__SWERVLE_GAME__=t;"
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
