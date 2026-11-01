// Portable core of the Swervle Haxs bundle patcher: identifier derivation +
// patch insertion, no Node-specific APIs. Used by tools/patch-bundle.mjs.
//
// Swervle Utils no longer patches the bundle (it hooks the live module from
// hooks.js instead), so the Utils patches that used to live here are gone.
// Everything below is Haxs-only. Each patch is independent and best-effort: a
// stale anchor skips that one patch and is reported, nothing else breaks.

// ---------------------------------------------------------------------------
// Chunk reference rewriting
// ---------------------------------------------------------------------------
// When the patched file is served from somewhere else (chrome-extension://),
// the browser resolves its relative imports against ITS url. Rewrites them to
// absolute `origin + assetsPath` URLs. Handles both shapes seen in the wild:
//   "./name-hash.js" / `./name-hash.js`   (static + dynamic imports)
//   from"name-hash.js" / import"name-hash.js"   (bare, offline/modded builds)
export function rewriteRelativeChunkRefs(origin, assetsPath, name, src, log = console) {
  const base = origin.replace(/\/+$/, "") + (assetsPath.startsWith("/") ? assetsPath : "/" + assetsPath);
  const base_ = base.endsWith("/") ? base : base + "/";
  const NAME = String.raw`[A-Za-z0-9_.]+-[A-Za-z0-9_-]{6,}\.(?:js|css)`;
  let count = 0;
  let out = src.replace(new RegExp(String.raw`(["'\x60])\.\/(${NAME})\1`, "g"), (_m, q, f) => (count++, `${q}${base_}${f}${q}`));
  out = out.replace(new RegExp(String.raw`(\bfrom|\bimport)\s*"(${NAME})"`, "g"), (_m, kw, f) => (count++, `${kw}"${base_}${f}"`));
  log.log(`${name}: rewrote ${count} chunk references to absolute ${base_}`);
  return out;
}

// ---------------------------------------------------------------------------
// Patcher engine
// ---------------------------------------------------------------------------
export function makePatcher(fileLabel, getSrc, setSrc, results, log = console) {
  function run(name, anchorRe, apply) {
    const src = getSrc();
    const re = new RegExp(anchorRe.source, anchorRe.flags.includes("g") ? anchorRe.flags : anchorRe.flags + "g");
    const matches = [...src.matchAll(re)];
    if (matches.length !== 1) {
      log.warn(
        `⚠ [${fileLabel}] patch "${name}" anchor matched ${matches.length} times (expected exactly 1) — skipping.\n  Pattern: ${anchorRe.source}`
      );
      results.push({ file: fileLabel, name, ok: false });
      return;
    }
    const m = matches[0];
    setSrc(src.slice(0, m.index) + apply(m) + src.slice(m.index + m[0].length));
    results.push({ file: fileLabel, name, ok: true });
  }
  return {
    insertAfter: (name, re, fn) => run(name, re, (m) => m[0] + fn(m)),
    insertBefore: (name, re, fn) => run(name, re, (m) => fn(m) + m[0]),
    replaceOnce: (name, re, fn) => run(name, re, fn),
    skip(name, reason) {
      log.warn(`⚠ [${fileLabel}] patch "${name}" skipped — ${reason}`);
      results.push({ file: fileLabel, name, ok: false });
    },
  };
}

const ID = String.raw`[A-Za-z0-9_$]+`;

// ---------------------------------------------------------------------------
// Live discovery (fetch mode only)
// ---------------------------------------------------------------------------
// Markers that only exist in the real game bundle.
const GAME_MARKERS = [/requiresServerTruth\(\)/, /get lifecycleState\(\)/];

