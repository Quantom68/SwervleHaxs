/**
 * Starts the map download before the main bundle exists.
 *
 * Boot used to be strictly serial: download ~400 KB of JS, execute it, probe
 * `/readyz`, THEN ask for the ~480 KB track document, and only after that
 * finished did the car model start. On a slow connection those three legs simply
 * add up. This file is a few hundred bytes, ships from `public/` so it is
 * same-origin under `script-src 'self'`, and is fetched in parallel with the
 * bundle — so the track document is already in flight while the bundle is still
 * downloading.
 *
 * It is deliberately NOT part of the Vite graph: it must not wait for, or grow
 * with, the application bundle. It is also deliberately not a `<link
 * rel="preload">` — the endpoint depends on the route, and preloading the wrong
 * day would cost a wasted 480 KB rather than saving one.
 *
 * Contract with `SwervleRaceGatewayV1`: this sets `window.__SWERVLE_RACE_PREFETCH__`
 * to `{ path, response }`, where `path` is the api-relative path the gateway
 * would itself request and `response` is the in-flight `fetch` promise. The
 * gateway claims it once, by exact path match, and falls back to a normal request
 * for anything else. Everything here is best-effort: any failure leaves the
 * global unset and boot proceeds exactly as it did before.
 */
(function startRacePrefetch() {
  "use strict";
  try {
    // Mirrors `fetchDailyManifest`; keep the query shape in sync with
    // DailyTrackTransportV1's DAILY_TRACK_ENCODING_PARAM_V1/_DELTA_V1.
    var ENCODING = "enc=d1";
    // This file ships next to index.html, so its own URL IS the app base — the
    // same value `defaultSwervleApiBaseV1` derives from `import.meta.env.BASE_URL`.
    // Deriving it here keeps a non-root deployment (`--base=/swervle/`) from
    // either missing the prefetch or aiming it at the wrong origin path.
    var self = document.currentScript;
    if (!self) return;
    var base = new URL(".", self.src).pathname;
    var pathname = window.location.pathname;
    if (pathname.indexOf(base) !== 0) return;
    var segments = pathname.slice(base.length).split("/").filter(Boolean);
    var path = null;

    if (segments.length === 0) {
      path = "/daily?" + ENCODING;
    } else if (segments.length === 2 && segments[0] === "daily") {
      path = "/daily?date=" + encodeURIComponent(segments[1]) + "&" + ENCODING;
    }
    // Challenge routes (`/r/<id>`), admin, and everything else resolve through a
    // different endpoint or no race at all — leave them to the normal path.
    if (path === null) return;
    // An admin staged test drive resolves a different, digest-scoped document.
    if (window.location.search.indexOf("adminTest=") !== -1) return;

    // `base` ends in "/" and `path` starts with "/" — the same join
    // `defaultSwervleApiBaseV1` does, so the URL is byte-identical to the one the
    // gateway would have built. A mismatch here is silent and expensive: the
    // prefetch goes unclaimed and the document is downloaded twice.
    // `priority: "low"` matters as much as starting early does. The bundle is the
    // only thing that can draw UI, and letting this race it for bandwidth pushed
    // first contentful paint on Slow 4G from 2.7s to 6.0s. Low priority keeps the
    // document in flight from the head while the bundle still gets the pipe.
    // Unknown init properties are ignored, so this is inert on older browsers.
    var response = fetch(base + "api/v1" + path, {
      credentials: "same-origin",
      headers: { accept: "application/json" },
      method: "GET",
      priority: "low",
    });
    // The gateway may never claim this (local mode, an unreachable edge, a
    // challenge redirect). Swallow the rejection here so an unclaimed prefetch
    // can never surface as an unhandled promise rejection.
    response.catch(function ignore() { /* claimed-or-not, failures are not fatal */ });
    window.__SWERVLE_RACE_PREFETCH__ = { path: path, response: response };
  } catch (error) {
    // Prefetching is an optimisation and must never be able to break boot.
    void error;
  }
})();
