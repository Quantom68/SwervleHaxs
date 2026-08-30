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
// main bundle: index-g58yFkXG.js
// replay chunk: replay-BymKJeTp.js
// Updated: 2026-08-29
// v - variable
// f - function
// c - class
// p - property
// m - method
const NAMES = {
  mRunPoster: "#f",
  /* ln. 5419:
  async #f(e, t) {
    try {
      let n = await this.#p(`POST`, e, {
        body: t,
        csrf: !0,
        timeoutMs: this.#i
      });
      return Object.freeze({
        body: await _l(n),
        httpStatus: n.status,
        kind: `response`
      })
    } catch (e) {
      return Object.freeze({
        classification: vl(e) ? `server-timeout` : `server-unreachable`,
        kind: `transport-failure`,
        message: e instanceof Error && e.message.length > 0 ? e.message : null
      })
    }
  }*/
  mServerAccesser: "#p",
  /* ln. 5439
  #p(e, t, n = {}) {
    let r = {
        accept: `application/json`
      },
      i = {
        credentials: `same-origin`,
        headers: r,
        method: e
      };
    if (n.body !== void 0 && (r[`content-type`] = `application/json`, i.body = JSON.stringify(n.body)), n.csrf === !0) {
      let e = kl(this.#n());
      e !== null && (r[`x-csrf-token`] = e)
    }
    return this.#m(wl(this.#t, `${this.#e}${t}`, i, n.timeoutMs ?? this.#r))
  }*/
  pTimeoutMs: "#i",
  /* ln. 5194, 5201
  this.#i = e.submissionTimeoutMs ?? Gc
  */
  fResponseChecker: "El",
  /* ln. 5754
  async function El(e) {
    try {
      let t = await e.json();
      return Ol(t) ? t : null
    } catch {
      return null
    }
  }*/
  fServerAccessErrorClassifier: "Dl",
  /* ln. 5763
  function Dl(e) {
    return Ol(e) && e.name === `AbortError`
  }*/
  mCheckIfLocalBaseOnHostname: "#vr",
  /* ln. 14421
  #gr() {
    return cl(globalThis.location.hostname)
  }*/
  fCheckIfLocal: "cl",
  /* ln. 5483
  function cl(e, t = Ml()) {
    return sl(t) || rl(e)
  }*/
  fValidateDate: "xs",
  /* ln. 4515
  function xs(e) {
    let t = Date.parse(`${e}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/u.test(e) || Number.isNaN(t) || new Date(t).toISOString().slice(0, 10) !== e) throw TypeError(`Daily ID must be a UTC calendar date.`)
  }*/
  fValidateDayRunsAndFindRank: "Xa",
  /* ln. 3227
  function Xa(e) {
    return to(e.dailyId), Ya({
      contestId: e.dailyId,
      contestKind: `daily`,
      results: e.results,
      ...e.realRacerIds === void 0 ? {} : {
        realRacerIds: e.realRacerIds
      }
    })
  }*/
  cServerCommunicationManager: "nl",
  /* ln. 5189
  var nl = class {
    #e;
    #t;
    #n;
    #r;
    #i;
    #a = null;
    #o = `normal`;
    constructor(e = {}) {
      this.#e = e.apiBase ?? jl();
      let t = e.fetchImpl ?? (typeof fetch == `function` ? fetch.bind(globalThis) : null);
      if (t === null) throw TypeError(`A fetch implementation is required for server mode.`);
      this.#t = t, this.#n = e.cookieSource ?? Al, this.#r = e.requestTimeoutMs ?? $c, this.#i = e.submissionTimeoutMs ?? el
    }*/
  pDailyManagerObject: "#n",
  /* ln. 13314, 13528
  this.#n = e.service ?? new hs
  */
  cMainGame: "Zv",
  /* ln. 13311
  It's the one with all the methods and manages everything.
  */
  mCheckIfDisposed: "#Lr",
  /* ln. 14815
  #Fr() {
    return this.#st === `disposed`
  }*/
  pRunsMap: "#R", // needs better documentaion
  /* ln. 13354, 17045
  return this.#R.set(e, n), n
  */
  mRepaintCalendarAccountRows: "#jo", // needs better documentaion
  /* ln. 17237
  #wo(e) {
    let t = this.#we;
    for (let n of e) this.#R.delete(n), t !== null && P_(t.element, n, this.#So(n))
  }*/
  fRankTimes: "#V"
  /* ln. 13357, 17248
  for (let [n, r] of Xp(e)) t.add(n), this.#V.set(n, r);
  */
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

// ---- main bundle ----
let mainSrc = rewriteRelativeChunkRefs("main bundle", readFileSync(mainIn, "utf8"));

const mainPatcher = makePatcher(
  "main bundle",
  () => mainSrc,
  (s) => (mainSrc = s)
);

// 0. Replace the title text to confirm that the extension loaded
//    successfully.
mainPatcher.replaceOnce(
  "replaceTitleText",
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
  "disableRunSubmission",
  "async"+NAMES.mRunPoster+"(e,t){try{let n=await this."+NAMES.mServerAccesser+"(`POST`,e,{body:t,csrf:!0,timeoutMs:this."+NAMES.pTimeoutMs+"});return Object.freeze({body:await "+NAMES.fResponseChecker+"(n),httpStatus:n.status,kind:`response`})}catch(e){return Object.freeze({classification:"+NAMES.fServerAccessErrorClassifier+"(e)?`server-timeout`:`server-unreachable`,kind:`transport-failure`,message:e instanceof Error&&e.message.length>0?e.message:null})}}",
  "async"+NAMES.mRunPoster+"(e,t){return Object.freeze({classification:`server-unreachable`,kind:`transport-failure`,message:`disabled-by-tas`})}"
);

// 2. Forces local verification instead of submiting to servers.
//    Suppose to prevent "OFFICIAL VERIFIER UNREACHABLE" screen
//    from appearing and shows the time.
mainPatcher.replaceOnce(
  "forceLocalVerifier",
  NAMES.mCheckIfLocalBaseOnHostname+"(){return "+NAMES.fCheckIfLocal+"(globalThis.location.hostname)}",
  NAMES.mCheckIfLocalBaseOnHostname+"(){return!1}"
);

// 3. Force dailyRank() to call fetchStanding() to get rank.
mainPatcher.replaceOnce(
  "forceFetchStanding",
  "dailyRank(e,t,n){if("+NAMES.fValidateDate+"(e),!Number.isSafeInteger(t)||t<1)return null;let r=[];return r.push(Object.freeze({competitorId:`local-player`,contestId:e,contestKind:`daily`,durationTicks:t,participantKind:`human`,publicDisplayName:`YOU`,publicRunId:n,verifiedAtIso:new Date(`${e}T23:59:59.999Z`).toISOString()})),"+NAMES.fValidateDayRunsAndFindRank+"({dailyId:e,results:r}).rankedEntries.find(e=>e.competitorId===`local-player`)?.rank??null}",
  "async dailyRank(e,t,n,r){if("+NAMES.fValidateDate+"(e),!Number.isSafeInteger(t)||t<1)return null;let g=new "+NAMES.cServerCommunicationManager+"({apiBase:`https://swervle.com/api/v1`});const standing=await g.fetchStanding(e,t,undefined,r).catch(()=>null);console.log(standing?.rank??null);return standing?.rank??null;}"
)

// 4. Add a gateway field and a rank cache/in-flight tracker
//    to the main game class.
mainPatcher.insertAfter(
  "addFieldsToMainClass",
  NAMES.cMainGame+"=class{",
  "#dailyRankGateway=null;#dailyRankPending=new Map();"
)
/*
#dailyRankGateway = null;
#dailyRankPending = new Map();
*/

// 5. Add background daily rank fetch.
mainPatcher.insertBefore(
  "AsyncRankFetchFunc",
  "create(){",
  "async #fetchDailyRankInBackground(e,t,n,r){console.log(`asdf`);if(this.#dailyRankPending.has(e))return;if(!Number.isSafeInteger(t)||t<1)return;let p=(async()=>{this.#dailyRankGateway??=new "+NAMES.cServerCommunicationManager+"({apiBase:`https://swervle.com/api/v1`});let s=await this.#dailyRankGateway.fetchStanding(e,t,undefined,r).catch(()=>null);if(s?.rank==null||this."+NAMES.mCheckIfDisposed+"())return;this."+NAMES.pRunsMap+".delete(e);this."+NAMES.mRepaintCalendarAccountRows+"([e]);})();this.#dailyRankPending.set(e,p);try{await p}finally{this.#dailyRankPending.delete(e)}}"
)
/*
async #fetchDailyRankInBackground(dailyId, durationTicks, publicRunId, displayTimeMs) {
  if (this.#dailyRankPending.has(dailyId)) return;
  if (!Number.isSafeInteger(durationTicks) || durationTicks < 1) return;

  let pending = (async () => {
    this.#dailyRankGateway ??= new qc({ apiBase: `https://swervle.com/api/v1` });
    let standing = await this.#dailyRankGateway
      .fetchStanding(dailyId, durationTicks, undefined, displayTimeMs)
      .catch(() => null);
    if (standing?.rank == null || this.#Fr()) return;

    // Same pattern #po uses: drop the cached thumbnail result for this day
    // so the next #mo() call recomputes with the real rank, then repaint
    // any currently-open calendar/account rows for it.
    this.#R.delete(dailyId);
    this.#Co([dailyId]);
  })();

  this.#dailyRankPending.set(dailyId, pending);
  try {
    await pending
  } finally {
    this.#dailyRankPending.delete(dailyId)
  }
}
*/

// 6. Set rank to null then call
//    fetchDailyRankInBackground()
mainPatcher.replaceOnce(
  "makeRankUseAsyncFetch",
  "let c=o===null||this."+NAMES.mCheckIfLocalBaseOnHostname+"()?null:this."+NAMES.pDailyManagerObject+".dailyRank(e,o.durationTicks,o.publicRunId),l=this."+NAMES.fRankTimes+".get(e);",
  "let c=null;console.log(o);console.log(this."+NAMES.mCheckIfLocalBaseOnHostname+"());if(o!==null&&!this."+NAMES.mCheckIfLocalBaseOnHostname+"()){console.log(`dfgh`);this.#fetchDailyRankInBackground(e,o.durationTicks,o.publicRunId,o.displayTimeMs);console.log(`sdfg`);}let l=this."+NAMES.fRankTimes+".get(e);"
)

// temp
mainPatcher.replaceOnce(
  "temp",
  "svg:a}}catch{return null}",
  "svg:a}}catch(e){console.log(e);return null}"
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
