// Public finish times only: no account IDs, names, or run identifiers.
export function summarizeTimes(times) {
  const sorted = times.filter(value => Number.isFinite(value) && value > 0).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const timeCounts = [];
  for (const value of sorted) {
    const previous = timeCounts.at(-1);
    if (previous?.[0] === value) previous[1] += 1;
    else timeCounts.push([value, 1]);
  }
  const quantile = fraction => {
    const index = (sorted.length - 1) * fraction;
    const low = Math.floor(index);
    return sorted[low] + (sorted[Math.ceil(index)] - sorted[low]) * (index - low);
  };
  return { count: sorted.length, minMs: sorted[0], maxMs: sorted.at(-1),
    q25Ms: quantile(0.25), q75Ms: quantile(0.75), timeCounts };
}

export function parseFinishTime(value) {
  const match = /^(?:(\d+):)?(\d+(?:\.\d{1,3})?)$/.exec(String(value).trim());
  if (!match || (match[1] !== undefined && Number(match[2]) >= 60)) return null;
  const milliseconds = Math.round(((Number(match[1]) || 0) * 60 + Number(match[2])) * 1000);
  return Number.isSafeInteger(milliseconds) && milliseconds > 0 ? milliseconds : null;
}

export function compareTime(timeCounts, milliseconds) {
  if (!Number.isFinite(milliseconds) || milliseconds <= 0 || !timeCounts?.length) return null;
  let faster = 0;
  let tied = 0;
  let slower = 0;
  for (const [time, count] of timeCounts) {
    if (time < milliseconds) faster += count;
    else if (time === milliseconds) tied += count;
    else slower += count;
  }
  const total = faster + tied + slower;
  return total ? { total, faster, tied, slower, rank: faster + 1, fasterThanPct: slower / total * 100 } : null;
}

export function formatFinishTime(value) {
  if (!Number.isFinite(value)) return '—';
  const ms = Math.round(value);
  return `${Math.floor(ms / 60000)}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}.${String(ms % 1000).padStart(3, '0')}`;
}

export function percentileTime(timeCounts, percentile) {
  const total = timeCounts.reduce((sum, [, count]) => sum + count, 0);
  if (!total) return null;
  const target = Math.max(1, Math.ceil(total * Math.max(0, Math.min(100, percentile)) / 100));
  let count = 0;
  for (const [time, frequency] of timeCounts) {
    count += frequency;
    if (count >= target) return time;
  }
  return null;
}

export function rankTargets(timeCounts) {
  const total = timeCounts.reduce((sum, [, count]) => sum + count, 0);
  const ranks = [1, 10, 100, Math.ceil(total / 2)];
  return [...new Set(ranks)].filter(rank => rank > 0 && rank <= total).sort((a,b) => a-b).map(rank => {
    let counted = 0;
    const timeMs = timeCounts.find(([, count]) => { counted += count; return counted >= rank; })[0];
    return { rank, timeMs, label: rank === 1 ? 'Leader' : rank === Math.ceil(total / 2) && rank > 100 ? 'Top half' : `Top ${rank}` };
  });
}

export function raceComparison(timeCounts, milliseconds) {
  const result = compareTime(timeCounts, milliseconds);
  if (!result) return null;
  const ahead = timeCounts.findLast(([time]) => time < milliseconds);
  const nextTimeMs = ahead ? Math.max(1, ahead[0] - 1) : null;
  return { ...result, gapMs: milliseconds - timeCounts[0][0], nextTimeMs,
    nextRank: nextTimeMs === null ? null : compareTime(timeCounts, nextTimeMs).rank,
    gainMs: nextTimeMs === null ? null : milliseconds - nextTimeMs };
}

// Frequency-weighted quartiles (linear interpolation) and a Gaussian density.
// Keep repeated times as counts rather than expanding a potentially large board.
export function finishDistribution(timeCounts, { focused = false } = {}) {
  const frequencies = new Map();
  for (const entry of timeCounts ?? []) {
    if (!Array.isArray(entry)) continue;
    const [time, count] = entry;
    if (Number.isFinite(time) && time > 0 && Number.isSafeInteger(count) && count > 0)
      frequencies.set(time, (frequencies.get(time) ?? 0) + count);
  }
  const counts = [...frequencies].sort((a, b) => a[0] - b[0]);
  if (!counts.length) return null;
  const count = counts.reduce((sum, [, n]) => sum + n, 0);
  const at = index => {
    let seen = 0;
    for (const [time, n] of counts) { seen += n; if (seen > index) return time; }
    return counts.at(-1)[0];
  };
  const quantile = p => {
    const index = (count - 1) * p;
    return at(Math.floor(index)) + (at(Math.ceil(index)) - at(Math.floor(index))) * (index % 1);
  };
  const min = counts[0][0], max = counts.at(-1)[0];
  const q1 = quantile(.25), median = quantile(.5), q3 = quantile(.75);
  const iqr = q3 - q1;
  const low = counts.find(([time]) => time >= q1 - 1.5 * iqr)[0];
  const high = counts.findLast(([time]) => time <= q3 + 1.5 * iqr)[0];
  const outliers = counts.filter(([time]) => time < low || time > high);
  const mean = counts.reduce((sum, [time, n]) => sum + time * n, 0) / count;
  const sd = Math.sqrt(counts.reduce((sum, [time, n]) => sum + n * (time - mean) ** 2, 0) / Math.max(1, count - 1));
  // Robust univariate bandwidth: extreme slow finishes must not flatten the pack.
  const scale = iqr > 0 ? Math.min(sd, iqr / 1.34) : sd;
  const bandwidth = Math.max(1, .9 * scale * count ** (-.2), (max - min) / 640);
  // Never draw or inspect a faster time than the actual leader. The short-time
  // view stops at Q3; slow outliers still contribute to the underlying statistics.
  // A tied-only field needs a nonzero axis, but it has no fabricated density.
  const domain = [min, Math.max(min + 1, focused ? q3 : max)];
  const outsideCount = counts.reduce((sum, [time, n]) => sum + (time > domain[1] ? n : 0), 0);
  const density = min === max ? [] : Array.from({ length: 161 }, (_, i) => {
    const time = domain[0] + (domain[1] - domain[0]) * i / 160;
    const value = counts.reduce((sum, [value, n]) => {
      const z = (time - value) / bandwidth;
      return Math.abs(z) > 6 ? sum : sum + n * Math.exp(-.5 * z * z);
    }, 0) / (count * bandwidth * Math.sqrt(2 * Math.PI));
    return [time, value];
  });
  const peakMs = density.length ? density.reduce((best, point) => point[1] > best[1] ? point : best)[0] : min;
  return { count, min, max, q1, median, mean, peakMs, q3, low, high, outliers, domain, density, outsideCount };
}
