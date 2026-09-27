// Portable core of the swervle.com bundle patcher — every regex-based
// identifier derivation and patch insertion/replacement, plus the live-
// bundle discovery/fetch step, with ZERO Node-specific APIs (no fs, no
// path, no process). Both `tools/patch-bundle.mjs` (the Node CLI — fetches,
// writes patched-bundle.js/patched-terrainview.js to disk for inspection,
// runs the ESM-integrity self-check) and `background.js` (the extension's own
// service worker — fetches, builds `data:` URLs, registers them as
// declarativeNetRequest dynamic rules) import this file, so the actual
// derivation/patch logic exists in exactly one place. See background.js's
// own top comment for why the extension re-patches itself at all now,
// rather than only ever running this from the CLI.
//
// See tools/patch-bundle.mjs's original top-of-file comment for the full
// rationale behind the wildcarded-anchor approach — that reasoning is
// unchanged, just relocated here since it now applies to two callers.

// Rewrites every chunk-relative *import specifier* in `src`
// (`from"./Name-hash.js"`, and `import("./Name-hash.js")`) to an absolute
// `origin`-based URL. Necessary because both callers redirect requests for
// each patched file's own URL elsewhere (a chrome-extension:// resource for
// the CLI's file-based delivery, a `data:` URL for the extension's own
// runtime delivery) — either way, the browser resolves the file's relative
// imports against ITS OWN URL, not swervle.com's, once redirected. Without
// this, sibling chunks fail to resolve and the whole module graph breaks.
export function rewriteRelativeChunkRefs(origin, name, src, log = console) {
  const before = src;
  const out = src.replace(/([\"'`])\.\/([A-Za-z0-9_.]+-[A-Za-z0-9_-]{6,}\.(?:js|css))\1/g, `$1${origin}/assets/$2$1`);
  const count =
    before === out ? 0 : (out.match(new RegExp(`${origin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/assets/`, "g")) || []).length;
  log.log(`${name}: rewrote ${count} relative chunk references to absolute ${origin} URLs.`);
  return out;
}

// Each patch is independent and best-effort: a single stale anchor (the
// site changed the one bit of code that patch targets) logs a clear warning
// and skips *only* that insertion/replacement — every other patch, and the
// output itself, still get produced. `results` accumulates {file, name, ok}
// for the caller to summarize/report however fits its own context (console
// summary for the CLI, chrome.storage + badge for the extension).
export function makePatcher(fileLabel, getSrc, setSrc, results, log = console) {
  function run(name, anchorRe, apply) {
    const src = getSrc();
    const re = new RegExp(anchorRe.source, anchorRe.flags.includes("g") ? anchorRe.flags : anchorRe.flags + "g");
    const matches = [...src.matchAll(re)];
    if (matches.length !== 1) {
      log.warn(
        `⚠ [${fileLabel}] patch "${name}" anchor matched ${matches.length} times (expected exactly 1) — ` +
          `skipping. The site's bundle has likely changed structurally; this anchor needs regenerating.\n` +
          `  Pattern: ${anchorRe.source}`
      );
      results.push({ file: fileLabel, name, ok: false });
      return;
    }
    const m = matches[0];
    const idx = m.index;
    const matchedText = m[0];
    const replacement = apply(m);
    setSrc(src.slice(0, idx) + replacement + src.slice(idx + matchedText.length));
    results.push({ file: fileLabel, name, ok: true });
  }
  return {
    insertAfter(name, anchorRe, insertionFn) {
      run(name, anchorRe, (m) => m[0] + insertionFn(m));
    },
    insertBefore(name, anchorRe, insertionFn) {
      run(name, anchorRe, (m) => insertionFn(m) + m[0]);
    },
    replaceOnce(name, anchorRe, replaceFn) {
      run(name, anchorRe, replaceFn);
    },
    skip(name, reason) {
      log.warn(`⚠ [${fileLabel}] patch "${name}" skipped — ${reason}`);
      results.push({ file: fileLabel, name, ok: false });
    }
  };
}

// Fetches swervle.com's current HTML, finds its main module script tag, and
// fetches that bundle too — the one piece of "discovery" both callers need
// before any derivation/patching can start. `fetch` is available in both
// Node 18+ (the CLI) and a browser service worker (the extension), so this
// needs no environment-specific branching.
export async function discoverAndFetchMainBundle(origin) {
  const html = await fetch(origin).then((r) => r.text());
  const scriptMatch = html.match(/<script[^>]*type="module"[^>]*src="([^"]*\/assets\/[^"]+\.js)"/);
  if (!scriptMatch) throw new Error("Could not find main module script tag in swervle.com's HTML.");
  const mainUrl = new URL(scriptMatch[1], origin).href;
  const mainFilename = mainUrl.split("/").pop();
  const mainRawSrc = await fetch(mainUrl).then((r) => r.text());
  return { mainUrl, mainFilename, mainRawSrc };
}

// The raceTelemetry patch anchors on the replay class's `get finished()`.
const RV_CLASS_MARKER = /get finished\(\)\{return this\.#s===`finished`\|\|this\.#s===`exhausted`\}/;

// The chunk the main bundle imports RV from is sometimes just a re-export
// hub, with the class itself defined in one of ITS imports — so if the
// marker isn't in the first chunk, look one level down for the real one.
export async function fetchTerrainViewChunk(origin, rvChunkPath) {
  const fetchChunk = async (path, base) => {
    const url = new URL(path, base).href;
    return { tvUrl: url, tvFilename: url.split("/").pop(), tvRawSrc: await fetch(url).then((r) => r.text()) };
  };
  const first = await fetchChunk(rvChunkPath, origin + "/assets/x");
  if (RV_CLASS_MARKER.test(first.tvRawSrc)) return first;

  const deps = [...new Set([...first.tvRawSrc.matchAll(/from"(\.\/[^"]+\.js)"/g)].map((m) => m[1]))];
  for (const dep of deps) {
    const candidate = await fetchChunk(dep, first.tvUrl);
    if (RV_CLASS_MARKER.test(candidate.tvRawSrc)) return candidate;
  }
  return first; // nothing matched — the patch will report itself as skipped
}

const REPLAY_CLASS_MARKER = /Simulation clock elapsed time does not match its tick./;

export async function fetchReplayChunk(origin, replayChunkPath) {
  const fetchChunk = async (path, base) => {
    const url = new URL(path, base).href;
    return { replayUrl: url, replayFilename: url.split("/").pop(), replayRawSrc: await fetch(url).then((r) => r.text()) };
  };
  const first = await fetchChunk(replayChunkPath, origin + "/assets/x");
  if (REPLAY_CLASS_MARKER.test(first.replayRawSrc)) return first;

  const deps = [...new Set([...first.replayRawSrc.matchAll(/from"(\.\/[^"]+\.js)"/g)].map((m) => m[1]))];
  for (const dep of deps) {
    const candidate = await fetchChunk(dep, first.replayUrl);
    if (REPLAY_CLASS_MARKER.test(candidate.replayRawSrc)) return candidate;
  }
  return first; // nothing matched — the patch will report itself as skipped
}

// Auto-derives every minified identifier this patch set needs from stable,
// non-minified (human-authored, multi-word) method/property names the
// minifier leaves alone — see tools/patch-bundle.mjs's top comment for the
// full rationale. `mainSrc` is the already-rewritten (absolute chunk refs)
// source; `mainRawSrc` is the original fetched text, needed for the two
// derivations anchored on relative import paths (which rewriteRelativeChunkRefs
// has already replaced by the time mainSrc exists).
export function deriveIdentifiers(mainSrc, mainRawSrc) {
  const names = {};

  // Swervle Utils

  {
    const m = mainSrc.match(/new ([A-Za-z0-9_$]+)\(\{modifiers:this\.(#[A-Za-z0-9_$]+),presentationRaycastEmulation:/);
    names.RV = m?.[1] ?? null;
    names.physicsModifiers = m?.[2] ?? null;
  }
  {
    const m = mainSrc.match(
      /new ([A-Za-z0-9_$]+)\(\{appearance:([A-Za-z0-9_$]+),assetInstance:await this\.(#[A-Za-z0-9_$]+)\.instantiate\(([A-Za-z0-9_$]+)\),definition:([A-Za-z0-9_$]+),entityId:[^,]+,materialColorOverrides:([A-Za-z0-9_$]+),materialRegistrar:this\.(#[A-Za-z0-9_$]+)\.materialRegistrar\}\)/
    );
    names.VD = m?.[1] ?? null;
    names.ghostAppearance = m?.[2] ?? null;
    names.assetFactory = m?.[3] ?? null;
    names.carContentId = m?.[4] ?? null;
    names.carDefinition = m?.[5] ?? null;
    names.ghostColorOverrides = m?.[6] ?? null;
    names.playerSceneManager = m?.[7] ?? null;
  }
  {
    const m = mainSrc.match(
      /=([A-Za-z0-9_$]+)\(\{displayName:i\.opponent\.displayName,relationship:`friend`,surface:`gameplay`\}\),[A-Za-z0-9_$]+=new ([A-Za-z0-9_$]+)\(\{carView:/
    );
    names.buildNameplate = m?.[1] ?? null;
    names.GL = m?.[2] ?? null;
  }
  {
    const m = mainSrc.match(
      /get active\(\)\{return this\.(#[A-Za-z0-9_$]+)\}start\(\)\{this\.(#[A-Za-z0-9_$]+)\|\|this\.\1\|\|\(this\.clear\(\),this\.\1=!0\)\}/
    );
    names.keyboardActive = m?.[1] ?? null;
    names.keyboardDisposed = m?.[2] ?? null;
    const m2 = mainSrc.match(
      /sample\(e=!0\)\{let t=\{edges:this\.(#[A-Za-z0-9_$]+)\.map\(e=>\(\{\.\.\.e\}\)\),held:Object\.fromEntries\(this\.#[A-Za-z0-9_$]+\)\}/
    );
    names.keyboardEdges = m2?.[1] ?? null;
  }
  {
    const m = mainSrc.match(
      /let ([A-Za-z0-9_$]+)=this\.(#[A-Za-z0-9_$]+);[A-Za-z0-9_$]+\(`scene-precompile`,\(\)=>\{[A-Za-z0-9_$]+\.precompile\(\1\.camera\)\}\)/
    );
    names.cameraController = m?.[2] ?? null;
  }
  {
    const m = mainSrc.match(/gateCount:this\.(#[A-Za-z0-9_$]+)\?\.track\.gates\.length/);
    names.raceManifest = m?.[1] ?? null;
  }
  {
    const m = mainRawSrc.match(/createGhostRaceLivery\([A-Za-z0-9_$]+,[A-Za-z0-9_$]+\)\{[\s\S]{0,200}?import\(`(\.\/[^`]+)`\)/);
    names.liveryChunkPath = m?.[1] ?? null;
  }
  {
    if (names.RV) {
      // Match the LOCAL binding (`x as NAME`, or a bare NAME) — not merely any
      // mention of it, which also hits `NAME as other` in an unrelated import.
      const local = names.RV.replace(/\$/g, "\\$");
      const re = new RegExp(`import\\{[^}]*(?:[{,]|\\bas\\s+)\\s*${local}(?=\\s*[,}])[^}]*\\}from"(\\./[^"]+)"`);
      const m = mainRawSrc.match(re);
      names.rvChunkPath = m?.[1] ?? null;
    }
  }

  // Swervle Haxs

  {
    const m = mainSrc.match(/async#([A-Za-z0-9_$]+)\(e,t\)\{try\{let n=await this.#([A-Za-z0-9_$]+)\(`POST`,e,\{body:t,csrf:!0,timeoutMs:this.#([A-Za-z0-9_$]+)\}\);return Object.freeze\(\{body:await ([A-Za-z0-9_$]+)\(n\),httpStatus:n.status,kind:`response`\}\)\}catch\(e\)\{return Object.freeze\(\{classification:([A-Za-z0-9_$]+)\(e\)\?`server-timeout`:`server-unreachable`,kind:`transport-failure`,message:e instanceof Error&&e.message.length>0\?e.message:null/);
    names.mRunPoster = m?.[1] ?? null;
    names.mServerAccesser = m?.[2] ?? null;
    names.pTimeoutMs = m?.[3] ?? null;
    names.fResponseChecker = m?.[4] ?? null;
    names.fServerAccessErrorClassifier = m?.[5] ?? null;
  }
  {
    const m = mainRawSrc.match(/if\(this.#([A-Za-z0-9_$]+).requiresServerTruth\(\)\)\{if\(this.#([A-Za-z0-9_$]+)/);
    names.pRunVerifierObject = m?.[1] ?? null;
  }
  {
    const m = mainRawSrc.match(/_.restore\(([A-Za-z0-9_$]+).simulation.captureSnapshot\(\).clock\),this.#([A-Za-z0-9_$]+)=new ([A-Za-z0-9_$]+)\(\{/);
    names.pTimeManagerObject = m?.[2] ?? null;
  }
  {
    const m = mainRawSrc.match(/constructor\(e\)\{this.#([A-Za-z0-9_$]+)=e.callbacks,this.#([A-Za-z0-9_$]+)=e.frameDriver,this.clock=e.clock\?\?new ([A-Za-z0-9_$]+),this.([A-Za-z0-9_$]+)=e.([A-Za-z0-9_$]+)\?\?new ([A-Za-z0-9_$]+)\}/);
    names.pTimescale = m?.[4] ?? null;
  }
  {
    const m = mainRawSrc.match(/#([A-Za-z0-9_$]+)=new ([A-Za-z0-9_$]+)\(([A-Za-z0-9_$]+).maximumRaceTicks\);/);
    names.pRunRecorderObject = m?.[1] ?? null;
  }
  {
    const m = mainRawSrc.match(/this.#([A-Za-z0-9_$]+).rivalGap=new ([A-Za-z0-9_$]+)\(([A-Za-z0-9_$]+).track.routeLine\)/);
    names.pRivalGhost = m?.[1] ?? null;
    names.cRivalGapGetter = m?.[2] ?? null;
  }
  {
    const m = mainRawSrc.match(/if\(this.#([A-Za-z0-9_$]+)\?.model.raceState.phase!==`invalid`\)\{/);
    names.pSimulationManager = m?.[1] ?? null;
  }
  {
    const m = mainRawSrc.match(/gpuFrameMs:this.#([A-Za-z0-9_$]+).diagnostics\(\).lastGpuFrameMs,/);
    names.pQualityMonitor = m?.[1] ?? null;
  }
  {
    const m = mainRawSrc.match(/this.#([A-Za-z0-9_$]+)=([A-Za-z0-9_$]+),([A-Za-z0-9_$]+)\(\);let ([A-Za-z0-9_$]+)=([A-Za-z0-9_$]+).diagnostics\(\);/);
    names.pRenderer = m?.[1] ?? null;
  }
  {
    const m = mainRawSrc.match(/this.#([A-Za-z0-9_$]+)=([A-Za-z0-9_$]+),this.#([A-Za-z0-9_$]+).prefetchDailyBoard\(\)/);
    names.pTrack = m?.[1] ?? null;
  }
  {
    const m = mainRawSrc.match(/publicRunId:t.publicRunId,states:([A-Za-z0-9_$]+)\(t.statesBase64,\{expectedLength:t.durationTicks,maximumLength:([A-Za-z0-9_$]+)\(t.rulesetVersion\).maximumRaceTicks\}\);/);
    names.fValidStates = m?.[1] ?? null;
    names.fGetRuleset = m?.[2] ?? null;
  }
  {
    const m = mainRawSrc.match(/let ([A-Za-z0-9_$]+)=new([A-Za-z0-9_$]+)\(\{modifiers:this.([A-Za-z0-9_$]+),presentationRaycastEmulation:([A-Za-z0-9_$]+).opponent.replayMode===`camera-probe-v1`,states:([A-Za-z0-9_$]+).opponent.states,track:([A-Za-z0-9_$]+).track\}\),/);
    names.cRivalGhostSimulator = m?.[2] ?? null;
    names.pRivalGhostModifiers = m?.[3] ?? null;
  }
  {
    const m = mainRawSrc.match(/([A-Za-z0-9_$]+)=new ([A-Za-z0-9_$]+)({appearance:([A-Za-z0-9_$]+),assetInstance:\(await this.#([A-Za-z0-9_$]+)\.instantiate\(([A-Za-z0-9_$]+)\)),definition:([A-Za-z0-9_$]+),entityId:n.car.entityId,materialColorOverrides:([A-Za-z0-9_$]+),materialRegistrar:this.#([A-Za-z0-9_$]+).materialRegistrar\}\);/);
    names.cGhostCarView = m?.[2] ?? null;
    names.vGCVApperance = m?.[3] ?? null;
    names.vGCVAssetInstance = m?.[4] ?? null;
    names.vGCVDefinition = m?.[5] ?? null;
    names.vGCVMaterialColorOverrides = m?.[6] ?? null;
    names.pTerrainViewManagerObject = m?.[7] ?? null;
  }
  {
    const m = mainRawSrc.match(/function([A-Za-z0-9_$]+)\(e\)\{return e.surface===`gameplay`&&e.isLocalPlayerCar===!0\?null:e.relationship===`self-ghost`\?`You`:([A-Za-z0-9_$]+)\(e.displayName\)\};/);
    names.fGetGhostDisplayName = m?.[1] ?? null;
  }
  {
    const m = mainRawSrc.match(/o=new([A-Za-z0-9_$]+)\(\{carView:r,initialSnapshot:n.car,nameplate:a===null\?null:\{label:a\},parent:this.#([A-Za-z0-9_$]+).viewParent\}\);/);
    names.cRivalGhostRenderer = m?.[1] ?? null;
  }
  {
    const m = mainRawSrc.match(/function ([A-Za-z0-9_$]+)\(e\)\{if\(e===void 0\)\{throw Error\(`Swervle camera is unavailable.`\)\}return e\}/);
    names.fValidateCamera = m?.[1] ?? null;
  }
  {
    const m = mainRawSrc.match(/this.([A-Za-z0-9_$]+)=new ([A-Za-z0-9_$]+),this.#([A-Za-z0-9_$]+)=new ([A-Za-z0-9_$]+),this.#([A-Za-z0-9_$]+).adoptCachedLivery\(\)/);
    names.pCameraManagerObject = m?.[1] ?? null;
  }

  return names;
}

// Applies every main-bundle patch to `mainSrc` (already rewritten/absolute-
// import'd) using the derived `names`, returning the patched source. Each
// patch is independent — a missing/stale identifier skips only that one
// patch (via mainPatcher.skip), same as always. `origin` is only needed to
// build the livery chunk's absolute URL.
export function patchMainBundle(mainSrc, mainRawSrc, names, origin, results, log = console) {
  let src = mainSrc;
  const mainPatcher = makePatcher(
    "main bundle",
    () => src,
    (s) => (src = s),
    results,
    log
  );

  const liveryChunkUrl = names.liveryChunkPath ? new URL(names.liveryChunkPath, origin + "/assets/x").href : null;

  // Swervle Utils

  // 1. Expose the ghost-spawning ingredients, unconditionally, every time a
  //    race is (re)booted.
  if (
    names.RV &&
    names.GL &&
    names.VD &&
    names.buildNameplate &&
    names.ghostAppearance &&
    names.ghostColorOverrides &&
    names.carDefinition &&
    names.carContentId &&
    names.playerSceneManager &&
    names.assetFactory &&
    names.physicsModifiers &&
    liveryChunkUrl
  ) {
    mainPatcher.insertAfter(
      "expose-ready-ingredients",
      /this\.#[A-Za-z0-9_$]+\.rivalGap=new [A-Za-z0-9_$]+\(i\.track\.routeLine\)\}catch\(n\)\{throw t\?\.dispose\(\),e\.dispose\(\),n\}\}/,
      () =>
        "window.__srv=window.__srv||{};" +
        `window.__srv.ready={RV:${names.RV},GL:${names.GL},VD:${names.VD},appearance:${names.ghostAppearance},` +
        `carDef:${names.carContentId},definition:${names.carDefinition},materialColorOverrides:${names.ghostColorOverrides},` +
        `buildNameplate:${names.buildNameplate},viewParent:this.${names.playerSceneManager}.viewParent,` +
        `materialRegistrar:this.${names.playerSceneManager}.materialRegistrar,` +
        `modifiers:this.${names.physicsModifiers},track:i.track,assetFactory:this.${names.assetFactory},` +
        `liveryModuleUrl:${JSON.stringify(liveryChunkUrl)},loadLiveryModule:()=>import(${JSON.stringify(liveryChunkUrl)}),` +
        (names.cameraController ? `camera:this.${names.cameraController}?.camera` : "camera:null") +
        "};" +
        "try{window.__srv.onRaceBoot?.();}catch(e){console.error(e);}"
    );
  } else {
    mainPatcher.skip("expose-ready-ingredients", "one or more required identifiers could not be derived");
  }

  // 2. Per fixed-tick telemetry hook.
  if (names.raceManifest) {
    mainPatcher.insertAfter(
      "onTick",
      /[A-Za-z0-9_$]+=[A-Za-z0-9_$]+\(this\.#[A-Za-z0-9_$]+\),[A-Za-z0-9_$]+=this\.#[A-Za-z0-9_$]+\.profile\.hudUpdateTickInterval;/,
      () =>
        "try{window.__srv?.onTick?.({tick:s,nextGateIndex:a.nextGateIndex," +
        `gateCount:this.${names.raceManifest}?.track.gates.length??0,speed:c.speed,position:c.position,phase:a.phase,displayTimeMs:a.displayTimeMs,` +
        "gear:c.gear,shiftTimer:c.shiftTimer});}catch(e){console.error(e);}"
    );
  } else {
    mainPatcher.skip("onTick", "raceManifest field could not be derived");
  }

  // 3. Per-render-frame hook.
  if (names.cameraController) {
    mainPatcher.insertAfter(
      "onRender",
      /this\.#[A-Za-z0-9_$]+\.rival\?\.updateNameplate\(n\.camera\),this\.#[A-Za-z0-9_$]+\.pbGhost\?\.updateNameplate\(n\.camera\),this\.#[A-Za-z0-9_$]+\.teamFieldView\?\.updateNameplates\(n\.camera\);/,
      () =>
        `try{window.__srv?.onRender?.({alpha:e.alpha,playerPosition:i.position,camera:this.${names.cameraController}.camera});}catch(e){console.error(e);}`
    );
  } else {
    mainPatcher.skip("onRender", "cameraController field could not be derived");
  }

  // 7. Optional pointer-lock bypass.
  mainPatcher.replaceOnce(
    "pointerLockToggle",
    /n\.requestPointerLock\(\)\.catch\(\(\)=>void 0\)/,
    () => "(window.__srvNoPointerLock??!1)||(window.__srvWatchingReplay??!1)||n.requestPointerLock().catch(()=>void 0)"
  );

  // 8. Pause-suppression flag.
  mainPatcher.replaceOnce(
    "suppressPauseOnBlur",
    /(#[A-Za-z0-9_$]+=\(\)=>\{this\.#[A-Za-z0-9_$]+=!1,!this\.#[A-Za-z0-9_$]+&&this\.#[A-Za-z0-9_$]+\.isEmpty&&)(this\.#[A-Za-z0-9_$]+\(`focus-lost`\)\};)/,
    (m) => `${m[1]}!window.__srvSuppressPause&&${m[2]}`
  );
  mainPatcher.replaceOnce(
    "suppressPauseOnPointerLockLoss",
    /(!\(r\|\|!t\|\|!n\|\|(?:this\.#[A-Za-z0-9_$]+!==null|!this\.#[A-Za-z0-9_$]+\.isEmpty))(\)&&(?:this\.#[A-Za-z0-9_$]+\(\)|\(this\.#[A-Za-z0-9_$]+=performance\.now\(\)\+250,this\.#[A-Za-z0-9_$]+\(\)\)))\};/,
    (m) => `${m[1]}||window.__srvSuppressPause${m[2]}};`
  );

  //#region 9. Keyboard-held-state-survives-restart fix. Confirmed by reading the
  //    keyboard tracker class's actual source (not just guessing from
  //    symptoms) that its "currently held" state (a private Map, separate
  //    from the per-tick edges queue) is a per-key boolean updated only by
  //    real keydown/keyup DOM events — nothing needs to "restore" it across
  //    a restart, since the physical key was never released; the bug is
  //    entirely that THREE independent call sites explicitly wipe that
  //    state, none of which have any real reason to on an in-place retry
  //    (as opposed to actually leaving the race):
  //      a) start() unconditionally calls this.clear() (which resets BOTH
  //         the edges queue AND the held-state map) in its guard against
  //         double-starting — called every restart via this.#Oe?.start().
  //         Fixed by only resetting the edges queue.
  //      b) The retry routine (#nn(), found via searching for the site's
  //         literal `retry` telemetry-event string) calls
  //         this.#Oe?.stop() with NO ARGUMENT before the reset sequence —
  //         its signature is `stop(e=!1){this.#a&&(this.#a=!1,e?
  //         this.#f():this.clear())}`, so a bare call defaults `e` to
  //         false and therefore ALSO calls this.clear() internally. This
  //         is the site that was missed entirely on the first pass at this
  //         fix — (c) below was independently deleted, but this earlier
  //         call was still wiping the exact same state moments before (c)
  //         even ran, which is why the original fix never actually worked
  //         despite both then-known culprits being patched.
  //      c) The same retry routine ALSO calls this.#Oe?.clear() directly
  //         and explicitly, a second time, independent of both (a) and (b).
  //    (b) and (c) are fixed together in one patch below, since they sit a
  //    bounded, known distance apart in the exact same retry sequence —
  //    anchoring them jointly (rather than as two independent wildcarded
  //    matches that merely happen to be positionally adjacent) means the
  //    combined pattern is what's actually verified unique in the file,
  //    not each half separately. Deliberately does NOT touch the other two
  //    places in the bundle with the exact same `?.stop(),?.stop()` shape
  //    (matched, then rejected, during derivation) — those aren't the
  //    in-place-retry path and this has no evidence they should behave the
  //    same way.
  //#endregion
  if (names.keyboardActive && names.keyboardDisposed && names.keyboardEdges) {
    mainPatcher.replaceOnce(
      "keyboardHeldStateSurvivesRestart_startClear",
      new RegExp(
        `start\\(\\)\\{this\\.${names.keyboardDisposed}\\|\\|this\\.${names.keyboardActive}\\|\\|\\(this\\.clear\\(\\),this\\.${names.keyboardActive}=!0\\)\\}`
      ),
      () => `start(){this.${names.keyboardDisposed}||this.${names.keyboardActive}||(this.${names.keyboardEdges}.length=0,this.${names.keyboardActive}=!0)}`
    );
  } else {
    mainPatcher.skip("keyboardHeldStateSurvivesRestart_startClear", "keyboard input tracker fields could not be derived");
  }
  mainPatcher.replaceOnce(
    "keyboardHeldStateSurvivesRestart_retrySequence",
    /(this\.#[A-Za-z0-9_$]+\?\.stop\(\)),this\.#[A-Za-z0-9_$]+\?\.stop\(\)([\s\S]{0,220}?this\.#[A-Za-z0-9_$]+\?\.reset\(\),)this\.#[A-Za-z0-9_$]+\?\.clear\(\),(this\.#[A-Za-z0-9_$]+\(!1\),this\.#[A-Za-z0-9_$]+\.reset\(\))/,
    // Note: no extra literal "," inserted between m[1] and m[2] — m[2]'s
    // own lazy [\s\S]{0,220}? already swallows the comma that originally
    // separated the two deleted calls, so adding one here produced a
    // double comma (",,") — a real syntax corruption caught by the
    // ESM-integrity check below, not something node --check alone flagged.
    (m) => `${m[1]}${m[2]}${m[3]}`
  );

  // 10. Camera-mode cycle.
  mainPatcher.replaceOnce(
    "cameraModeCycle",
    /if\(e\.code===`KeyC`&&!e\.repeat&&this\.(#[A-Za-z0-9_$]+)===null\)\{e\.preventDefault\(\),this\.(#[A-Za-z0-9_$]+)\.toggleCameraLock\(\);return\}/,
    (m) =>
      `if(e.code===\`KeyC\`&&!e.repeat&&this.${m[1]}===null){e.preventDefault();` +
      `let __v=this.${m[2]},__m=[[!0,!1]];` +
      `window.__srvEnableReverseCam===!0&&__m.push([!0,!0]);` +
      `window.__srvDisableFreecam!==!0&&__m.push([!1,!1]);` +
      `let __i=__m.findIndex(__p=>__p[0]===__v.cameraLocked&&__p[1]===__v.reverseView),` +
      `__t=__m[(Math.max(__i,0)+1)%__m.length];` +
      `__v.reverseView!==__t[1]&&__v.toggleReverseView();` +
      `__v.cameraLocked!==__t[0]&&__v.toggleCameraLock();` +
      `return}`
  );

  // 11. Anti-cheat control lock while watching a replay.
  mainPatcher.replaceOnce(
    "watchReplayControlLock_handbrake",
    /handbrake:([A-Za-z0-9_$]+)\.held\.handbrake===!0\|\|([A-Za-z0-9_$]+)\?\.handbrake===!0/,
    (m) => `handbrake:window.__srvWatchingReplayActive===!0||${m[1]}.held.handbrake===!0||${m[2]}?.handbrake===!0`
  );
  mainPatcher.replaceOnce(
    "watchReplayControlLock_throttle",
    /throttle:([A-Za-z0-9_$]+)\.held\.throttle===!0\|\|([A-Za-z0-9_$]+)\?\.throttle===!0/,
    (m) => `throttle:window.__srvWatchingReplayActive!==!0&&(${m[1]}.held.throttle===!0||${m[2]}?.throttle===!0)`
  );

  // Swervle Haxs

  // 0. Replace the title text to confirm that the extension loaded
  //    successfully.
  mainPatcher.replaceOnce(
    "00replaceTitleText",
    /title:i.mode===`challenge`\?`BEAT THIS RUN.`:`LET'S SWERVE`/,
    () =>
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
  if (names.mRunPoster) {
    mainPatcher.replaceOnce(
      "01disableRunSubmission",
      /async#([A-Za-z0-9_$]+)\(e,t\){try\{let n=await this\.#([A-Za-z0-9_$]+)\(`POST`,e,\{body:t,csrf:!0,timeoutMs:this\.#([A-Za-z0-9_$]+)\}\);return Object\.freeze\(\{body:await ([A-Za-z0-9_$]+)\(n\),httpStatus:n\.status,kind:`response`\}\)\}catch\(e\)\{return Object\.freeze\(\{classification:([A-Za-z0-9_$]+)\(e\)\?`server-timeout`:`server-unreachable`,kind:`transport-failure`,message:e instanceof Error&&e\.message\.length>0\?e\.message:null\}\)\}\}/,
      () =>
        "async#"+names.mRunPoster+"(e,t){return Object.freeze({classification:`server-unreachable`,kind:`transport-failure`,message:`disabled-by-tas`})}"
    );
  } else {
    mainPatcher.skip("01disableRunSubmission", "mRunPoster could not be derived")
  }

  // 2. Forces local verification instead of submiting to servers.
  //    Suppose to prevent "OFFICIAL VERIFIER UNREACHABLE" screen
  //    from appearing and shows the time.
  // mainPatcher.replaceOnce(
  //   "02forceLocalVerifier",
  //   names.mCheckIfLocalBaseOnHostname+"(){return "+names.fCheckIfLocal+"(globalThis.location.hostname)}",
  //   names.mCheckIfLocalBaseOnHostname+"(){return!1}"
  // );
  mainPatcher.replaceOnce(
    "02forceLocalVerifier",
    /if\(this.#([A-Za-z0-9_$]+).requiresServerTruth\(\)\)\{if/,
    () =>
      "if(!1){if"
  );

  // 6. Add TasPlayback class to manage tas playback.
  mainPatcher.insertBefore(
    "06tasPlayback",
    /var ([A-Za-z0-9_$]+)=Object.freeze\(\{boost:!1/,
    () =>
      "const BIT={throttle:1,reverse:2,steerLeft:4,steerRight:8,handbrake:16,recovery:32,boost:64};function decodeStateByte(prevByte,currByte){const heldBits=['throttle','reverse','steerLeft','steerRight','handbrake','boost'];const edges=[];for(const action of heldBits){const bit=BIT[action];const was=(prevByte&bit)!==0;const is=(currByte&bit)!==0;if(was!==is){edges.push({action,kind:is?'pressed':'released'})}}if((currByte&BIT.recovery)!==0){edges.push({action:'recover',kind:'pressed'})}const held={throttle:(currByte&BIT.throttle)!==0,reverse:(currByte&BIT.reverse)!==0,left:(currByte&BIT.steerLeft)!==0,right:(currByte&BIT.steerRight)!==0,handbrake:(currByte&BIT.handbrake)!==0,boost:(currByte&BIT.boost)!==0};return{edges,held}}class TasPlayback{constructor(statesBase64){const binary=atob(statesBase64);this.bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));this.prevByte=0}next(tick){const b=this.bytes[tick]??this.bytes[this.bytes.length-1]??0;const sample=decodeStateByte(this.prevByte,b);this.prevByte=b;return sample;}}"
  )

  // 7. Add getters and methods to the main game class.
  const lifecycleStateRegex = /get lifecycleState\(\)\{return this.([A-Za-z0-9_$]+)\}/
  mainPatcher.insertAfter(
    "07.01debugTimeScale",
    lifecycleStateRegex,
    () =>
      "get __debugTimeScale(){return this."+names.pTimeManagerObject+"?."+names.pTimescale+"??null}"
  )
  /*
  get __debugTimeScale() { return this."+names.pTimeManagerObject+"?."+names.pTimescale+" ?? null; }
  */
  mainPatcher.insertAfter(
    "07.02debugCurrentActions",
    lifecycleStateRegex,
    () =>
      "get __debugCurrentActions(){return this.__lastActions??null}"
  )
  /*
  get __debugCurrentActions() { return this.__lastActions ?? null; }
  */
  mainPatcher.insertAfter(
    "07.03debugCaptureStates",
    lifecycleStateRegex,
    () =>
      "__debugCaptureStates(){return this."+names.pRunRecorderObject+".captureStates()}"
  )
  /*
  __debugCaptureStates() { return this."+names.pRunRecorderObject+".captureStates(); }
  */
  mainPatcher.insertAfter(
    "07.04debugStartPlayback",
    lifecycleStateRegex,
    () =>
      "__debugStartPlayback(statesBase64){this.__tas=new TasPlayback(statesBase64)}"
  )
  /*
  __debugStartPlayback(statesBase64) {
    this.__tas = new TasPlayback(statesBase64)
  }
  */
  mainPatcher.insertAfter(
    "07.05debugStopPlayback",
    lifecycleStateRegex,
    () =>
      "__debugStopPlayback(){this.__tas=null}"
  )
  /*
  __debugStopPlayback() { this.__tas = null; }
  */
  mainPatcher.insertAfter(
    "07.06debugSaveState",
    lifecycleStateRegex,
    () =>
      "__debugSaveState(){return{simulation:this."+names.pSimulationManager+".simulation.captureSnapshot(),inputBytes:this."+names.pRunRecorderObject+".captureStates(),ghost:this."+names.pRivalGhost+".rivalReplay?.captureRawSnapshot()??null}}"
  )
  /*
  __debugSaveState() {
    return {
      simulation: this."+names.pSimulationManager+".simulation.captureSnapshot(),
      inputBytes: this."+names.pRunRecorderObject+".captureStates(),
      ghost: this."+names.pRivalGhost+".rivalReplay?.captureRawSnapshot() ?? null,
    };
  }
  */
  mainPatcher.insertAfter(
    "07.07debugLoadState",
    lifecycleStateRegex,
    () =>
      "__debugLoadState(state){this."+names.pSimulationManager+".simulation.restoreSnapshot(state.simulation);this."+names.pTimeManagerObject+"?.clock.restore(this."+names.pSimulationManager+".simulation.captureSnapshot().clock);this."+names.pRunRecorderObject+".reset();for(const b of state.inputBytes){this."+names.pRunRecorderObject+".recordByte(b)}this."+names.pInputBase64+"=state.inputBytes.length>0?state.inputBytes[state.inputBytes.length-1]&95:0;if(this."+names.pRivalGhost+".rivalReplay&&state.ghost){this."+names.pRivalGhost+".rivalReplay.restoreRawSnapshot(state.ghost);this."+names.pRivalGhost+".rival?.consumeSnapshot(this."+names.pRivalGhost+".rivalReplay.frame.car)}}"
  )
  /*
  __debugLoadState(state) {
    this."+names.pSimulationManager+".simulation.restoreSnapshot(state.simulation);
    this."+names.pTimeManagerObject+"?.clock.restore(this."+names.pSimulationManager+".simulation.captureSnapshot().clock);

    this."+names.pRunRecorderObject+".reset();
    for (const b of state.inputBytes) this."+names.pRunRecorderObject+".recordByte(b);
    this."+names.pInputBase64+" = state.inputBytes.length > 0
      ? state.inputBytes[state.inputBytes.length - 1] & 95
      : 0;

    if (this."+names.pRivalGhost+".rivalReplay && state.ghost) {
      this."+names.pRivalGhost+".rivalReplay.restoreRawSnapshot(state.ghost);
      this."+names.pRivalGhost+".rival?.consumeSnapshot(this."+names.pRivalGhost+".rivalReplay.frame.car);
    }
  }
  */
  mainPatcher.insertAfter(
    "07.08debugDiagnostics",
    lifecycleStateRegex,
    () =>
      "get __debugDiagnostics(){return{frameLoop:this."+names.pTimeManagerObject+"?.diagnostics??null,quality:this."+names.pQualityMonitor+"?.diagnostics()??null,renderer:this."+names.pRenderer+"?.diagnostics()??null}}"
  )
  /*
  get __debugDiagnostics() {
    return {
        frameLoop: this."+names.pTimeManagerObject+"?.diagnostics ?? null,
        quality: this."+names.pQualityMonitor+"?.diagnostics() ?? null,
        renderer: this."+names.pRenderer+"?.diagnostics() ?? null
    }
  }
  */
  mainPatcher.insertAfter(
    "07.09advanceTestTicks",
    lifecycleStateRegex,
    () =>
      "advanceTestTicks(e){let t=this."+names.pSimulationManager+"?.model.ruleset??"+names.vRaceRules+",n=t.warmupTicks+t.countdownTicks+t.maximumRaceTicks;if(!Number.isSafeInteger(e)||e<0||e>n){throw RangeError(`Swervle test tick count must be an integer from 0 through ${String(n)}.`)}let r=this."+names.pSimulationManager+",i=this."+names.pTimeManagerObject+";if(r===void 0||i===void 0){return}let a=r.model.raceState.phase;if(a!==`countdown`&&a!==`racing`){throw Error(`Swervle test ticks require an active countdown or race.`)}return i.stop(),this."+names.mAdvanceTicks+"(r,i,e),e>0&&this."+names.mRenderTick+"({alpha:1,realDeltaSeconds:e*1/60,simulationTick:r.simulation.tick,ticksAdvanced:e})}"
  )
  /*
  advanceTestTicks(e) {
    let t = this."+names.pSimulationManager+"?.model.ruleset ?? "+names.vRaceRules+",
      n = t.warmupTicks + t.countdownTicks + t.maximumRaceTicks;
    if (!Number.isSafeInteger(e) || e < 0 || e > n) throw RangeError(`Swervle test tick count must be an integer from 0 through ${String(n)}.`);
    let r = this."+names.pSimulationManager+",
      i = this."+names.pTimeManagerObject+";
    if (r === void 0 || i === void 0) return;
    let a = r.model.raceState.phase;
    if (a !== `countdown` && a !== `racing`) throw Error(`Swervle test ticks require an active countdown or race.`);
    return i.stop(), this."+names.mAdvanceTicks+"(r, i, e), e > 0 && this."+names.mRenderTick+"({
      alpha: 1,
      realDeltaSeconds: e * 1/60,
      simulationTick: r.simulation.tick,
      ticksAdvanced: e
    })
  }
  */
  mainPatcher.insertAfter(
    "07.10resumeTestFrames",
    lifecycleStateRegex,
    () =>
      "resumeTestFrames(){let e=this."+names.pTimeManagerObject+";if(e===void 0){return}if(this."+names.pLifecycleState+"!==`running`){throw Error(`Swervle test frames require a running race.`)}return e.start()}"
  )
  /*
  resumeTestFrames() {
    let e = this."+names.pTimeManagerObject+";
    if (e === void 0) return;
    if (this."+names.pLifecycleState+" !== `running`) throw Error(`Swervle test frames require a running race.`);
    return e.start()
  }
  */
  mainPatcher.insertAfter(
    "07.11",
    lifecycleStateRegex,
    () =>
      "async loadRivalGhost(e){console.log(`hiyya`);if(this."+names.pSimulationManager+"===undefined){throw new Error('loadRivalGhost failed: Instance state "+names.pSimulationManager+" is undefined.')}if(this."+names.pTrack+"===undefined){throw new Error('loadRivalGhost failed: Instance state "+names.pTrack+" is undefined.')}if(!e||typeof e!=='object'){throw new TypeError(`loadRivalGhost failed: Expected an options object argument. ${ e }`)}if(typeof e.statesBase64!=='string'){throw new TypeError(`loadRivalGhost failed: 'statesBase64' must be a string, received ${ typeof e.statesBase64 }. ${e.statesBase64 }`)}if(typeof e.displayName!=='string'){if(typeof e.publicDisplayName!=='string'){throw new TypeError(`loadRivalGhost failed: 'displayName' or 'publicDisplayName' must be a string, received ${ typeof e.displayName } and ${ typeof e.publicDisplayName }.`)}e.displayName=e.publicDisplayName}if(!e.livery||typeof e.livery!=='object'){console.warn(`loadRivalGhost warning: 'livery' expected an object, received ${ typeof e.livery }.`)}try{let t="+names.fValidStates+"(e.statesBase64,{expectedLength:e.durationTicks,maximumLength:"+names.fGetRuleset+"(this."+names.pTrack+".track.revision.rulesetVersion).maximumRaceTicks});this.__ghostStates=t;if(this."+names.pRivalGhost+".rivalReplay?.dispose(),this."+names.pRivalGhost+".rival?.dispose(),this."+names.pRivalGhost+".rivalReplay=void 0,this."+names.pRivalGhost+".rival=void 0,this."+names.pRivalGhost+".rivalGap=void 0,t.length===0){return}let n=new "+names.cRivalGhostSimulator+"({modifiers:this."+names.pRivalGhostModifiers+",states:t,track:this."+names.pTrack+".track}),r=null;try{let i=n.create();let a=new "+names.cGhostCarView+"({appearance:"+names.vGCVApperance+",assetInstance:"+names.vGCVAssetInstance+",definition:"+names.vGCVDefinition+",entityId:i.car.entityId,materialColorOverrides:"+names.vGCVMaterialColorOverrides+",materialRegistrar:this."+names.pTerrainViewManagerObject+".materialRegistrar});let ghostLivery=e.livery??e.ghost?.livery??e.design??null;r=await this."+names.pRivalGhost+".createGhostRaceLivery(a,ghostLivery);let o="+names.fGetGhostDisplayName+"({displayName:e.displayName,relationship:`friend`,surface:`gameplay`}),s=new "+names.cRivalGhostRenderer+"({carView:a,initialSnapshot:i.car,nameplate:o===null?null:{label:o},parent:this."+names.pTerrainViewManagerObject+".viewParent});s.setVisible(this."+names.pRivalGhost+"),this."+names.pRivalGhost+".rival=s,this."+names.pRivalGhost+".rivalReplay=n,this."+names.pRivalGhost+".rivalGap=new "+names.cRivalGapGetter+"(this."+names.pTrack+".track.routeLine),this."+names.pRenderer+"?.render("+names.fValidateCamera+"(this."+names.pCameraManagerObject+").camera);console.log(`yippe!`)}catch(e){throw r?.dispose(),n.dispose(),e}return this.diagnostics()}catch(e){throw Error(`Failed to load rival ghost: ${ e instanceof Error?e.message:String(e)}`)}}"
  )
  /*
  async loadRivalGhost(e) {
    console.log(`hiyya`);
    // Check internal instance state
    if (this."+names.pSimulationManager+" === undefined) {
      throw new Error('loadRivalGhost failed: Instance state "+names.pSimulationManager+" is undefined.');
    }
    if (this."+names.pTrack+" === undefined) {
      throw new Error('loadRivalGhost failed: Instance state "+names.pTrack+" is undefined.');
    }

    // Check argument object presence
    if (!e || typeof e !== 'object') {
      throw new TypeError(`loadRivalGhost failed: Expected an options object argument. ${e}`);
    }

    // Check required properties and types
    if (typeof e.statesBase64 !== 'string') {
      throw new TypeError(`loadRivalGhost failed: 'statesBase64' must be a string, received ${typeof e.statesBase64}. ${e.statesBase64}`);
    }

    if (typeof e.displayName !== 'string') {
      if (typeof e.publicDisplayName !== 'string') {
        throw new TypeError(`loadRivalGhost failed: 'displayName' or 'publicDisplayName' must be a string, received ${typeof e.displayName} and ${typeof e.publicDisplayName}.`);
      }
      e.displayName = e.publicDisplayName;
    }

    // durationTicks is not necessary
    // if (typeof e.durationTicks !== 'number') {
    //   throw new TypeError(`loadRivalGhost failed: 'durationTicks' must be a number, received ${typeof e.durationTicks}.`);
    // }

    if (!e.livery || typeof e.livery !== 'object') {
      console.warn(`loadRivalGhost warning: 'livery' expected an object, received ${typeof e.livery}.`);
    }
    try {
      let t = "+names.fValidStates+"(e.statesBase64, {
        expectedLength: e.durationTicks,
        maximumLength: "+names.fGetRuleset+"(this."+names.pTrack+".track.revision.rulesetVersion).maximumRaceTicks
      });
      this.__ghostStates = t; // Save ghost states for save and load state
      if (this."+names.pRivalGhost+".rivalReplay?.dispose(), this."+names.pRivalGhost+".rival?.dispose(), this."+names.pRivalGhost+".rivalReplay = void 0, this."+names.pRivalGhost+".rival = void 0, this."+names.pRivalGhost+".rivalGap = void 0, t.length === 0)
        return;
      let n = new "+names.cRivalGhostSimulator+"({
        modifiers: this."+names.pRivalGhostModifiers+",
        states: t,
        track: this."+names.pTrack+".track
      }),
      r = null;
      try {
        let i = n.create();
        let a = new "+names.cGhostCarView+"({
          appearance: "+names.vGCVApperance+",
          assetInstance: "+names.vGCVAssetInstance+",
          definition: "+names.vGCVDefinition+",
          entityId: i.car.entityId,
          materialColorOverrides: "+names.vGCVMaterialColorOverrides+",
          materialRegistrar: this."+names.pTerrainViewManagerObject+".materialRegistrar
        });
        // Extract livery from argument and pass to #ga instead of null
        let ghostLivery = e.livery ?? e.ghost?.livery ?? e.design ?? null;
        r = await this."+names.pRivalGhost+".createGhostRaceLivery(a, ghostLivery);
        let o = "+names.fGetGhostDisplayName+"({
          displayName: e.displayName,
          relationship: `friend`,
          surface: `gameplay`
        }),
        s = new "+names.cRivalGhostRenderer+"({
          carView: a,
          initialSnapshot: i.car,
          nameplate: o === null ? null : {label: o},
          parent: this."+names.pTerrainViewManagerObject+".viewParent
        });
        s.setVisible(this."+names.pRivalGhost+"),
        this."+names.pRivalGhost+".rival = s,
        this."+names.pRivalGhost+".rivalReplay = n,
        this."+names.pRivalGhost+".rivalGap = new "+names.cRivalGapGetter+"(this."+names.pTrack+".track.routeLine),
        this."+names.pRenderer+"?.render("+names.fValidateCamera+"(this."+names.pCameraManagerObject+").camera);
        console.log(`yippe!`);
      }
      catch(e) {
        throw r?.dispose(),
        n.dispose(),
        e
      }
      return this.diagnostics()
    }
    catch(e) {
      throw Error(`Failed to load rival ghost: ${e instanceof Error ? e.message : String(e)}`)
    }
  }
  */

  return { patchedSrc: src, liveryChunkUrl };
}

// Applies the one TerrainView/RV-chunk patch (the raceTelemetry getter).
export function patchTerrainViewChunk(tvSrc, results, log = console) {
  let src = tvSrc;
  const tvPatcher = makePatcher(
    "TerrainView chunk",
    () => src,
    (s) => (src = s),
    results,
    log
  );

  tvPatcher.insertAfter(
    "raceTelemetry",
    /get finished\(\)\{return this\.#s===`finished`\|\|this\.#s===`exhausted`\}/,
    () =>
      "get raceTelemetry(){if(this.#o==null)return null;" +
      "let e=this.#o.model.base.requireCar(this.#o.model.carEntityId).captureTelemetry();" +
      // tick is RACE-relative (ticks since the race started), exactly like the
      // live onTick telemetry — the replay's own counter (#c) also spans the
      // pre-race countdown, which made PB splits never line up with live ones.
      "let r=this.#o.model.raceState,n=r.startedTick;" +
      "return{nextGateIndex:r.nextGateIndex,position:e.position,speed:e.speed," +
      "tick:n===null?0:Math.max(0,this.#o.simulation.tick-n),displayTimeMs:r.displayTimeMs}}"
  );

  return { patchedSrc: src };
}

// export function patchReplayChunk(replaySrc, results, log = console) {
//   let src = replaySrc;
//   const replayPatcher = makePatcher(
//     "Replay chunk",
//     () => src,
//     (s) => (src = s),
//     results,
//     log
//   );


// }

// High-level one-shot: fetches everything live and returns fully patched
// sources plus the metadata each caller needs to do its own delivery
// (Node: write files for inspection; extension: build data: URLs and
// register dynamic rules). Throws only for hard failures (can't find the entry
// script, can't locate the RV chunk's import path at all) — individual
// patch failures are soft (recorded in `results`, everything else still
// gets produced), matching the CLI's long-standing behavior.
export async function patchLiveBundles(origin, log = console) {
  const results = [];

  const { mainFilename, mainRawSrc } = await discoverAndFetchMainBundle(origin);
  log.log(`Discovered live main bundle: ${mainFilename}`);
  const mainRewritten = rewriteRelativeChunkRefs(origin, "main bundle", mainRawSrc, log);
  const names = deriveIdentifiers(mainRewritten, mainRawSrc);
  log.log("Derived identifiers:", names);
  const { patchedSrc: mainSrc } = patchMainBundle(mainRewritten, mainRawSrc, names, origin, results, log);

  if (!names.rvChunkPath) throw new Error("Could not locate the RV/TerrainView chunk's import path in the main bundle.");
  const { tvFilename, tvRawSrc } = await fetchTerrainViewChunk(origin, names.rvChunkPath);
  log.log(`Discovered live RV/TerrainView chunk: ${tvFilename}`);
  const tvRewritten = rewriteRelativeChunkRefs(origin, "TerrainView chunk", tvRawSrc, log);
  const { patchedSrc: tvSrc } = patchTerrainViewChunk(tvRewritten, results, log);

  return { mainFilename, mainSrc, tvFilename, tvSrc, names, results };
}
