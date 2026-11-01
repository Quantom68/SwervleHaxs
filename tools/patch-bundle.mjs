#!/usr/bin/env node
// Swervle Haxs bundle patcher (CLI around tools/patch-logic.mjs).
//
//   node tools/patch-bundle.mjs
//     LIVE: fetches swervle.com, writes patched-bundle.js (+ patched-terrainview.js
//     if the recorder lives in a separate chunk) and state.json into the repo
//     root. This is what the GitHub Action runs.
//
//   node tools/patch-bundle.mjs --local <main.js> [--tv <chunk.js>]
//                               [--origin <url>] [--assets-path /assets/] [--out local]
//     LOCAL FILES (e.g. an offline build): patches the given file(s) and writes
//     <out>/patched-bundle.js, <out>/patched-terrainview.js and <out>/state.json.
//     The extension loads these from its own package (see background.js).
//     --origin must be the origin the offline build is SERVED from
//     (e.g. http://localhost:5500): chunk imports are rewritten to absolute URLs
//     on it, because the patched file is served from chrome-extension://.
//
//   node tools/patch-bundle.mjs --install <main.js> [--tv <chunk.js>]
//     IN PLACE: patches the file and writes it back over itself (original saved
//     as <name>.orig). No extension redirect and no URL rewriting needed —
//     just load the page. Run again after restoring .orig if you update the build.
//
// Exit code is non-zero if a patched file fails the ESM parse/link self-check
// (so CI never publishes a corrupted file). Individual stale anchors only warn.

import { readFileSync, writeFileSync, existsSync, copyFileSync, mkdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, basename, resolve } from "node:path";
import {
  rewriteRelativeChunkRefs,
  deriveIdentifiers,
  patchMainBundle,
  patchRecorder,
  discoverAndFetchMainBundle,
  fetchReplayChunk,
  findReplayChunkPath,
  RECORDER_MARKER,
} from "./patch-logic.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(argv) {
  const o = { mode: "live", origin: "https://swervle.com", assetsPath: "/assets/", out: "local", tv: null, main: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i] ?? (console.error(`Missing value for ${a}`), process.exit(1));
    if (a === "--local") (o.mode = "local"), (o.main = next());
    else if (a === "--install") (o.mode = "install"), (o.main = next());
    else if (a === "--tv") o.tv = next();
    else if (a === "--origin") o.origin = next();
    else if (a === "--assets-path") o.assetsPath = next();
    else if (a === "--out") o.out = next();
    else if (a === "-h" || a === "--help") (console.log(readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").slice(1, 26).join("\n")), process.exit(0));
    else if (!o.main && !a.startsWith("--")) (o.mode = "local"), (o.main = a); // legacy: <main.js> [tv.js]
    else if (o.main && !o.tv && !a.startsWith("--")) o.tv = a;
    else (console.error(`Unknown argument ${a}`), process.exit(1));
  }
  return o;
}

