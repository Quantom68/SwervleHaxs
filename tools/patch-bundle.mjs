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
// main bundle: index-vFd6W4pL.js
// replay chunk: replay-DRoePr8Y.js
// Updated: 2026-08-27
// v - variable
// f - function
// p - property
// m - method
const NAMES = {
  mRunPoster: "#f",
  mServerAccesser: "#p",
  pTimeoutMs: "#i",
  fResponseChecker: "_l",
  fServerAccessErrorClassifier: "vl",
  mCheckIfLocalBaseOnHostname: "#gr",
  fCheckIfLocal: "$c"
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