const IMPORT_RE = /(?:\bfrom|\bimport)\s*\(?\s*["'`](?:\.\/)?([A-Za-z0-9_.]+-[A-Za-z0-9_-]{6,}\.js)["'`]/g;

// Walks static/dynamic imports (breadth-first) from the entry module and
// returns the first chunk that looks like the game bundle.
export async function discoverAndFetchMainBundle(origin, maxChunks = 25) {
  const html = await fetch(origin).then((r) => r.text());
  const m = html.match(/<script[^>]*type="module"[^>]*src="([^"]*\/assets\/[^"]+\.js)"/);
  if (!m) throw new Error("Could not find main module script tag in the page's HTML.");
  const entryUrl = new URL(m[1], origin).href;
  const base = entryUrl.slice(0, entryUrl.lastIndexOf("/") + 1);

  const seen = new Set();
  const queue = [entryUrl];
  while (queue.length && seen.size < maxChunks) {
    const url = queue.shift();
    if (seen.has(url)) continue;
    seen.add(url);
    const src = await fetch(url).then((r) => r.text());
    if (GAME_MARKERS.every((re) => re.test(src)))
      return { mainUrl: url, mainFilename: url.split("/").pop(), mainRawSrc: src, entryUrl };
    for (const [, file] of src.matchAll(IMPORT_RE)) queue.push(base + file);
  }
  throw new Error(`No chunk reachable from ${entryUrl} contains the game code (checked ${seen.size}).`);
}

// The run recorder (`get tickCount`) lives in the main bundle in current
// builds, but used to live in a separate replay chunk.
export const RECORDER_MARKER = /get tickCount\(\)\{return this\.#[A-Za-z0-9_$]+\.length\}/;

export async function fetchReplayChunk(origin, chunkPath) {
  const first = new URL(chunkPath, origin + "/assets/x").href;
  return { tvFilename: first.split("/").pop(), tvRawSrc: await fetch(first).then((r) => r.text()) };
}

// Path of the chunk the main bundle imports the replay class from (only
// needed when the recorder is NOT in the main bundle).
export function findReplayChunkPath(mainRawSrc) {
  const m = mainRawSrc.match(/new ([A-Za-z0-9_$]+)\(\{modifiers:this\.#[A-Za-z0-9_$]+,presentationRaycastEmulation:/);
  if (!m) return null;
  const local = m[1].replace(/\$/g, "\\$");
  const re = new RegExp(String.raw`import\{[^}]*(?:[{,]|\bas\s+)\s*${local}(?=\s*[,}])[^}]*\}from"(?:\.\/)?([^"]+)"`);
  const hit = mainRawSrc.match(re);
  return hit ? "./" + hit[1] : null;
}

// ---------------------------------------------------------------------------
// Identifier derivation (from stable, human-named members)
// ---------------------------------------------------------------------------
export function deriveIdentifiers(src) {
  const n = {};
  const first = (re, ...fields) => {
    const m = src.match(re);
    fields.forEach((f, i) => (n[f] = m?.[i + 1] ?? null));
    return m;
  };

  first(
    new RegExp(
      String.raw`async#(${ID})\(e,t\)\{try\{let n=await this\.#(${ID})\(\`POST\`,e,\{body:t,csrf:!0,timeoutMs:this\.#(${ID})\}\);return Object\.freeze\(\{body:await (${ID})\(n\),httpStatus:n\.status,kind:\`response\`\}\)\}catch\(e\)\{return Object\.freeze\(\{classification:(${ID})\(e\)\?\`server-timeout\`:\`server-unreachable\``
    ),
    "mRunPoster"
  );
  first(new RegExp(String.raw`if\(this\.#(${ID})\.requiresServerTruth\(\)\)\{if`), "pRunVerifierObject");
  first(
    new RegExp(String.raw`(${ID})\.restore\((${ID})\.simulation\.captureSnapshot\(\)\.clock\),this\.#(${ID})=new (${ID})\(\{`),
    "_a",
    "_b",
    "pTimeManagerObject"
  );
  first(
    new RegExp(
      String.raw`constructor\(e\)\{this\.#${ID}=e\.callbacks,this\.#${ID}=e\.frameDriver,this\.clock=e\.clock\?\?new ${ID},this\.(${ID})=e\.\1\?\?new ${ID}\}`
    ),
    "pTimescale"
  );
  first(new RegExp(String.raw`#(${ID})=new ${ID}\((${ID})\.maximumRaceTicks\);`), "pRunRecorderObject", "vRaceRules");
  first(new RegExp(String.raw`#(${ID})=${ID}\.warmupTicks\+${ID}\.countdownTicks;`), "pRaceStartTick");
  // The previous-input-byte field of the main game class (set right before the
  // "input-system" failure handler) — NOT the identical-looking one in the replay class.
  first(new RegExp(String.raw`this\.#(${ID})=${ID}&95\}catch\{this\.#${ID}\(\`input-system\`\)\}`), "pInputBase64");
  first(new RegExp(String.raw`if\(this\.#(${ID})\?\.model\.raceState\.phase!==\`invalid\`\)`), "pSimulationManager");
  first(new RegExp(String.raw`gpuFrameMs:this\.#(${ID})\.diagnostics\(\)\.lastGpuFrameMs,`), "pQualityMonitor");
  first(new RegExp(String.raw`this\.#(${ID})=${ID},${ID}\(\);let ${ID}=${ID}\.diagnostics\(\);`), "pRenderer");
  first(new RegExp(String.raw`#(${ID})\(e,t,n\)\{this\.#${ID}=!0;try\{`), "mAdvanceTicks");
  first(new RegExp(String.raw`#(${ID})\(e,t,n\)\{this\.#${ID}\?\.gearMeter`), "mRenderTick");
  // The main game class's getter — anchored on the keyboard-event tail that
  // precedes it, because other classes have their own `lifecycleState`.
  first(
    new RegExp(
      String.raw`${ID}\.dispatchEvent\(new KeyboardEvent\(\`keyup\`,${ID}\)\),!0\}get lifecycleState\(\)\{return this\.#(${ID})\}`
    ),
    "pLifecycleState"
  );
  first(
    new RegExp(
      String.raw`(${ID})=(${ID})\(\{boost:\((${ID})\.held\.boost===!0\|\|(${ID})\?\.boost===!0\)&&(${ID})\(this\.#(${ID})\)>0,handbrake:${ID}\.held\.handbrake===!0\|\|${ID}\?\.handbrake===!0,recoveryRequested:(${ID}),reverse:${ID}\.held\.reverse===!0\|\|${ID}\?\.reverse===!0,steerLeft:(${ID})\|\|(${ID})===\`left\`,steerRight:(${ID})\|\|${ID}===\`right\`,throttle:${ID}\.held\.throttle===!0\|\|${ID}\?\.throttle===!0\}\)`
    ),
    "vActionBools",
    "fActionBools",
    "vABSampledInput",
    "vABTarget",
    "fBoostMeter",
    "pBoostMeter",
    "vABRecoveryFlag",
    "vABLeftHeld",
    "vABSteeringDirection",
    "vABRightHeld"
  );
  if (Object.values(n).every((v) => v === null))
    throw new Error("No identifiers derived — wrong file? (entry stub instead of game bundle?)");

  return n;
}

export function deriveRecorderIdentifiers(src) {
  const m = src.match(/get tickCount\(\)\{return this\.#([A-Za-z0-9_$]+)\.length\}/);
  return { pReplayStates: m?.[1] ?? null };
}

// ---------------------------------------------------------------------------
// Patches
// ---------------------------------------------------------------------------
const TAS_PLAYBACK =
  "const BIT={throttle:1,reverse:2,steerLeft:4,steerRight:8,handbrake:16,recovery:32,boost:64};function decodeStateByte(prevByte,currByte){const heldBits=['throttle','reverse','steerLeft','steerRight','handbrake','boost'];const edges=[];for(const action of heldBits){const bit=BIT[action];const was=(prevByte&bit)!==0;const is=(currByte&bit)!==0;if(was!==is){edges.push({action,kind:is?'pressed':'released'})}}if((currByte&BIT.recovery)!==0){edges.push({action:'recover',kind:'pressed'})}const held={throttle:(currByte&BIT.throttle)!==0,reverse:(currByte&BIT.reverse)!==0,left:(currByte&BIT.steerLeft)!==0,right:(currByte&BIT.steerRight)!==0,handbrake:(currByte&BIT.handbrake)!==0,boost:(currByte&BIT.boost)!==0};return{edges,held}}class TasPlayback{constructor(statesBase64){const binary=atob(statesBase64);this.bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));this.prevByte=0}next(tick){const b=this.bytes[tick]??this.bytes[this.bytes.length-1]??0;const sample=decodeStateByte(this.prevByte,b);this.prevByte=b;return sample;}}";

export function patchMainBundle(mainSrc, names, results, log = console) {
  let src = mainSrc;
  const p = makePatcher("main bundle", () => src, (s) => (src = s), results, log);
  const need = (patchName, ...keys) => {
    const missing = keys.filter((k) => !names[k]);
    if (missing.length) p.skip(patchName, `${missing.join(", ")} could not be derived`);
    return missing.length === 0;
  };

  // 0. Title text, to confirm the patched build loaded.
  p.replaceOnce("00replaceTitleText", /`BEAT THIS RUN\.`:`LET'S SWERVE`/, () => "`DESTROY THIS RUN.`:`LET'S TAS`");

  // 1. Run submission never reaches the network (graceful "server unreachable").
  if (need("01disableRunSubmission", "mRunPoster")) {
    p.replaceOnce(
      "01disableRunSubmission",
      new RegExp(
        String.raw`async#${ID}\(e,t\)\{try\{let n=await this\.#${ID}\(\`POST\`,e,\{body:t,csrf:!0,timeoutMs:this\.#${ID}\}\);return Object\.freeze\(\{body:await ${ID}\(n\),httpStatus:n\.status,kind:\`response\`\}\)\}catch\(e\)\{return Object\.freeze\(\{classification:${ID}\(e\)\?\`server-timeout\`:\`server-unreachable\`,kind:\`transport-failure\`,message:e instanceof Error&&e\.message\.length>0\?e\.message:null\}\)\}\}`
      ),
      () => `async#${names.mRunPoster}(e,t){return Object.freeze({classification:\`server-unreachable\`,kind:\`transport-failure\`,message:\`disabled-by-tas\`})}`
    );
  }

  // 2. Force the local verifier (no "OFFICIAL VERIFIER UNREACHABLE" screen).
  p.replaceOnce("02forceLocalVerifier", new RegExp(String.raw`if\(this\.#${ID}\.requiresServerTruth\(\)\)\{if`), () => "if(!1){if");

  // 3. Local run's leaderboard rank: hand (dailyId, durationTicks) to
  //    haxs-rank.js, which asks the standing endpoint and fixes up the row.
  p.insertAfter("03dailyRankHook", /dailyRank\(e,t,n\)\{/, () => "try{window.__haxsDailyRank?.(e,t,n)}catch{}");

  // 6. TasPlayback class.
  p.insertAfter("06tasPlayback", new RegExp(String.raw`function ${ID}\(e\)\{return e!==void 0&&${ID}\.has\(e\)\}`), () => TAS_PLAYBACK);

  // 7. Methods on the main game class (anchored on ITS lifecycleState getter).
  const L = new RegExp(
    String.raw`${ID}\.dispatchEvent\(new KeyboardEvent\(\`keyup\`,${ID}\)\),!0\}get lifecycleState\(\)\{return this\.#${ID}\}`
  );
  const n = names;
  if (need("07.01debugTimeScale", "pTimeManagerObject", "pTimescale"))
    p.insertAfter("07.01debugTimeScale", L, () => `get __debugTimeScale(){return this.#${n.pTimeManagerObject}?.${n.pTimescale}??null}`);
  p.insertAfter("07.02debugCurrentActions", L, () => "get __debugCurrentActions(){return this.__lastActions??null}");
  if (need("07.03debugCaptureStates", "pRunRecorderObject"))
    p.insertAfter("07.03debugCaptureStates", L, () => `__debugCaptureStates(){return this.#${n.pRunRecorderObject}.captureStates()}`);
  p.insertAfter("07.04debugStartPlayback", L, () => "__debugStartPlayback(statesBase64){this.__tas=new TasPlayback(statesBase64)}");
  p.insertAfter("07.05debugStopPlayback", L, () => "__debugStopPlayback(){this.__tas=null}");
  if (need("07.06debugSaveState", "pSimulationManager", "pRunRecorderObject"))
    p.insertAfter(
      "07.06debugSaveState",
      L,
      () => `__debugSaveState(){return{simulation:this.#${n.pSimulationManager}.simulation.captureSnapshot(),inputBytes:this.#${n.pRunRecorderObject}.captureStates()}}`
    );
  if (need("07.07debugLoadState", "pSimulationManager", "pTimeManagerObject", "pRunRecorderObject", "pInputBase64"))
    p.insertAfter(
      "07.07debugLoadState",
      L,
      () =>
        `__debugLoadState(state){this.#${n.pSimulationManager}.simulation.restoreSnapshot(state.simulation);this.#${n.pTimeManagerObject}?.clock.restore(this.#${n.pSimulationManager}.simulation.captureSnapshot().clock);this.#${n.pRunRecorderObject}.reset();for(const b of state.inputBytes){this.#${n.pRunRecorderObject}.recordByte(b)}this.#${n.pInputBase64}=state.inputBytes.length>0?state.inputBytes[state.inputBytes.length-1]&95:0}`
    );
  if (need("07.08debugDiagnostics", "pTimeManagerObject", "pQualityMonitor", "pRenderer"))
    p.insertAfter(
      "07.08debugDiagnostics",
      L,
      () =>
        `get __debugDiagnostics(){return{frameLoop:this.#${n.pTimeManagerObject}?.diagnostics??null,quality:this.#${n.pQualityMonitor}?.diagnostics()??null,renderer:this.#${n.pRenderer}?.diagnostics()??null}}`
    );
  if (need("07.09advanceTestTicks", "pSimulationManager", "vRaceRules", "pTimeManagerObject", "mAdvanceTicks", "mRenderTick"))
    p.insertAfter(
      "07.09advanceTestTicks",
      L,
      () =>
        `advanceTestTicks(e){let t=this.#${n.pSimulationManager}?.model.ruleset??${n.vRaceRules},n=t.warmupTicks+t.countdownTicks+t.maximumRaceTicks;if(!Number.isSafeInteger(e)||e<0||e>n){throw RangeError(\`Swervle test tick count must be an integer from 0 through \${String(n)}.\`)}let r=this.#${n.pSimulationManager},i=this.#${n.pTimeManagerObject};if(r===void 0||i===void 0){return}let a=r.model.raceState.phase;if(a!==\`countdown\`&&a!==\`racing\`){throw Error(\`Swervle test ticks require an active countdown or race.\`)}return i.stop(),this.#${n.mAdvanceTicks}(r,i,e),e>0&&this.#${n.mRenderTick}({alpha:1,realDeltaSeconds:e*1/60,simulationTick:r.simulation.tick,ticksAdvanced:e})}`
    );
  if (need("07.10resumeTestFrames", "pTimeManagerObject", "pLifecycleState"))
    p.insertAfter(
      "07.10resumeTestFrames",
      L,
      () =>
        `resumeTestFrames(){let e=this.#${n.pTimeManagerObject};if(e===void 0){return}if(this.#${n.pLifecycleState}!==\`running\`){throw Error(\`Swervle test frames require a running race.\`)}return e.start()}`
    );

  // 8. Feed TAS bytes in place of the keyboard sample. The race-start offset
  //    is read from the game's own field (warmupTicks+countdownTicks) when it
  //    could be derived, otherwise the historical 211.
  p.replaceOnce(
    "08useTas",
    /let r=n\.sample\(\)/,
    () => `let r=this.__tas?this.__tas.next(e-${n.pRaceStartTick ? "this.#" + n.pRaceStartTick : "211"}):n.sample()`
  );

  // 9. Capture the actions the game actually used each tick.
  if (need("09.1getActions", "vActionBools", "fActionBools", "fBoostMeter", "pBoostMeter", "vABSampledInput", "vABTarget", "vABRecoveryFlag", "vABLeftHeld", "vABRightHeld", "vABSteeringDirection")) {
    p.replaceOnce(
      "09.1getActions",
      new RegExp(
        String.raw`${ID}=${ID}\(\{boost:\(${ID}\.held\.boost===!0\|\|${ID}\?\.boost===!0\)&&${ID}\(this\.#${ID}\)>0,handbrake:${ID}\.held\.handbrake===!0\|\|${ID}\?\.handbrake===!0,recoveryRequested:${ID},reverse:${ID}\.held\.reverse===!0\|\|${ID}\?\.reverse===!0,steerLeft:${ID}\|\|${ID}===\`left\`,steerRight:${ID}\|\|${ID}===\`right\`,throttle:${ID}\.held\.throttle===!0\|\|${ID}\?\.throttle===!0\}\)`
      ),
      () =>
        `actions={boost:(${n.vABSampledInput}.held.boost===!0||${n.vABTarget}?.boost===!0)&&${n.fBoostMeter}(this.#${n.pBoostMeter})>0,handbrake:${n.vABSampledInput}.held.handbrake===!0||${n.vABTarget}?.handbrake===!0,recoveryRequested:${n.vABRecoveryFlag},reverse:${n.vABSampledInput}.held.reverse===!0||${n.vABTarget}?.reverse===!0,steerLeft:${n.vABLeftHeld}||${n.vABSteeringDirection}===\`left\`,steerRight:${n.vABRightHeld}||${n.vABSteeringDirection}===\`right\`,throttle:${n.vABSampledInput}.held.throttle===!0||${n.vABTarget}?.throttle===!0},${n.vActionBools}=${n.fActionBools}(actions)`
    );
  }
  p.insertAfter(
    "09.2setActions",
    new RegExp(String.raw`${ID}=${ID}\.model\.raceState;`),
    () => "this.__lastActions={tick:e,source:this.__tas?`tas`:`live`,...actions};"
  );

  // 10. Expose the main game.
  p.insertAfter("10exposeMain", new RegExp(String.raw`let t=new ${ID}\(\{mount:e\}\);`), () => "window.__SWERVLE_GAME__=t;");

  // 11. Don't let the site reload the page under us.
  p.replaceOnce("11preventReloading", /return globalThis\.location\.replace\(t\),!0/, () => "return !1");

  return src;
}

export function patchRecorder(src, label, results, log = console) {
  const names = deriveRecorderIdentifiers(src);
  let out = src;
  const p = makePatcher(label, () => out, (s) => (out = s), results, log);

  // r1: captureStates on the run recorder (main bundle in current builds,
  // the replay chunk in older ones).
  if (names.pReplayStates)
    p.insertAfter("r1addCaptureStates", RECORDER_MARKER, () => `captureStates(){return Uint8Array.from(this.#${names.pReplayStates})}`);
  else p.skip("r1addCaptureStates", "pReplayStates could not be derived");

  return out;
}