// Parses AND links the output with Node's ESM loader (plain `node --check`
// misses private-field errors). A correct file always ends in one benign
// error afterwards: its absolute http(s):// imports can't be loaded by Node.
async function verifyEsmIntegrity(label, absPath) {
  try {
    await import(pathToFileURL(absPath).href + `?verify=${Date.now()}`);
    console.log(`✓ [${label}] parsed and linked cleanly.`);
    return true;
  } catch (err) {
    const benign =
      err instanceof Error &&
      !(err instanceof SyntaxError) &&
      /Received protocol ['"]https?:['"]|Only URLs with a scheme|Cannot find module|Cannot find package|ENOTFOUND|fetch failed|ERR_MODULE_NOT_FOUND/i.test(err.message);
    if (benign) return console.log(`✓ [${label}] parsed and linked cleanly (only failed on an unresolvable import).`), true;
    console.error(`✗ [${label}] FAILED to parse/link: ${err.constructor.name}: ${err.message}`);
    return false;
  }
}

async function main() {
  const opt = parseArgs(process.argv.slice(2));
  const results = [];
  const live = opt.mode === "live";
  const install = opt.mode === "install";
  // Absolute-URL rewriting is only needed when the file is served from somewhere else.
  const rewrite = (label, src) => (install ? src : rewriteRelativeChunkRefs(opt.origin, opt.assetsPath, label, src));

  let mainFilename, mainRaw;
  if (live) ({ mainFilename, mainRawSrc: mainRaw } = await discoverAndFetchMainBundle(opt.origin));
  else {
    // --install re-patches from the saved original, so running it twice is safe.
    const src = install && existsSync(opt.main + ".orig") ? opt.main + ".orig" : opt.main;
    (mainRaw = readFileSync(src, "utf8")), (mainFilename = basename(opt.main));
  }
  console.log(`${live ? "Discovered live" : "Using local"} main bundle: ${mainFilename}`);

  const names = deriveIdentifiers(mainRaw);
  console.log("Derived identifiers:", names);
  let mainSrc = patchMainBundle(rewrite("main bundle", mainRaw), names, results);

  // Where does the run recorder live?
  const recorderInMain = RECORDER_MARKER.test(mainSrc);
  let tvFilename = null;
  let tvSrc = null;
  if (recorderInMain) {
    mainSrc = patchRecorder(mainSrc, "main bundle", results);
  } else {
    let tvRaw;
    if (opt.tv) (tvRaw = readFileSync(install && existsSync(opt.tv + ".orig") ? opt.tv + ".orig" : opt.tv, "utf8")), (tvFilename = basename(opt.tv));
    else if (live) {
      const path = findReplayChunkPath(mainRaw);
      if (!path) throw new Error("Recorder isn't in the main bundle and the replay chunk's import path couldn't be found.");
      ({ tvFilename, tvRawSrc: tvRaw } = await fetchReplayChunk(opt.origin, path));
    } else throw new Error("The run recorder isn't in the main bundle: pass the replay chunk with --tv <file>.");
    tvSrc = patchRecorder(rewrite("replay chunk", tvRaw), "replay chunk", results);
  }

  // ---- write ----
  let outMain, outTv;
  if (install) {
    for (const [file, src] of [[opt.main, mainSrc], [opt.tv, tvSrc]]) {
      if (!file || src == null) continue;
      if (!existsSync(file + ".orig")) copyFileSync(file, file + ".orig");
      writeFileSync(file, src, "utf8");
      console.log(`Patched ${file} in place (original: ${file}.orig).`);
    }
    outMain = opt.main;
    outTv = opt.tv;
  } else {
    const dir = live ? ROOT : resolve(ROOT, opt.out);
    mkdirSync(dir, { recursive: true });
    outMain = join(dir, "patched-bundle.js");
    writeFileSync(outMain, mainSrc, "utf8");
    console.log(`Patched main bundle -> ${outMain} (${mainSrc.length} bytes)`);
    if (tvSrc != null) {
      outTv = join(dir, "patched-terrainview.js");
      writeFileSync(outTv, tvSrc, "utf8");
      console.log(`Patched replay chunk -> ${outTv} (${tvSrc.length} bytes)`);
    }
  }

  const okMain = await verifyEsmIntegrity("main bundle", resolve(outMain));
  const okTv = outTv && tvSrc != null ? await verifyEsmIntegrity("replay chunk", resolve(outTv)) : true;

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} patches applied.`);
  if (failed.length) {
    console.log("Needs re-deriving (anchor missing or ambiguous):");
    for (const r of failed) console.log(`  - [${r.file}] ${r.name}`);
  }

  // state.json — what the extension reads to know which filenames to redirect.
  if (!install) {
    const statePath = join(live ? ROOT : resolve(ROOT, opt.out), "state.json");
    const next = {
      source: live ? "live" : "local",
      mainFilename,
      tvFilename,
      origin: live ? undefined : opt.origin,
      assetsPath: live ? undefined : opt.assetsPath,
      patchCount: results.length,
      failedPatches: failed.map((r) => `${r.file}/${r.name}`),
    };
    let prior = null;
    if (existsSync(statePath)) {
      try {
        const { patchedAt: _ignored, ...rest } = JSON.parse(readFileSync(statePath, "utf8"));
        prior = rest;
      } catch {}
    }
    if (prior && JSON.stringify(prior) === JSON.stringify(next)) console.log("state.json unchanged.");
    else writeFileSync(statePath, JSON.stringify({ ...next, patchedAt: new Date().toISOString() }, null, 2) + "\n", "utf8"), console.log(`state.json written: ${statePath}`);
  }

  if (!okMain || !okTv) {
    console.error("\n⚠ A patched file failed ESM verification — treat this run as failed (CI will not publish it).");
    process.exitCode = 1;
  }
}

main().catch((e) => (console.error(e), process.exit(1)));
