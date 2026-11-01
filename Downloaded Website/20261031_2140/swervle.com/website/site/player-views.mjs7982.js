import { formatFinishTime } from 'analytics.mjs';
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const n = value => Number.isFinite(value) ? value.toLocaleString('en-US') : '\u2014';
const t = value => Number.isFinite(value) && value > 0 ? formatFinishTime(value) : '\u2014';
const day = value => /^\d{4}-\d{2}-\d{2}$/.test(String(value)) ? new Date(`${value}T12:00:00Z`).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'America/Chicago'}) : '';
const metrics = rows => `<dl class="account-metrics">${rows.map(([label,value])=>`<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl>`;
export function groupOwnRuns(runs) {
 const days = new Map();
 for (const run of runs) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(run.dailyId) || !Number.isFinite(run.displayTimeMs) || run.displayTimeMs<=0) continue;
  const row=days.get(run.dailyId) ?? {dailyId:run.dailyId,count:0,bestMs:Infinity,rank:null,publicRunId:null};
  row.count++;
  if(run.displayTimeMs<row.bestMs) row.bestMs=run.displayTimeMs;
  if(run.leaderboardEligible===true && run.verified===true && Number.isSafeInteger(run.rank) && run.rank>0 && (row.rank===null || run.rank<row.rank)) {row.rank=run.rank;row.publicRunId=run.publicRunId;}
  days.set(run.dailyId,row);
 }
 return [...days.values()].sort((a,b)=>b.dailyId.localeCompare(a.dailyId));
}
export function ownStatsView({session,progression,runs,base='',progressionLoading=false,runsLoading=false}) {
 const history=runs===null?null:groupOwnRuns(runs);
 const medals=progression?.medals;
 const podiums=medals ? medals.golds+medals.silvers+medals.bronzes : null;
 const joined=session.joinedAtIso ? new Date(session.joinedAtIso).toLocaleDateString('en-US',{month:'long',year:'numeric',timeZone:'America/Chicago'}) : null;
 const recorded=history?.reduce((sum,row)=>sum+row.count,0);
 return `<section class="card"><header class="account-heading"><div><h2>${escapeHtml(session.publicDisplayName || 'Racer')}</h2><p>${joined?`Racing since ${escapeHtml(joined)}`:'Your Swervle account'}</p></div><a class="small-button" href="https://swervle.com/">Open game</a></header>${metrics([['Days raced',n(progression?.daysRaced)],['Recorded finishes',n(recorded)],['Career XP',n(progression?.xp)],['Podiums',n(podiums)]])}${medals?`<div class="medal-totals"><span>Gold <strong>${n(medals.golds)}</strong></span><span>Silver <strong>${n(medals.silvers)}</strong></span><span>Bronze <strong>${n(medals.bronzes)}</strong></span></div>`:progressionLoading?'<p class="account-status">Loading career totals...</p>':'<p class="account-status">Career totals could not be loaded. Refresh to try again.</p>'}</section><section class="card account-section" data-own-today><p>Loading your current daily position...</p></section><section class="card account-section"><div class="section-heading"><div><h2>Your race history</h2></div></div>${runsLoading?'<p>Loading your race history...</p>':history===null?'<p>Your history could not be loaded. Refresh to try again.</p>':!history.length?'<p>Your verified finishes will appear here after you race.</p>':`<div class="table-scroll account-history"><table><thead><tr><th>Race day</th><th class="numeric">Best time</th><th class="numeric">Finishes</th><th class="numeric">Position</th></tr></thead><tbody>${history.map(row=>`<tr><td><a href="https://swervle.com/daily/${row.dailyId}">${day(row.dailyId)}</a></td><td class="numeric">${t(row.bestMs)}</td><td class="numeric">${n(row.count)}</td><td class="numeric">${row.rank===null?'Not recorded':`<a href="${base}/racers?daily=${row.dailyId}&amp;scope=all&amp;run=${encodeURIComponent(row.publicRunId)}">#${n(row.rank)}</a>`}</td></tr>`).join('')}</tbody></table></div>${history.length>20?'<button class="small-button show-all" type="button" data-show-history>Show all race days</button>':''}`}</section>`;
}
export function dailySearchView(page,base='',scope='day') {
 const hasAttempts=page.entries.some(row=>Number.isFinite(row.attemptCount));
 return `<section class="card account-section"><div class="section-heading"><div><h2>${day(page.dailyId)}</h2><p>${n(page.total)} matching racers on the ${scope==='all'?'all-time':'day-of'} board</p></div></div>${page.entries.length?`<div class="table-scroll"><table><thead><tr><th>Pos.</th><th>Racer</th><th class="numeric">Best time</th>${hasAttempts?'<th class="numeric">Finishes</th>':''}</tr></thead><tbody>${page.entries.map(row=>`<tr><td>#${n(row.rank)}</td><td><a class="racer-link" href="${base}/racers?daily=${encodeURIComponent(page.dailyId)}&amp;scope=${scope}&amp;run=${encodeURIComponent(row.publicRunId)}">${escapeHtml(row.publicDisplayName)}</a></td><td class="numeric">${t(row.displayTimeMs)}</td>${hasAttempts?`<td class="numeric">${n(row.attemptCount)}</td>`:''}</tr>`).join('')}</tbody></table></div>`:'<p>No racers match this search on the selected day.</p>'}${page.nextCursor?'<p>Showing the first 25 matches. Refine the name to narrow the results.</p>':''}</section>`;
}
export function publicRacerView(profile,boardRow,base='',scope='day') {
 const attempts=profile.attempts.filter(run=>Number.isFinite(run.displayTimeMs)&&run.displayTimeMs>0);
 const best=attempts.length?Math.min(...attempts.map(run=>run.displayTimeMs)):null;
 const chronological=[...attempts].sort((a,b)=>a.verifiedAtIso.localeCompare(b.verifiedAtIso));
 const improvement=chronological.length ? chronological[0].displayTimeMs-best : null;
 const scopeLabel=scope==='all'?'All verified finishes on this track':'Verified on this race day';
 return `<a class="back-link" href="${base}/racers?daily=${encodeURIComponent(profile.dailyId)}&amp;scope=${scope}">All racers</a><section class="card"><header class="account-heading"><div><h2>${escapeHtml(profile.publicDisplayName)}</h2><p>${day(profile.dailyId)} &middot; ${scopeLabel}</p></div><a class="small-button" href="https://swervle.com/daily/${encodeURIComponent(profile.dailyId)}">Race this track</a></header>${metrics([['Position',boardRow?`#${n(boardRow.rank)}`:'Not available'],['Best time shown',t(best)],['Attempts',n(profile.total)],['Improvement shown',improvement===null?'\u2014':`${(improvement/1000).toFixed(3)}s`]])}</section><section class="card account-section"><div class="section-heading"><div><h2>Attempts</h2><p>${n(attempts.length)} of ${n(profile.total)} finishes shown. Improvement compares the earliest shown finish with the best shown time.</p></div></div><div class="table-scroll"><table><thead><tr><th>Verified</th><th class="numeric">Finish time</th><th class="numeric">Off best shown</th></tr></thead><tbody>${chronological.reverse().map(run=>`<tr><td>${escapeHtml(new Date(run.verifiedAtIso).toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZone:'America/Chicago',timeZoneName:'short'}))}</td><td class="numeric"><a href="../../r/%24%7bencodeURIComponent(run.publicRunId)%7d.html">${t(run.displayTimeMs)}</a></td><td class="numeric">+${((run.displayTimeMs-best)/1000).toFixed(3)}s</td></tr>`).join('')}</tbody></table></div>${!attempts.length?'<p>No public attempts are available.</p>':''}</section>`;
}
export function standingsView(page) {
 return `<section class="card account-section"><div class="section-heading"><div><h2>Career standings</h2><p>Public XP and medals. ${n(page.total)} matching racers.</p></div></div>${page.entries.length?`<div class="table-scroll"><table><thead><tr><th>Pos.</th><th>Racer</th><th class="numeric">XP</th><th class="numeric">Days</th><th class="numeric">Gold / Silver / Bronze</th></tr></thead><tbody>${page.entries.map(row=>`<tr><td>#${n(row.rank)}</td><td>${escapeHtml(row.publicDisplayName)}${row.isViewer?' <span class="data-tag">You</span>':''}</td><td class="numeric">${n(row.xp)}</td><td class="numeric">${n(row.daysRaced)}</td><td class="numeric">${n(row.golds)} / ${n(row.silvers)} / ${n(row.bronzes)}</td></tr>`).join('')}</tbody></table></div>`:'<p>No career standings match this search.</p>'}</section>`;
}
