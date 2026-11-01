// Swervle Haxs: shows the rank a local run would get on the real leaderboard.
// The patched bundle calls window.__haxsDailyRank(dailyId, durationTicks) from
// the game's dailyRank(). We ask the standing endpoint and overwrite the YOU
// row's rank. Load in the MAIN world at document_start (before the game).
(function () {
  "use strict";
  let standing = null;

  function applyRank() {
    if (!standing) return;
    for (const li of document.querySelectorAll('li[data-player="true"]')) {
      const r = li.querySelector(".leaderboard-rank");
      const you = li.querySelector(".leaderboard-name strong");
      if (r && you?.textContent.trim() === "YOU" && r.textContent !== String(standing.rank)) {
        r.textContent = String(standing.rank);
        r.setAttribute("aria-label", `Rank ${standing.rank}`);
      }
    }
  }

  // The game re-renders the board; re-apply after any DOM change (cheap no-op when nothing differs).
  let queued = false;
  const observe = () =>
    new MutationObserver(() => {
      if (queued || !standing) return;
      queued = true;
      requestAnimationFrame(() => ((queued = false), applyRank()));
    }).observe(document.documentElement, { childList: true, subtree: true });
  if (document.documentElement) observe();
  else document.addEventListener("DOMContentLoaded", observe, { once: true });

  window.__haxsDailyRank = async (dailyId, ticks) => {
    standing = null;
    if (!Number.isSafeInteger(ticks) || ticks < 1) return;
    try {
      // Always the real server: an offline build has no API of its own.
      const res = await fetch(`https://swervle.com/api/v1/dailies/${encodeURIComponent(dailyId)}/standing?ticks=${ticks}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const j = await res.json();
      const rank = j?.rank ?? j?.standing?.rank;
      if (rank == null) throw new Error("no rank in response");
      standing = { rank };
      applyRank();
    } catch (e) {
      console.warn("[Swervle Haxs] rank lookup failed:", e);
    }
  };
})();
