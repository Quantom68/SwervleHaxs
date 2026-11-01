/* global document, window, location */
import { ownStatsView, dailySearchView, publicRacerView, standingsView } from 'player-views.mjs7982.js?v=root-scopes-2';
import { formatFinishTime } from 'analytics.mjs';
const base=document.body.dataset.siteBase || '';
const hosted=location.origin==='index.html';
const accountPanel=document.querySelector('[data-account-panel]');
const search=document.querySelector('[data-racer-search]');
const accountLink=document.querySelector('nav a[href$="/account"]');
const publicPrefix=hosted?'':'/public-api';
async function api(path,privateRead=false) {
 const key=`swervle-public-v2:${path}`;
 if(!privateRead) {try {const saved=JSON.parse(sessionStorage.getItem(key));if(saved?.expires>Date.now())return saved.value;}catch { /* storage unavailable */ }}
 // Anonymous public reads use gold's shared board memo. Only My stats needs
 // a session; never send a viewer cookie with public racer lookups.
 const response=await fetch(`${privateRead?'':publicPrefix}${path}`,{credentials:privateRead&&hosted?'same-origin':'omit',cache:privateRead?'no-store':'default',signal:AbortSignal.timeout(8000)});
 if(!response.ok) {const error=new Error('Could not load this information.');error.status=response.status;throw error;}
 const value=await response.json();
 if(!privateRead) {try {sessionStorage.setItem(key,JSON.stringify({expires:Date.now()+60000,value}));}catch { /* storage full */ }}
 return value;
}
function signedOut() {
 accountPanel.innerHTML=`<section class="card account-empty"><h2>Sign in to Swervle</h2><p>Your race history, daily position, XP and medals use the same account as the game.</p><div class="account-actions"><a class="button primary-button" href="https://swervle.com/api/v1/auth/google/start?returnTo=${encodeURIComponent(base+'/account')}">Sign in with Google</a><a class="small-button" href="index.html">Sign in through the game</a></div></section>`;
}
async function loadAccount(session) {
 if(session?.authenticated!==true || session.principalKind!=='account') {signedOut();return;}
 const state={session,progression:null,runs:null,base,progressionLoading:true,runsLoading:true};
 let expired=false, dailyMarkup='<p>Loading today&#39;s position...</p>';
 const paint=()=>{
  if(expired)return;
  accountPanel.innerHTML=ownStatsView(state);
  accountPanel.querySelector('[data-own-today]').innerHTML=dailyMarkup;
  accountPanel.querySelector('[data-show-history]')?.addEventListener('click',event=>{accountPanel.querySelector('.account-history').classList.add('is-expanded');event.currentTarget.hidden=true;});
 };
 paint();
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const load=async (path,accept,finish)=>{
  try {accept(await api(path,true));}
  catch(error) {if(error.status===401){expired=true;signedOut();}}
  finally {finish();paint();}
 };
 await Promise.all([
  load('/api/v1/me/progression',value=>{state.progression=value;},()=>{state.progressionLoading=false;}),
  load('/api/v1/account/runs',value=>{state.runs=Array.isArray(value.runs)?value.runs:null;},()=>{state.runsLoading=false;}),
  load(`/api/v1/me/board-row?daily=${today}&scope=day`,daily=>{
   dailyMarkup=`<div class="account-today"><div><h3>Today&#39;s race</h3><p>${daily.row?`Position #${daily.row.rank.toLocaleString('en-US')}${Number.isFinite(daily.total)?` of ${daily.total.toLocaleString('en-US')}`:''}`:'No finish on today&#39;s board yet.'}</p></div>${daily.row?`<strong>${formatFinishTime(daily.row.displayTimeMs)}</strong>`:''}<a class="small-button" href="index.html">Race now</a></div>`;
  },()=>{if(dailyMarkup.includes('Loading'))dailyMarkup='<p>Your daily position could not be loaded. Refresh to try again.</p>';}),
 ]);
}
async function sessionState() {
 if(!hosted) {
  if(accountPanel) accountPanel.querySelector('[data-account-message]').textContent='Your signed-in account lives on swervle.com. Open My Stats there to use your game session.';
  return;
 }
 try {
  if(accountPanel) accountPanel.querySelector('[data-account-message]').textContent='Checking your Swervle sign-in...';
  const session=await api('/api/v1/session',true);
  if(session.authenticated===true && session.principalKind==='account' && accountLink) {accountLink.textContent='My stats';accountLink.title=`Signed in as ${session.publicDisplayName}`;accountLink.dataset.signedIn='true';}
  if(accountPanel) await loadAccount(session);
 }catch(error) {if(accountPanel && error.status===401){signedOut();return;}if(accountPanel) accountPanel.innerHTML='<section class="card account-empty"><h2>Account unavailable</h2><p>Your account could not be loaded. Your game session has not been changed.</p><div class="account-actions"><button class="small-button" type="button" data-retry-account>Try again</button><a class="small-button" href="index.html">Open game</a></div></section>';}
 accountPanel?.querySelector('[data-retry-account]')?.addEventListener('click',()=>{window.location.reload();});
}
if(accountPanel) void sessionState();
if(search) {
 const params=new URLSearchParams(location.search);
 const daily=params.get('daily');
 if(daily && [...search.elements.daily.options].some(option=>option.value===daily))search.elements.daily.value=daily;
 else if(daily && /^\d{4}-\d{2}-\d{2}$/.test(daily)) {const option=document.createElement('option');option.value=daily;option.textContent=daily;search.elements.daily.append(option);search.elements.daily.value=daily;}
 search.elements.q.value=(params.get('q')||'').slice(0,40);
 search.addEventListener('submit',event=>{event.preventDefault();const query=new URLSearchParams({q:search.elements.q.value,daily:search.elements.daily.value,scope});window.location.href=`${base}/racers?${query}`;});
 const panel=document.querySelector('[data-racer-panel]');
 const standingsPanel=document.querySelector('[data-standings-panel]');
 const run=params.get('run');
 const scope=params.get('scope')==='all'?'all':'day';
 const selected=search.elements.daily.value;
 async function loadRacer() {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(selected)) throw new Error('Choose a race day.');
  if(run) {
   if(!/^[A-Za-z0-9._-]{1,160}$/.test(run))throw new Error('Invalid racer link.');
   const profile=await api(`/api/v1/dailies/${selected}/leaderboard/${encodeURIComponent(run)}/attempts?scope=${scope}`);
   const matches=await api(`/api/v1/dailies/${selected}/leaderboard?scope=${scope}&limit=100&q=${encodeURIComponent(profile.publicDisplayName)}`).catch(()=>({entries:[]}));
   const row=matches.entries.find(entry=>entry.publicRunId===profile.publicRunId)??null;
   panel.innerHTML=publicRacerView(profile,row,base,scope);
  } else {
   const page=await api(`/api/v1/dailies/${selected}/leaderboard?scope=${scope}&limit=25&q=${encodeURIComponent(search.elements.q.value)}`);
   panel.innerHTML=dailySearchView(page,base,scope);
  }
 }
 const hasQuery=Boolean(run || params.get('q')?.trim() || (params.get('daily') && params.get('daily')!==panel.dataset.snapshotDay) || scope==='all');
 if(hasQuery) {panel.innerHTML='<p class="quiet">Loading search results...</p>';void loadRacer().catch(()=>{panel.innerHTML='<section class="card account-empty"><h2>Race results unavailable</h2><p>This racer may no longer be on the selected board. Search again or choose another day.</p></section>';});}
 if(!run && params.get('q')?.trim())void api(`/api/v1/standings?limit=25&offset=0&q=${encodeURIComponent(search.elements.q.value)}`).then(page=>{standingsPanel.innerHTML=standingsView(page);}).catch(()=>{standingsPanel.innerHTML='<p class="account-status">Career standings could not be loaded. Refresh to try again.</p>';});
}
